/**
 * Test - Spec Teardown
 */

/* Imports */

import { writeFile } from 'node:fs/promises'
import { testLoadCoverage } from './testSpecCoverage.js'

/**
 * Create coverage file
 *
 * @return {void}
 */
async function testTeardown (): Promise<void> {
  try {
    const data = await testLoadCoverage()
    await writeFile('coverage.json', JSON.stringify(data))

    console.info('[FRM] Success creating spec coverage file')
  } catch (error) {
    console.error('[FRM] Error creating spec coverage file: ', error)
  }
}

/* Exports */

export default testTeardown
