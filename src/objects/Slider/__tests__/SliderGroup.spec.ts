/**
 * Objects - Slider Group Test
 */

/* Imports */

import type { SliderGroup } from '../SliderGroup.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('SliderGroup', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Slider/__tests__/SliderGroup.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const slider: SliderGroup | null = document.querySelector('#sld-group-empty')
      return slider?.init
    })

    expect(sliderInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const sliders: SliderGroup[] = Array.from(document.querySelectorAll('frm-slider-group'))
      return sliders.map(slider => slider.init)
    })

    expect(sliderInit).toStrictEqual([
      false, // #sld-group-empty
      true   // #sld-group
    ])
  })
})
