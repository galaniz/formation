/**
 * Components - Navigation Test
 */

/* Imports */

import type { Navigation } from '../Navigation.js'
import { test, expect } from '@playwright/test'
import { testDoCoverage } from '../../../test/testSpecCoverage.js'

/* Tests */

test.describe('Navigation', () => {
  /* Html and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    testDoCoverage(browserName, page, true)
    await page.goto('/spec/components/Navigation/__tests__/Navigation.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    testDoCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const navInit = await page.evaluate(() => {
      const nav = document.querySelector('#nav-empty') as Navigation
      return nav.init
    })

    expect(navInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const navInit = await page.evaluate(() => {
      const navs = Array.from(document.querySelectorAll('frm-navigation')) as Navigation[]
      return navs.map(nav => nav.init)
    })

    expect(navInit).toStrictEqual([
      false, // #nav-empty
      true,  // #nav-slot
      true,  // #nav-slots
      true,  // #nav-slots-breakpoint
      true,  // #nav-slots-groups
      true   // #nav-slots-groups-breakpoints
    ])
  })

  test('should move all items into modal slots if past breakpoint', async ({ page }) => {
    await page.setViewportSize({
      width: 600,
      height: 600,
    })

    await page.waitForTimeout(100)

    const navSlots = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slots-breakpoint') as Navigation

      return {
        one: nav.slots.get('one')?.children.length,
        two: nav.slots.get('two')?.children.length,
        modalOne: nav.modalSlots.get('one')?.children.length,
        modalTwo: nav.modalSlots.get('two')?.children.length
      }
    })

    const {
      one,
      two,
      modalOne,
      modalTwo
    } = navSlots

    expect(one).toBe(0)
    expect(two).toBe(0)
    expect(modalOne).toBe(6)
    expect(modalTwo).toBe(4)
  })
})
