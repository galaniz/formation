/**
 * Objects - Form Test
 */

/* Imports */

import type { Form } from '../Form.js'
import type { FormChangeActionArgs } from '../FormTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testFormChangeAction: Array<Record<string, unknown>>
  }
}

/* Tests */

test.describe('Form', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testFormChangeAction = []
    })

    await page.goto('/spec/objects/Form/__tests__/Form.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)

    await page.addInitScript(() => {
      window.testFormChangeAction = []
    })
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const formInit = await page.evaluate(() => {
      const form = document.querySelector('#frm-empty') as Form
      return form.init
    })

    expect(formInit).toBe(false)
  })

  test('should initialize if contains required elements', async ({ page }) => {
    const formInit = await page.evaluate(() => {
      const forms: Form[] = Array.from(document.querySelectorAll('frm-form'))
      return forms.map(form => form.init)
    })

    expect(formInit).toStrictEqual([
      false, // #frm-empty
      false, // #frm-partial
      true,  // #frm-change
      true   // #frm
    ])
  })

  /* Test partial */

  // test('should skip inputs without required properties', async ({ page }) => {})

  /* Test change */

  test('should add and remove inline errors on change and do action', async ({ page }) => {
    const name = page.getByTestId('frm-change-name')
    const email = page.getByTestId('frm-change-email')
    const month = page.getByTestId('frm-change-month')
    const day = page.getByTestId('frm-change-day')
    const year = page.getByTestId('frm-change-year')

    await page.evaluate(async () => {
      const { addAction } = await import('../../../actions/actions.js')

      addAction('form:change:frm-change', (args: FormChangeActionArgs) => {
        const { name, group } = args
        const { field, inputs, label } = group

        window.testFormChangeAction.push({
          name,
          ...group,
          field: field.dataset.formField,
          inputs: inputs.map(input => input.id),
          label: label?.id || label?.getAttribute('for') || ''
        })
      })
    })

    await name.fill(' ')
    await name.blur()
    await email.fill('e') // Browser normalizes email empty spaces
    await email.blur()
    await email.fill('')
    await email.blur()
    await month.selectOption('01')
    await month.selectOption('')
    await month.blur()
    await day.fill(' ')
    await day.blur()
    await year.fill(' ')
    await year.blur()

    const errorsAdded = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm-change [data-form-error-text]'))
      return errors.map(error => error.textContent)
    })

    await name.fill('Test')
    await name.blur()
    await email.fill('email@test.com')
    await email.blur()
    await month.selectOption('01')
    await month.blur()
    await day.fill('4')
    await day.blur()
    await year.fill('1990')
    await year.blur()

    const errorsRemoved = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm-change [data-form-error-text]'))
      return errors.map(error => error.textContent)
    })

    const changeActions = await page.evaluate(() => {
      return window.testFormChangeAction
    })

    const nameData = {
      name: 'name',
      field: 'text',
      inputs: ['frm-change-name'],
      label: 'frm-change-name',
      labelType: 'label',
      required: true,
      type: ['text'],
      values: [],
      valid: false,
      emptyMessage: 'Name is required',
      invalidMessage: ''
    }

    const emailData = {
      name: 'email',
      field: 'email',
      inputs: ['frm-change-email'],
      label: 'frm-change-email',
      labelType: 'label',
      required: true,
      type: ['email'],
      values: [],
      valid: false,
      emptyMessage: 'Email is required',
      invalidMessage: 'Email is invalid'
    }

    const monthData = {
      name: 'month',
      field: 'select',
      inputs: ['frm-change-month'],
      label: 'frm-change-month',
      labelType: 'label',
      required: true,
      type: ['select'],
      values: [],
      valid: false,
      emptyMessage: 'Month is required',
      invalidMessage: ''
    }

    const dayData = {
      name: 'day',
      field: 'text',
      inputs: ['frm-change-day'],
      label: 'frm-change-day',
      labelType: 'label',
      required: true,
      type: ['text'],
      values: [],
      valid: false,
      emptyMessage: 'Day is required',
      invalidMessage: ''
    }

    const yearData = {
      name: 'year',
      field: 'text',
      inputs: ['frm-change-year'],
      label: 'frm-change-year',
      labelType: 'label',
      required: true,
      type: ['text'],
      values: [],
      valid: false,
      emptyMessage: 'Year is required',
      invalidMessage: ''
    }

    const expectedErrors = [
      'Name is required',
      'Email is required',
      'Month is required',
      'Day is required',
      'Year is required'
    ]

    expect(errorsAdded).toStrictEqual(expectedErrors)
    expect(errorsRemoved).toStrictEqual([])
    expect(changeActions).toStrictEqual([
      nameData,
      {
        ...emailData,
        values: ['e'],
        valid: true
      },
      emailData,
      {
        ...monthData,
        values: ['01'],
        valid: true
      },
      monthData,
      dayData,
      yearData,
      {
        ...nameData,
        values: ['Test'],
        valid: true
      },
      {
        ...emailData,
        values: ['email@test.com'],
        valid: true
      },
      {
        ...monthData,
        values: ['01'],
        valid: true
      },
      {
        ...dayData,
        values: ['4'],
        valid: true
      },
      {
        ...yearData,
        values: ['1990'],
        valid: true
      }
    ])
  })

  /* Test submit */

  test('should add and remove error summary and inline errors on submit', async ({ page }) => {
    const name = page.getByTestId('frm-name')
    const email = page.getByTestId('frm-email')
    const contacts = page.getByTestId('frm-contacts')
    const month = page.getByTestId('frm-month')
    const day = page.getByTestId('frm-day')
    const year = page.getByTestId('frm-year')

    const templates = await page.evaluate(() => {
      const form = document.querySelector('#frm') as Form
      return Array.from(form.usedTemplates)
    })

    await page.getByTestId('frm-submit').click()

    const errorsAdded = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent),
        summaryLinks: summary.map(item => item.querySelector('a')?.getAttribute('href'))
      }
    })

    const errorSummary = page.getByTestId('frm-error-summary')
    await expect(errorSummary).toBeVisible()
    await expect(errorSummary).toBeFocused()
    await expect(errorSummary).toHaveRole('alert')

    await name.fill('Test')
    await email.fill('email@test.com')
    await contacts.focus()
    await page.keyboard.press('Space')
    await month.selectOption('01')
    await day.fill('4')
    await year.fill('1990')
    await year.blur()

    const errorsRemoved = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent)
      }
    })

    await expect(errorSummary).not.toBeVisible()

    const expectedErrors = [
      'Name is required',
      'Email is required',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ]

    expect(templates).toStrictEqual([
      'errorInline',
      'errorSummary',
      'error',
      'success',
      'loader'
    ])

    expect(errorsAdded).toStrictEqual({
      inline: expectedErrors,
      summary: expectedErrors,
      summaryLinks: [
        '#frm-name',
        '#frm-email',
        '#frm-privacy',
        '#frm-month',
        '#frm-day',
        '#frm-year'
      ]
    })

    expect(errorsRemoved).toStrictEqual({
      inline: [],
      summary: []
    })
  })

  /* Test clear */

  test('should add error summary and inline errors on submit and clear programmatically', async ({ page }) => {
    const name = page.getByTestId('frm-name')
    await name.fill('Test')
    await page.getByTestId('frm-submit').click()

    const errorsAdded = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent)
      }
    })

    const errorSummary = page.getByTestId('frm-error-summary')
    await expect(errorSummary).toBeVisible()

    await page.evaluate(() => {
      const form = document.querySelector('#frm') as Form
      form.clear()
    })

    const nameValue = await name.inputValue()
    const errorsRemoved = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent)
      }
    })

    await expect(errorSummary).not.toBeVisible()

    const expectedErrors = [
      'Email is required',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ]

    expect(nameValue).toBe('')
    expect(errorsAdded).toStrictEqual({
      inline: expectedErrors,
      summary: expectedErrors
    })

    expect(errorsRemoved).toStrictEqual({
      inline: [],
      summary: expectedErrors
    })
  })

  /* Test validation */

  // test('should filter email input validation', async ({ page }) => {})

  /* Test values */

  // test('should return and filter form values', async ({ page }) => {})
})
