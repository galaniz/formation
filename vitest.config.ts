/**
 * Vitest
 */

/* Imports */

import { defineConfig } from 'vitest/config'

/* Config */

export default defineConfig({
  test: {
    cache: false,
    globals: true,
    clearMocks: true,
    environment: 'jsdom',
    include: [
      'src/**/*.test.ts'
    ],
    coverage: {
      include: [
        'src/config/**/*.ts',
        'src/utils/**/*.ts'
      ],
      exclude: [
        '**/*.test.ts',
        'src/tests/*.ts',
        'src/**/*Types.ts',
        'src/**/*Mock.ts'
      ]
    }
  }
})
