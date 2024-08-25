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
    environment: 'happy-dom',
    setupFiles: 'src/tests/testSetup.ts',
    coverage: {
      include: [
        'src/**/*.ts'
      ]
    }
  }
})
