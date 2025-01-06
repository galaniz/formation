/**
 * Setup - Teardown
 */

/* Imports */

import { setupCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/**
 * Create coverage file for playwright
 *
 * @return {void}
 */
async function teardown (): Promise<void> {
  await setupCoverage('spec-coverage', 'coverage')
}

/* Exports */

export default teardown
