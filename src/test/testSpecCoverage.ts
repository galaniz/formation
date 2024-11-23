/**
 * Test - Spec Coverage
 */

/* Imports */

import type { Page } from '@playwright/test'
import type { ReportOptions } from 'istanbul-reports'
import { appendFile, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { glob } from 'glob'
import v8toIstanbul from 'v8-to-istanbul'
import libCoverage from 'istanbul-lib-coverage'
import libReport from 'istanbul-lib-report'
import reports from 'istanbul-reports'

/**
 * @typedef {object} TestCoverageRangeData
 * @prop {number} count
 * @prop {number} startOffset
 * @prop {number} endOffset
 */
interface TestCoverageRangeData {
  count: number
  startOffset: number
  endOffset: number
}

/**
 * @typedef {object} TestCoverageFnData
 * @prop {string} functionName
 * @prop {boolean} isBlockCoverage
 * @prop {TestCoverageRangeData[]} ranges
 */
interface TestCoverageFnData {
  functionName: string
  isBlockCoverage: boolean
  ranges: TestCoverageRangeData[]
}

/**
 * @typedef {object} TestCoverageData
 * @param {string} url
 * @param {string} scriptId
 * @param {string} [source]
 * @param {TestCoverageFnData[]} functions
 */
interface TestCoverageData {
  url: string
  scriptId: string
  source?: string
  functions: TestCoverageFnData[]
}

/**
 * Temporary coverage file name
 *
 * @type {string}
 */
const testCoverageTempFile: string = 'coverage-tmp.json'

/**
 * Separator for temporary file data
 *
 * @type {string}
 */
const testCoverageBreak: string = '*|FRM_BREAK|*'

/**
 * Start and end playwright coverage and save to temp file
 *
 * @param {string} browserName
 * @param {Page} page
 * @param {boolean} [start=true]
 * @return {Promise<void>}
 */
const testDoCoverage = async (
  browserName: string,
  page: Page,
  start: boolean = true
): Promise<void> => {
  try {
    if (browserName !== 'chromium') {
      return
    }

    if (start) {
      return await page.coverage.startJSCoverage()
    }

    const result = await page.coverage.stopJSCoverage()

    await appendFile(testCoverageTempFile, JSON.stringify(result) + testCoverageBreak)
  } catch (error) {
    console.error('[FRM] Error appending to temporary spec coverage file: ', error)
  }
}

/**
 * Convert playwright coverage data
 *
 * @return {Promise<CoverageMapData[]>}
 */
const testLoadCoverage = async (): Promise<TestCoverageData[]> => {
  try {
    const fileData = await readFile(testCoverageTempFile, 'utf8')
    const entries = fileData.split(testCoverageBreak).filter(Boolean)
    const coverage: TestCoverageData[] = entries.map(entry => JSON.parse(entry)).flat(Infinity)

    const result = coverage.map((entry) => {
      const { url, source } = entry

      if (source == null) {
        return entry
      }

      const sourceFile = url.replace('http://localhost:3000/', '').replace('.js', '.js.map')
      const newSource = source.replace(/sourceMappingURL=([^]+)\.map/, `sourceMappingURL=${sourceFile}`)

      entry.source = newSource
      entry.url = url.replace('http://localhost:3000/', './')

      return entry
    })

    return result
  } catch (error) {
    console.error('[FRM] Error loading spec coverage data:', error)
    return []
  }
}

/**
 * Create coverage report from data json
 *
 * @return {Promise<void>}
 */
const testCreateCoverageReport = async (): Promise<void> => {
  try {
    /* Coverage data map */

    const coverageFile = await readFile('coverage.json', 'utf8')
    const coverageData = JSON.parse(coverageFile)
    const map = libCoverage.createCoverageMap()
    const covered: string[] = []

    for (const entry of coverageData) {
      const entryUrl = entry.url
      const isUtil = entryUrl.startsWith('./spec/utils/')
      const isConfig = entryUrl.startsWith('./spec/config/')
      const isTest = entryUrl.startsWith('./spec/test/') || entryUrl.endsWith('spec.js')
      const isType = entryUrl.endsWith('Types.js')

      if (isUtil || isConfig || isTest || isType) {
        continue
      }

      const converter = v8toIstanbul(entryUrl)
      await converter.load()
      converter.applyCoverage(entry.functions)

      const convertedCoverage = converter.toIstanbul()
      map.merge(convertedCoverage)

      covered.push(entryUrl)
    }

    /* Include outstanding files from src in map */

    const srcFiles = await glob('spec/**/*.js', {
      ignore: [
        'spec/config/**/*.js',
        'spec/utils/**/*.js',
        'spec/test/*.js',
        'spec/**/*.spec.js',
        'spec/**/*Types.js'
      ]
    })

    for (const file of srcFiles) {
      if (covered.includes(`./${file}`)) {
        continue
      }

      const filePath = resolve(file)
      const srcFilePath = filePath.replace('spec', 'src').replace('.js', '.ts')
      const srcEntry: libCoverage.CoverageMapData = {}

      srcEntry[srcFilePath] = {
        path: srcFilePath,
        statementMap: {},
        s: {},
        branchMap: {},
        b: {},
        fnMap: {},
        f: {},
        // @ts-expect-error
        lineCoverage: {}
      }

      map.merge(srcEntry)
    }

    /* Context */

    const context = libReport.createContext({
      dir: './coverage-report',
      coverageMap: map
    })

    /* Reporters */

    const reporters = ['text', 'html'] // 'lcov'

    reporters.forEach(reporter => {
      const report = reports.create(reporter as keyof ReportOptions, {
        projectRoot: resolve('./')
      })

      report.execute(context)
    })
  } catch (error) {
    console.error('[FRM] Error creating spec coverage report:', error)
  }
}

/* Exports */

export {
  testDoCoverage,
  testLoadCoverage,
  testCreateCoverageReport
}
