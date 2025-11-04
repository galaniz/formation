/**
 * Objects - Collapsible Test
 */

/* Imports */

import type { Collapsible } from '../Collapsible.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Collapsible', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Collapsible/__tests__/Collapsible.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const clpInit = await page.evaluate(() => {
      const clp = document.querySelector('#clp-empty') as Collapsible
      return clp.init
    })

    expect(clpInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const clpInit = await page.evaluate(() => {
      const clps: Collapsible[] = Array.from(document.querySelectorAll('frm-collapsible'))
      return clps.map(collapsible => collapsible.init)
    })

    expect(clpInit).toStrictEqual([
      false, // #clp-empty
      true,  // #clp-single
      true,  // #clp-hover
      true,  // #clp-accordion-1
      true,  // #clp-accordion-2
      true   // #clp-action
    ])
  })
})
