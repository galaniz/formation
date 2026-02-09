/**
 * Objects - Form Test
 */

/* Imports */

import type { Form } from '../Form.js'
import type {
  FormValue,
  FormValues,
  FormChangeActionArgs,
  FormValueFilterArgs,
  FormValuesFilterArgs,
  FormValidateResult,
  FormValidateFilterArgs
} from '../FormTypes.js'
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
      false, // #frm-partial-none
      false, // #frm-partial
      true,  // #frm-change
      true   // #frm
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const formProps = await page.evaluate(async () => {
      const form = document.querySelector('#frm-change') as Form

      form.parentElement?.insertAdjacentElement('beforeend', form)

      await Promise.resolve()

      return {
        init: form.init,
        submitted: form.submitted,
        formTag: form.form?.tagName,
        groupNames: [...form.groups.keys()]
      }
    })

    expect(formProps.init).toBe(true)
    expect(formProps.submitted).toBe(false)
    expect(formProps.formTag).toBe('FORM')
    expect(formProps.groupNames).toStrictEqual([
      'name',
      'email',
      'privacy',
      'cookies',
      'month',
      'day',
      'year',
      'profile',
      'notifications',
      'hidden'
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
        const { name, group, target } = args
        const { field, inputs, label } = group

        window.testFormChangeAction.push({
          name,
          ...group,
          field: field.dataset.formField,
          inputs: inputs.map(input => input.id),
          label: label.id || label.getAttribute('for') || '',
          target: target.id
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
      invalidMessage: '',
      id: 'frm-change-name',
      target: 'frm-change-name'
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
      invalidMessage: 'Email is invalid',
      id: 'frm-change-email',
      target: 'frm-change-email'
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
      invalidMessage: '',
      id: 'frm-change-month',
      target: 'frm-change-month'
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
      invalidMessage: '',
      id: 'frm-change-day',
      target: 'frm-change-day'
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
      invalidMessage: '',
      id: 'frm-change-year',
      target: 'frm-change-year'
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

  test('should add inline errors and focus first input with error on submit', async ({ page }) => {
    const submit = page.getByTestId('frm-change-submit')
    const name = page.getByTestId('frm-change-name')
    const email = page.getByTestId('frm-change-email')

    await submit.click()

    const errorsInit = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm-change [data-form-error-text]'))
      return errors.map(error => error.textContent)
    })

    await expect(name).toBeFocused()

    await name.fill('Test')
    await name.blur()
    await submit.click()

    await expect(email).toBeFocused()

    const errorsAfter = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm-change [data-form-error-text]'))
      return errors.map(error => error.textContent)
    })

    expect(errorsInit).toStrictEqual([
      'Name is required',
      'Email is required',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ])

    expect(errorsAfter).toStrictEqual([
      'Email is required',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ])
  })

  test('should not validate email on change if group missing', async ({ page }) => {
    const name = page.getByTestId('frm-change-name')
    const email = page.getByTestId('frm-change-email')

    await page.evaluate(() => {
      const form = document.querySelector('#frm-change') as Form

      form.groups.delete('email')
    })

    await name.fill(' ')
    await email.blur()
    await email.fill('test@test.com')
    await email.blur()

    const errors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#frm-change [data-form-error-text]')).map(error => error.textContent)
    })

    expect(errors).toStrictEqual(['Name is required'])
  })

  /* Test submit */

  test('should add and remove error summary and inline errors on submit and change', async ({ page }) => {
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

  test('should add errors on change and submit forms', async ({ page }) => {
    await page.getByTestId('frm-change-submit').click()
    await page.getByTestId('frm-submit').click()

    const errors = await page.evaluate(() => {
      const change = Array.from(document.querySelectorAll('#frm-change [data-form-error-text]'))
      const submit = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))

      return {
        change: change.map(error => error.textContent),
        submit: submit.map(item => item.textContent)
      }
    })

    const expectedErrors = [
      'Name is required',
      'Email is required',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ]

    expect(errors).toStrictEqual({
      change: expectedErrors,
      submit: expectedErrors
    })
  })

  /* Test clones */

  test('should not add error summary or inline errors if clones cleared', async ({ page }) => {
    await page.evaluate(async () => {
      const { Form } = await import('../Form.js')

      Form.templates.clear()
    })

    await page.getByTestId('frm-submit').click()

    const errorsCount = await page.evaluate(() => {
      return {
        inline: Array.from(document.querySelectorAll('#frm [data-form-error-text]')).length,
        summary: Array.from(document.querySelectorAll('#frm li')).length
      }
    })

    expect(errorsCount).toStrictEqual({
      inline: 0,
      summary: 0
    })
  })

  test('should not add inline errors if clone missing text element', async ({ page }) => {
    await page.evaluate(async () => {
      const { Form } = await import('../Form.js')

      Form.templates.set('errorInline', document.createElement('div'))
    })

    await page.getByTestId('frm-submit').click()

    const errorsCount = await page.evaluate(() => {
      return {
        inline: Array.from(document.querySelectorAll('#frm [data-form-error-text]')).length,
        summary: Array.from(document.querySelectorAll('#frm li')).length
      }
    })

    expect(errorsCount).toStrictEqual({
      inline: 0,
      summary: 6
    })
  })

  test('should clone error and append to form', async ({ page }) => {
    const errorHeading = await page.evaluate(() => {
      const form = document.querySelector('#frm') as Form

      form.getClone('error', form.form)

      return form.querySelector('h2')?.textContent
    })

    expect(errorHeading).toBe('Form error')
  })

  /* Test clear */

  test('should add error summary and inline errors on submit and clear programmatically', async ({ page }) => {
    const name = page.getByTestId('frm-name')
    await name.fill('Test')
    await page.getByTestId('frm-submit').click()

    const errorsAdded = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))
      const activeItem = document.activeElement

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent),
        active: activeItem?.tagName === 'DIV' && activeItem.role === 'alert'
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
      summary: expectedErrors,
      active: true
    })

    expect(errorsRemoved).toStrictEqual({
      inline: [],
      summary: []
    })
  })

  /* Test validation */

  test('should filter email input validation', async ({ page }) => {
    const email = page.getByTestId('frm-email')

    await page.evaluate(async () => {
      const { addFilter } = await import('../../../filters/filters.js')

      addFilter('form:validate:frm', (result: FormValidateResult<string[]>, args: FormValidateFilterArgs) => {
        const { name, groups } = args

        if (name !== 'email') {
          return result
        }

        const { values, valid } = result
        const [email] = values

        if (!email && !valid) { // Empty required email
          return {
            ...result, // Assume empty message present
            ariaInvalid: [0]
          }
        }

        if (email && !email.includes('@')) {
          return {
            ...result,
            valid: false,
            message: groups.get(name)?.invalidMessage || '', // Assume invalid message present
            ariaInvalid: [0]
          }
        }

        return result
      })
    })

    await page.getByTestId('frm-submit').click()

    const errorsSubmit = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent),
        summaryLinks: summary.map(item => item.querySelector('a')?.getAttribute('href'))
      }
    })

    await email.fill('test')
    await email.blur()

    const errorsChange = await page.evaluate(() => {
      const errors = Array.from(document.querySelectorAll('#frm [data-form-error-text]'))
      const summary = Array.from(document.querySelectorAll('#frm li'))

      return {
        inline: errors.map(error => error.textContent),
        summary: summary.map(item => item.textContent),
        summaryLinks: summary.map(item => item.querySelector('a')?.getAttribute('href'))
      }
    })

    const expectedSubmitErrors = [
      'Name is required',
      'Email is required',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ]

    const expectedErrorLinks = [
      '#frm-name',
      '#frm-email',
      '#frm-privacy',
      '#frm-month',
      '#frm-day',
      '#frm-year'
    ]

    const expectedChangeErrors = [
      'Name is required',
      'Email is invalid',
      'Privacy required',
      'Month is required',
      'Day is required',
      'Year is required'
    ]

    expect(errorsSubmit).toStrictEqual({
      inline: expectedSubmitErrors,
      summary: expectedSubmitErrors,
      summaryLinks: expectedErrorLinks
    })

    expect(errorsChange).toStrictEqual({
      inline: expectedChangeErrors,
      summary: expectedChangeErrors,
      summaryLinks: expectedErrorLinks
    })
  })

  /* Test values */

  test('should return and filter form values', async ({ page }) => {
    await page.getByTestId('frm-email').fill('test@test.com')
    await page.getByTestId('frm-contacts').focus()
    await page.keyboard.press('Space')
    await page.getByTestId('frm-functional').focus()
    await page.keyboard.press('Space')
    await page.getByTestId('frm-analytics').focus()
    await page.keyboard.press('Space')
    await page.getByTestId('frm-month').selectOption('06')
    await page.getByTestId('frm-day').fill('24')
    await page.getByTestId('frm-year').fill('1987')
    await page.getByTestId('frm-notifications').focus()
    await page.keyboard.press('Space')
    await page.getByTestId('frm-profile').setInputFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('File content.')
    })

    await page.getByTestId('frm-submit').click()

    const formValues = await page.evaluate(async () => {
      const { addFilter } = await import('../../../filters/filters.js')

      addFilter('form:value:frm', (value: FormValue, args: FormValueFilterArgs) => {
        const { name } = args
        const { value: inputValue } = value

        if (name === 'profile') {
          return {
            value: {
              name: (inputValue as File).name,
              type: (inputValue as File).type,
              size: (inputValue as File).size
            },
            type: 'file',
            label: 'Profile'
          }
        }

        return value
      })

      addFilter('form:values:frm', (values: FormValues, args: FormValuesFilterArgs) => {
        const { groups } = args

        values.test = {
          value: [...groups.keys()].join('-'),
          type: 'text'
        }

        return values
      })

      const form = document.querySelector('#frm') as Form
      return form.getValues()
    })

    expect(formValues).toStrictEqual({
      name: {
        value: '',
        type: 'text',
        label: 'Name'
      },
      email: {
        value: 'test@test.com',
        type: 'email',
        label: 'Email'
      },
      privacy: {
        value: 'contacts',
        type: 'radio',
        legend: 'Privacy',
        label: 'Public'
      },
      cookies: {
        value: [
          'functional',
          'analytics'
        ],
        type: [
          'checkbox',
          'checkbox',
          'checkbox'
        ],
        legend: 'Cookies',
        label: 'Functional'
      },
      month: {
        value: '06',
        type: 'select',
        legend: 'Date of birth',
        label: 'Month'
      },
      day: {
        value: '24',
        type: 'text',
        legend: 'Date of birth',
        label: 'Day'
      },
      year: {
        value: '1987',
        type: 'text',
        legend: 'Date of birth',
        label: 'Year'
      },
      profile: {
        value: {
          name: 'file.txt',
          type: 'text/plain',
          size: 13
        },
        type: 'file',
        label: 'Profile'
      },
      notifications: {
        value: '1',
        type: 'checkbox',
        label: 'Notifications'
      },
      hidden: {
        value: 'hidden',
        type: 'hidden'
      },
      test: {
        value: 'name-email-privacy-cookies-month-day-year-profile-notifications-hidden',
        type: 'text'
      }
    })
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const formProps = await page.evaluate(async () => {
      const { addAction } = await import('../../../actions/actions.js')
      const { Form } = await import('../Form.js')

      addAction('form:change:frm', (args: FormChangeActionArgs) => {
        const { name } = args

        window.testFormChangeAction.push({ name })
      })

      const form = document.querySelector('#frm') as Form
      const name = document.querySelector('#frm-name') as HTMLInputElement

      form.getClone('errorSummary')
      form.remove()

      await Promise.resolve()

      form.form?.submit()

      const activeItem = document.activeElement

      name.value = 'Test'
      name.blur()

      return {
        init: form.init,
        submitted: form.submitted,
        form: form.form,
        groupsSize: form.groups.size,
        clonesSize: form.clones.size,
        templatesSize: Form.templates.size,
        summaryActive: activeItem?.tagName === 'DIV' && activeItem.role === 'alert',
        changeActionsCount: window.testFormChangeAction.length
      }
    })

    expect(formProps.init).toBe(false)
    expect(formProps.submitted).toBe(false)
    expect(formProps.form).toBe(null)
    expect(formProps.groupsSize).toBe(0)
    expect(formProps.clonesSize).toBe(0)
    expect(formProps.templatesSize).toBe(5)
    expect(formProps.summaryActive).toBe(false)
    expect(formProps.changeActionsCount).toBe(0)
  })

  test('should remove all instances and templates', async ({ page }) => {
    const formProps = await page.evaluate(async () => {
      const { Form } = await import('../Form.js')

      const forms: Form[] = Array.from(document.querySelectorAll('frm-form'))

      forms.forEach(form => {
        form.remove()
      })

      await Promise.resolve()

      return {
        init: forms.map(form => form.init),
        submitted: forms.map(form => form.submitted),
        form: forms.map(form => form.form),
        groupsSize: forms.map(form => form.groups.size),
        clonesSize: forms.map(form => form.clones.size),
        templatesSize: Form.templates.size
      }
    })

    expect(formProps.init).toStrictEqual([false, false, false, false, false])
    expect(formProps.submitted).toStrictEqual([false, false, false, false, false])
    expect(formProps.form).toStrictEqual([null, null, null, null, null])
    expect(formProps.groupsSize).toStrictEqual([0, 0, 0, 0, 0])
    expect(formProps.clonesSize).toStrictEqual([0, 0, 0, 0, 0])
    expect(formProps.templatesSize).toStrictEqual(0)
  })
})
