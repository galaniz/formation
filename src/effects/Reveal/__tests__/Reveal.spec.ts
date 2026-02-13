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

  /* Test load */

  test('should not load if missing required elements', async ({ page }) => {
    const revLoaded = await page.evaluate(() => {
      const rev = document.querySelector('#rev-empty') as Reveal
      return rev.loaded
    })

    expect(revLoaded).toBe(false)
  })

  test('should move instance and not reload', async ({ page }) => {
    const revLoaded = await page.evaluate(async () => {
      const rev = document.querySelector('#rev') as Reveal

      rev.parentElement?.insertAdjacentElement('beforeend', rev)

      await Promise.resolve()

      return rev.loaded
    })

    expect(revLoaded).toBe(true)
  })

  test('should update image attribute on load', async ({ page }) => {
    await page.waitForFunction(() => {
      const revImg: HTMLImageElement | null = document.querySelector('#rev img')
      return revImg?.dataset.reveal === 'loaded'
    })

    const revLoaded = await page.evaluate(() => {
      const rev = document.querySelector('#rev') as Reveal
      return rev.loaded
    })

    expect(revLoaded).toBe(true)
  })

  /* Test error */

  test('should update image attribute on error', async ({ page }) => {
    await page.waitForFunction(() => {
      const revImg: HTMLImageElement | null = document.querySelector('#rev-error img')
      return revImg?.dataset.reveal === 'error'
    })

    const revLoaded = await page.evaluate(() => {
      const rev = document.querySelector('#rev-error') as Reveal
      return rev.loaded
    })

    expect(revLoaded).toBe(false)
  })
})
