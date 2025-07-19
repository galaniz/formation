/**
 * Objects - Slider Test
 */

/* Imports */

import type { Slider } from '../Slider.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Slider', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Slider/__tests__/Slider.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const slider: Slider | null = document.querySelector('#sld-empty')
      return slider?.init
    })

    expect(sliderInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const sliders: Slider[] = Array.from(document.querySelectorAll('frm-slider'))
      return sliders.map(slider => slider.init)
    })

    expect(sliderInit).toStrictEqual([
      false, // #sld-empty
      false, // #sld-single
      true   // #sld-loop
    ])
  })
})
