/**
 * Tests - Setup
 */

/* Imports */

import { setCoverageConfig } from '@alanizcreative/formation-coverage/coverageConfig.js'
import { setupCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Setup */

export default async function (): Promise<void> {
  await setCoverageConfig({
    dir: 'spec-coverage',
    file: 'spec-coverage.json',
    url: 'http://localhost:3000',
    outDir: 'spec',
    srcDir: 'src',
    reporters: [
      'text'
    ],
    include: [
      'spec/components/**/*.js',
      'spec/effects/**/*.js',
      'spec/layouts/**/*.js',
      'spec/objects/**/*.js'
    ],
    exclude: [
      'spec/utils/**/*.js',
      'spec/config/**/*.js',
      'spec/**/*.spec.js',
      'spec/**/*Types.js'
    ]
  })

  await setupCoverage()
}
