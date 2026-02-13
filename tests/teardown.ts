/**
 * Tests - Teardown
 */

/* Imports */

import { createCoverageReport } from '@alanizcreative/formation-coverage/coverage.js'

/* Create coverage report */

export default async function (): Promise<void> {
  await createCoverageReport()
}
