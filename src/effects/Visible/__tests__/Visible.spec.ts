/**
 * Effects - Visible Test
 */

/* Imports */

import type { Visible } from '../Visible.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Visible', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/effects/Visible/__tests__/Visible.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const visibleInit = await page.evaluate(() => {
      const visible = document.querySelector('#vis-empty') as Visible
      return visible.init
    })

    expect(visibleInit).toBe(false)
  })
})
