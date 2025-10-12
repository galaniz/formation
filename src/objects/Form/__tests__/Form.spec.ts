/**
 * Objects - Form Test
 */

/* Imports */

import type { Form } from '../Form.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Tests */

test.describe('Form', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/objects/Form/__tests__/Form.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const formInit = await page.evaluate(() => {
      const form = document.querySelector('#frm-empty') as Form
      return form.init
    })

    expect(formInit).toBe(false)
  })
})
