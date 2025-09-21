/**
 * Components - Pagination Filter Test
 */

/* Imports */

import type { PaginationFilter } from '../PaginationFilter.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('PaginationFilter', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/components/Pagination/__tests__/PaginationFilter.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const pagInit = await page.evaluate(() => {
      const pag: PaginationFilter | null = document.querySelector('#pag-filter-partial')
      return pag?.subInit
    })

    expect(pagInit).toBe(false)
  })
})
