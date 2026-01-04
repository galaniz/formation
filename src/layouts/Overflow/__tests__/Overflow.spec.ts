/**
 * Layouts - Overflow Test
 */

/* Imports */

import type { Overflow } from '../Overflow.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Overflow', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/layouts/Overflow/__tests__/Overflow.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const overflowInit = await page.evaluate(() => {
      const overflow = document.querySelector('#ov-empty') as Overflow
      return overflow.init
    })

    expect(overflowInit).toBe(false)
  })
})
