/**
 * Objects - Collapsible Test
 */

/* Imports */

import type { Collapsible } from '../Collapsible.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Collapsible', () => {
  /* Html and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Collapsible/__tests__/Collapsible.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const collapsibleInit = await page.evaluate(() => {
      const collapsible: Collapsible | null = document.querySelector('#clp-empty')
      return collapsible?.init
    })

    expect(collapsibleInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const collapsibleInit = await page.evaluate(() => {
      const collapsibles: Collapsible[] = Array.from(document.querySelectorAll('frm-collapsible'))
      return collapsibles.map(collapsible => collapsible.init)
    })

    expect(collapsibleInit).toStrictEqual([
      false, // #clp-empty
      true,  // #clp-single
      true,  // #clp-accordion-1
      true   // #clp-hoverable-2
    ])
  })
})
