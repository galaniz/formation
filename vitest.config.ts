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
        'src/**/*Types.ts',
        'src/test/*.ts'
      ]
    }
  }
})
