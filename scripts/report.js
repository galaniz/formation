// @ts-check

/**
 * Scripts - Report
 */

/* Imports */

import { createCoverageReport } from '@alanizcreative/formation-coverage/coverage.js'

/* Coverage report for spec tests */

createCoverageReport({
  outDir: 'spec',
  srcDir: 'src',
  reporters: [
    'text',
    'html'
  ],
  include: [
    'spec/components/**/*.js',
    'spec/effects/**/*.js',
    'spec/layouts/**/*.js',
    'spec/objects/**/*.js'
  ],
  exclude (entry) {
    const isUtil = entry.startsWith('spec/utils/')
    const isConfig = entry.startsWith('spec/config/')
    const isTest = entry.startsWith('spec/tests') || entry.endsWith('spec.js')
    const isType = entry.endsWith('Types.js')

    if (isUtil || isConfig || isTest || isType) {
      return true
    }

    return false
  }
})
