/**
 * Objects - Slider Test
 */

/* Imports */

import type { Slider } from '../Slider.js'
import { test, expect } from '@playwright/test'
import { testDoCoverage } from '../../../test/testSpecCoverage.js'

/* Tests */

test.describe('Slider', () => {
  /* Html and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    testDoCoverage(browserName, page, true)
    await page.goto('/spec/objects/Slider/__tests__/Slider.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    testDoCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const slider = document.querySelector('#sld-empty') as Slider
      return slider.init
    })

    expect(sliderInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const navInit = await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('frm-slider')) as Slider[]
      return sliders.map(slider => slider.init)
    })

    expect(navInit).toStrictEqual([
      false, // #sld-empty
      true,  // #sld-single
      true,  // #sld-group
      true,  // #sld-loop
    ])
  })
})
