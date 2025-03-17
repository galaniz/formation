/**
 * Objects - Form
 */

/* Imports */

import type {
  FormInput,
  FormGroup,
  FormErrorListItem,
  FormValidateResult,
  FormValidateFilterArgs,
  FormValue,
  FormValueFilterArgs,
  FormValues,
  FormValuesFilterArgs,
  FormTemplates,
  FormClones,
  FormValidateOn,
  FormGroups
} from './FormTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isItemFocusable, focusSelector } from '../../utils/focusability/focusability.js'
import { getOuterItems } from '../../utils/item/itemOuter.js'
import { cloneItem, getItem, getTemplateItem } from '../../utils/item/item.js'
import { applyFilters } from '../../utils/filter/filter.js'

/**
 * Handles form validation and retrieval of values
 */
class Form extends HTMLElement {
  /**
   * Form element
   *
   * @type {HTMLFormElement|null}
   */
  form: HTMLFormElement | null = null

  /**
   * Data (state, values, inputs...) by input name
   *
   * @type {FormGroups}
   */
  groups: FormGroups = new Map()

  /**
   * Validate on submit, blur or both
   *
   * @type {FormValidateOn}
   */
  validateOn: FormValidateOn = 'both'

  /**
   * Track submit state
   *
   * @type {boolean}
   */
  submitted: boolean = false

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Error, loader and success fragments
   *
   * @type {FormTemplates}
   */
  static templates: FormTemplates = new Map()

  /**
   * Labels by input name
   *
   * @private
   * @type {Map<string, string>}
   */
  #labels: Map<string, string> = new Map()

  /**
   * Legends by input name
   *
   * @private
   * @type {Map<string, string>}
   */
  #legends: Map<string, string> = new Map()

  /**
   * Clones of templates
   *
   * @private
   * @type {FormClones}
   */
  #clones: FormClones = new Map()

  /**
   * Error list item ids, messages and elements
   *
   * @private
   * @type {Map<string, FormErrorListItem>}
   */
  #errorList: Map<string, FormErrorListItem> = new Map()

  /**
   * Id for blur timeout
   *
   * @private
   * @type {number}
   */
  #blurDelayId: number = 0

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #blurHandler = this.#blur.bind(this)
  #blurSummaryHandler = this.#blurSummary.bind(this)
  #submitHandler = this.submit.bind(this)

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init - each time added to DOM
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up - each time removed from DOM
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Remove event listeners */

    this.form?.removeEventListener('submit', this.#submitHandler)
    this.#clones.get('errorSummary')?.removeEventListener('blur', this.#blurSummaryHandler)

    this.groups.forEach(group => {
      const { inputs } = group

      inputs.forEach(input => {
        input.removeEventListener('click', this.#blurHandler)
      })
    })

    /* Empty/nullify props */

    this.form = null
    this.groups.clear()
    this.init = false
    this.submitted = false
    Form.templates.clear()
    this.#labels.clear()
    this.#legends.clear()
    this.#clones.clear()
    this.#errorList.clear()

    /* Clear timeouts */

    clearTimeout(this.#blurDelayId)
  }

  /**
   * Initialize - check required items and set properties
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const form = getItem('form', this)
    const inputs = getItem(['[data-form-input]'], this) as FormInput[]

    /* Check required items exist */

    if (!isHtmlElementArray(inputs) || !isHtmlElement(form, HTMLFormElement)) {
      return false
    }

    /* Error inline template required */

    const errorInline = getTemplateItem(this.getAttribute('error-inline') ?? '')

    if (!isHtmlElement(errorInline)) {
      return false
    }

    Form.templates.set('errorInline', errorInline)

    /* Error summary template */

    const errorSummary = getTemplateItem(this.getAttribute('error-summary') ?? '')

    if (isHtmlElement(errorSummary)) {
      Form.templates.set('errorSummary', errorSummary)
    }

    /* Validate on */

    const validateOn = this.getAttribute('validate-on')

    if (isStringStrict(validateOn)) {
      this.validateOn = validateOn as FormValidateOn
    }

    const addBlur = this.validateOn !== 'submit'

    /* Create groups */

    let init = false

    for (const input of inputs) {
      /* Name and id (error list) required */

      const name = input.name
      const id = input.id

      if (!isStringStrict(name) || !isStringStrict(id)) {
        continue
      }

      /* Type */

      let type = input.tagName.toLowerCase()

      if (type === 'input') {
        type = input.type
      }

      /* Group data */

      const group = this.groups.get(name)
      const groupExists = group != null

      if (addBlur && groupExists) {
        input.addEventListener('blur', this.#blurHandler)
      }

      if (groupExists) {
        group.inputs.push(input)
        group.type.push(type)
        continue
      }

      /* Field required */

      const field = input.closest('[data-form-field]')

      if (!isHtmlElement(field)) {
        continue
      }

      /* Fieldset check */

      const fieldset = input.closest('fieldset')
      const hasFieldset = isHtmlElement(fieldset)
      const fieldsetRequired = hasFieldset ? fieldset.hasAttribute('data-form-required') : false

      /* Required */

      const required = input.required || input.ariaRequired === 'true' || fieldsetRequired

      /* Legend */

      const legend = fieldset?.querySelector('legend')
      const hasLegend = isHtmlElement(legend)
      const legendId = legend?.id

      if (fieldsetRequired && !isStringStrict(legendId)) { // Legend id required for error list
        continue
      }

      if (hasLegend) {
        const legendText = getItem('[data-form-legend-text]', legend)

        if (isStringStrict(legendText)) {
          this.#legends.set(name, legendText)
        }
      }

      /* Label */

      const label = field.querySelector('label')
      const hasLabel = isHtmlElement(label)

      if (hasLabel) {
        const labelText = getItem('[data-form-label-text]', label)

        if (isStringStrict(labelText)) {
          this.#labels.set(name, labelText)
        }
      }

      /* Group label required */

      const groupLabel = fieldsetRequired ? legend : label
      const groupLabelType = fieldsetRequired ? 'legend' : 'label'

      if (!groupLabel) {
        continue
      }

      /* Empty and invalid messages */

      const emptyMessage = (fieldsetRequired ? fieldset as HTMLElement : input).dataset.formEmpty
      const invalidMessage = (fieldsetRequired ? fieldset as HTMLElement : input).dataset.formInvalid

      /* Group data */

      this.groups.set(name, {
        field,
        inputs: [input],
        label: groupLabel,
        labelType: groupLabelType,
        required,
        type: [type],
        values: [],
        valid: false,
        emptyMessage: isStringStrict(emptyMessage) ? emptyMessage : '',
        invalidMessage: isStringStrict(invalidMessage) ? invalidMessage : ''
      })

      /* Blur to validate after submit */

      if (addBlur) {
        input.addEventListener('blur', this.#blurHandler)
      }

      /* Input processed */

      init = true
    }

    /* Form */

    this.form = form
    this.form.addEventListener('submit', this.#submitHandler)

    /* Init successful */

    return init
  }

  /**
   * Validate inputs
   *
   * @private
   * @param {FormInput[]} inputs
   * @param {string} name
   * @param {boolean} required
   * @param {string} emptyMessage
   * @return {FormValidateResult}
   */
  #validateInputs (
    inputs: FormInput[],
    name: string,
    type: string[],
    required: boolean,
    emptyMessage: string
  ): FormValidateResult {
    const values: string[] = []
    const ariaInvalid: number[] = []

    let message = ''
    let valid = true

    /* Values from inputs */

    inputs.forEach((input, i) => {
      let value: string | undefined
      let isControl = false
      let hasValue = false

      switch (type[i]) {
        case 'checkbox':
        case 'radio':
          isControl = true
          value = ((input as HTMLInputElement).checked ? (input as HTMLInputElement).value.trim() : '')
          break
        case 'select':
          const selected = (input as HTMLSelectElement).selectedOptions

          if (!selected) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
            break
          }

          for (const option of selected) {
            const optValue = option.value.trim()

            if (isStringStrict(optValue)) {
              hasValue = true
              values.push(optValue)
            }
          }

          break
        default:
          value = input.value.trim()
      }

      if (isStringStrict(value)) {
        hasValue = true
        values.push(value)
      }

      if (!hasValue && !isControl) {
        ariaInvalid.push(i)
      }
    })

    /* No values */

    if (values.length === 0) {
      message = isStringStrict(emptyMessage) ? emptyMessage : 'Required'
      valid = required ? false : true
    }

    /* Result */

    const result: FormValidateResult = { values, message, valid, ariaInvalid }
    const resultArgs: FormValidateFilterArgs = { name, groups: this.groups }

    return applyFilters(`form:validate:${this.id}`, result, resultArgs)
  }

  /**
   * Validate input group
   *
   * @private
   * @param {FormGroup} group
   * @param {string} name
   * @return {boolean}
   */
  #validateGroup (group: FormGroup, name: string): boolean {
    /* Group data */

    const {
      field,
      inputs,
      type,
      label,
      labelType,
      required,
      emptyMessage
    } = group

    /* Label required */

    if (!isHtmlElement(label)) {
      return true
    }

    /* Error id required for list */

    const useLegend = labelType === 'legend'
    const errorId: string | undefined = useLegend ? label.id : inputs[0]?.id

    if (!isStringStrict(errorId)) {
      return true
    }

    /* Validate input group */

    const validate = this.#validateInputs(inputs, name, type, required, emptyMessage)
    const { values, valid, ariaInvalid, message } = validate

    if (!valid) {
      this.#setErrorMessage(field, inputs, name, label, message, ariaInvalid)

      const existing = this.#errorList.get(errorId)
      const existingItem = existing?.item
      const existingMessage = existing?.message
      const changed = existingItem != null && existingMessage === message

      this.#errorList.set(errorId, {
        message: isStringStrict(message) ? message : '',
        item: existingItem, changed
      })

      /* Create error summary */

      this.#setErrorSummary()
    } else {
      this.#removeErrorMessage(field, inputs, name, label)
      this.#errorList.delete(errorId)
    }

    /* Reset summary list */

    this.#setErrorList()

    /* Save valid state and values in group */

    group.values = values
    group.valid = valid

    /* Result */

    return valid
  }

  /**
   * Set field error message
   *
   * @private
   * @param {HTMLElement} field
   * @param {FormInput[]} inputs
   * @param {string} name
   * @param {HTMLElement} label
   * @param {string} message
   * @param {number[]} ariaInvalid
   * @return {void}
   */
  #setErrorMessage (
    field: HTMLElement,
    inputs: FormInput[],
    name: string,
    label: HTMLElement,
    message: string,
    ariaInvalid: number[]
  ): void {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(`${errorId}-text`)

    /* Output */

    if (isHtmlElement(error)) {
      error.textContent = message
    } else {
      const clone = cloneItem(Form.templates.get('errorInline'))

      if (!isHtmlElement(clone)) {
        return
      }

      const cloneText = getItem('[data-form-error-text]', clone)

      if (!isHtmlElement(cloneText)) {
        return
      }

      clone.id = errorId
      cloneText.id = `${errorId}-text`
      cloneText.textContent = message

      label.insertAdjacentElement('beforeend', clone)
    }

    /* Update field */

    field.dataset.formFieldError = ''

    /* Invalid inputs */

    inputs.forEach((input, i) => {
      if (ariaInvalid.includes(i)) {
        input.setAttribute('aria-invalid', 'true')
      } else {
        input.removeAttribute('aria-invalid')
      }
    })
  }

  /**
   * Remove field error message
   *
   * @private
   * @param {HTMLElement} field
   * @param {FormInput[]} inputs
   * @param {string} name
   * @param {HTMLElement} label
   * @return {void}
   */
  #removeErrorMessage (
    field: HTMLElement,
    inputs: FormInput[],
    name: string,
    label: HTMLElement
  ): void {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorId)

    if (isHtmlElement(error)) {
      label.removeChild(error)
    }

    /* Update field */

    delete field.dataset.formFieldError

    /* Valid inputs */

    inputs.forEach(input => {
      input.removeAttribute('aria-invalid')
    })
  }

  /**
   * Clear error messages and hide error summary
   *
   * @private
   * @return {void}
   */
  #clearErrorMessages (): void {
    this.groups.forEach((group, name) => {
      const { field, inputs, label } = group

      if (!isHtmlElement(label)) {
        return
      }

      this.#removeErrorMessage(field, inputs, name, label)
    })

    this.#displayErrorSummary(false)
  }

  /**
   * Create error summary
   *
   * @private
   * @return {void}
   */
  #setErrorSummary (): void {
    /* Check if exists */

    const errorSummary = this.#clones.get('errorSummary')

    if (errorSummary != null) {
      return
    }

    /* Clone summary template */

    const clone = cloneItem(Form.templates.get('errorSummary'))

    if (!isHtmlElement(clone)) {
      return
    }

    this.prepend(clone)
    this.#clones.set('errorSummary', clone)
    clone.addEventListener('blur', this.#blurSummaryHandler)

    /* Error list */

    const errorList = getItem('ul', clone)

    if (isHtmlElement(errorList, HTMLUListElement)) {
      this.#clones.set('errorList', errorList)
    }
  }

  /**
   * Handle error summary element display and focus
   *
   * @private
   * @param {boolean} display
   * @param {boolean} [focus]
   * @return {void}
   */
  #displayErrorSummary (display: boolean, focus: boolean = false): void {
    const errorSummary = this.#clones.get('errorSummary')

    if (!isHtmlElement(errorSummary)) {
      return
    }

    errorSummary.style.display = display ? 'block' : 'none'

    if (focus) {
      errorSummary.setAttribute('role', 'alert')
      errorSummary.focus()
    }
  }

  /**
   * Create/update error list items
   *
   * @private
   * @return {void}
   */
  #setErrorList (): void {
    if (this.#errorList.size === 0) {
      this.#displayErrorSummary(false)
    }

    const errorList = this.#clones.get('errorList')

    if (!isHtmlElement(errorList, HTMLUListElement)) {
      return
    }

    const frag = new window.DocumentFragment()
    let focusItem: HTMLElement | undefined

    this.#errorList.forEach((listItem, id) => {
      const { message, item, changed } = listItem

      let currentItem = changed ? item : null

      if (changed && currentItem?.firstElementChild === document.activeElement) {
        focusItem = document.activeElement as HTMLElement
      }

      if (currentItem == null) {
        currentItem = document.createElement('li')
        currentItem.innerHTML = `<a href="#${id}">${message}</a>`
      }

      frag.append(currentItem)

      this.#errorList.set(id, { message, item: currentItem })
    })

    errorList.innerHTML = ''
    errorList.append(frag)

    if (focusItem != null) {
      focusItem.focus()
    }
  }

  /**
   * Blur handler on input element
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #blur (e: Event): void {
    /* Clear timeout */

    clearTimeout(this.#blurDelayId)

    /* Check validation onset */

    const on = this.validateOn

    if (!this.submitted && on === 'both') {
      return
    }

    /* Group required */

    const name = (e.currentTarget as HTMLInputElement).name
    const group = this.groups.get(name)

    if (group == null) {
      return
    }

    /* Delay for correct active element */

    this.#blurDelayId = window.setTimeout(() => {
      /* Validate group */

      this.#validateGroup(group, name)

      /* Display error summary */

      if (this.#errorList.size) {
        this.#displayErrorSummary(true)
        return
      }

      /* Previous focusable element */

      let prevFocusItem: HTMLElement | undefined

      getOuterItems(
        this,
        'prev',
        (store) => {
          let stop = false

          for (const item of store) {
            if (isItemFocusable(item)) {
              stop = true
              prevFocusItem = item as HTMLElement
              break
            }

            const innerFocusable = item.querySelectorAll(focusSelector)
            const [firstItem] = innerFocusable

            if (isHtmlElement(firstItem)) {
              stop = true
              prevFocusItem = firstItem
              break
            }
          }

          return { store, stop }
        }
      )

      const focusInErrorSummary = this.#clones.get('errorSummary')?.contains(document.activeElement)

      if (focusInErrorSummary && prevFocusItem != null) {
        prevFocusItem.focus()
      }
    }, 10)
  }

  /**
   * Blur handler on error summary element
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #blurSummary (e: Event): void {
    (e.currentTarget as HTMLElement).removeAttribute('role')
  }

  /**
   * Submit handler on form element
   *
   * @param {SubmitEvent} e
   * @return {void}
   */
  submit (e: SubmitEvent): void {
    e.preventDefault()

    this.submitted = true
    this.validate()
  }

  /**
   * Validate form
   *
   * @return {boolean}
   */
  validate (): boolean {
    let valid = true

    this.groups.forEach((group, name) => {
      const validGroup = this.#validateGroup(group, name)

      if (!validGroup) {
        valid = false
      }
    })

    this.#displayErrorSummary(!valid, true)

    return valid
  }

  /**
   * Retrieve form values
   *
   * @return {FormValues}
   */
  getValues (): FormValues {
    const formValues: FormValues = {}

    this.groups.forEach((group, name) => {
      const { values, type } = group
      const valuesLen = values.length
      const legend = this.#legends.get(name)
      const label = this.#labels.get(name)
      const single = valuesLen === 1

      let newValues: string | string[] = values

      if (valuesLen === 0) {
        newValues = ''
      }

      if (single) {
        newValues = values[0] as string
      }

      const formObj: FormValue = {
        value: newValues,
        type: single ? type[0] as string : type
      }

      if (legend) {
        formObj.legend = legend
      }

      if (label) {
        formObj.label = label
      }

      const valueArgs: FormValueFilterArgs = { name, group }

      formValues[name] = applyFilters(`form:value:${this.id}`, formObj, valueArgs)
    })

    const valuesArgs: FormValuesFilterArgs = { groups: this.groups }

    return applyFilters(`form:values:${this.id}`, formValues, valuesArgs)
  }

  /**
   * Clear form values and error messages
   *
   * @return {void}
   */
  clear (): void {
    this.form?.reset()
    this.#clearErrorMessages()
  }
}

/* Exports */

export { Form }
