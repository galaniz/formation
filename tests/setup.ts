/**
 * Tests - Setup
 */

/* Imports */

import { setupCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Set up */

export default async function (): Promise<void> {
  await setupCoverage({
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
}
