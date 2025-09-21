/**
 * Objects - Tabs Test
 */

/* Imports */

import type { Tabs } from '../Tabs.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Tabs', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Tabs/__tests__/Tabs.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const tabsInit = await page.evaluate(() => {
      const tabs: Tabs | null = document.querySelector('#tabs-empty')
      return tabs?.init
    })

    expect(tabsInit).toBe(false)
  })
})
