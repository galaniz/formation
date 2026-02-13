/**
 * Objects - Modal Test
 */

/* Imports */

import type { Modal } from '../Modal.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Modal', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Modal/__tests__/Modal.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const modalInit = await page.evaluate(() => {
      const modal = document.querySelector('#mod-empty') as Modal
      return modal.init
    })

    expect(modalInit).toBe(false)
  })
})
