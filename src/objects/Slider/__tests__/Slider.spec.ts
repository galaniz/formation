/**
 * Objects - Slider Test
 */

/* Imports */

import type { Slider } from '../Slider.js'
import { test, expect } from '@playwright/test'

/* Tests */

test.describe('Slider', () => {
  /* Html and coverage */

  test.beforeEach(async ({ page }) => {
    await page.goto('/spec/objects/Slider/__tests__/Slider.html')
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
      true,  // #sld-group
      true   // #sld-loop
    ])
  })
})
