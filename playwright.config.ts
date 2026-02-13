/**
 * Playwright
 */

/* Imports */

import { defineConfig, devices } from '@playwright/test'

/* Config */

export default defineConfig({
  testDir: './spec',
  testMatch: '**/*.spec.js',
  globalSetup: './tests/setup.ts',
  globalTeardown: './tests/teardown.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    [
      'list', {
        printSteps: true
      }
    ]
  ],
  use: {
    headless: true,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'pnpm serve',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox']
      }
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari']
      }
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 6']
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13']
      }
    }
  ]
})
