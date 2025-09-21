/**
 * Effects - Reveal Test
 */

/* Imports */

import type { Reveal } from '../Reveal.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Reveal', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/effects/Reveal/__tests__/Reveal.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not load if missing required elements', async ({ page }) => {
    const revealInit = await page.evaluate(() => {
      const reveal: Reveal | null = document.querySelector('#rev-empty')
      return reveal?.loaded
    })

    expect(revealInit).toBe(false)
  })
})
