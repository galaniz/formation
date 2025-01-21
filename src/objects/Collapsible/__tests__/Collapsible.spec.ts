/**
 * Objects - Collapsible Test
 */

/* Imports */

import type { Collapsible } from '../Collapsible.js'
import { test, expect } from '@playwright/test'

/* Tests */

test.describe('Collapsible', () => {
  /* Html and coverage */

  test.beforeEach(async ({ page }) => {
    await page.goto('/spec/objects/Collapsible/__tests__/Collapsible.html')
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
      true   // #clp-single
    ])
  })
})
