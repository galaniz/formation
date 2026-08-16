/**
 * Layouts - Masonry Test
 */

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

  test('should initialize if contains required elements', async ({ page }) => {
    const masonryInit = await page.evaluate(() => {
      const masonry: Masonry[] = Array.from(document.querySelectorAll('frm-masonry'))
      return masonry.map(msn => msn.init)
    })

    expect(masonryInit).toStrictEqual([
      false, // #msn-empty
      false  // #msn
    ])
  })
})
