/**
 * Layouts - Masonry Test
 */

/* Imports */

import type { Masonry } from '../Masonry.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Masonry', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/layouts/Masonry/__tests__/Masonry.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const masonryInit = await page.evaluate(() => {
      const masonry = document.querySelector('#msn-empty') as Masonry
      return masonry.init
    })

    expect(masonryInit).toBe(false)
  })
})
