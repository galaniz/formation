/**
 * Objects - Media Test
 */

/* Imports */

import type { Media } from '../Media.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Media', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Media/__tests__/Media.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const mediaInit = await page.evaluate(() => {
      const media = document.querySelector('#med-empty') as Media
      return media.init
    })

    expect(mediaInit).toBe(false)
  })
})
