/**
 * Components - Pagination Test
 */

/* Imports */

import type { Pagination } from '../Pagination.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Pagination', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/components/Pagination/__tests__/Pagination.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const pagInit = await page.evaluate(() => {
      const pag = document.querySelector('#pag-empty') as Pagination
      return pag.init
    })

    expect(pagInit).toBe(false)
  })
})
