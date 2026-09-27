/**
 * Vitest
 */

import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    clearMocks: true,
    restoreMocks: true,
    environment: 'happy-dom',
    include: [
      'src/**/*.test.ts'
    ],
    coverage: {
      reportsDirectory: 'utils-coverage',
      include: [
        'src/config/**/*.ts',
        'src/utils/**/*.ts'
      ],
      exclude: [
        '**/*.test.ts',
        'src/**/*Types.ts'
      ]
    }
  }
})
