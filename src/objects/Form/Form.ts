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
  FormTemplateKeys,
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
   * Validate on submit, change or both
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
   * Template types in use
   *
   * @type {Set<FormTemplateKeys>}
   */
  usedTemplates: Set<FormTemplateKeys> = new Set(['errorInline'])

  /**
   * Error, loader and success fragments
   *
   * @type {FormTemplates}
   */
  static templates: FormTemplates = new Map()

  /**
   * Clones of templates
   *
   * @type {FormClones}
   */
  clones: FormClones = new Map()

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
   * Error list item ids, messages and elements
   *
   * @private
   * @type {Map<string, FormErrorListItem>}
   */
  #errorList: Map<string, FormErrorListItem> = new Map()

  /**
   * Id for change timeout
   *
   * @private
   * @type {number}
   */
  #changeDelayId: number = 0

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #changeHandler = this.#change.bind(this)
  #blurSummaryHandler = this.#blurSummary.bind(this)
  #submitHandler = this.submit.bind(this)

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up after removed from DOM
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Remove event listeners */

    this.form?.removeEventListener('submit', this.#submitHandler as EventListener)
    this.clones.get('errorSummary')?.removeEventListener('blur', this.#blurSummaryHandler)

    this.groups.forEach(group => {
      const { inputs } = group

      inputs.forEach(input => {
        input.removeEventListener('change', this.#changeHandler)
      })
    })

    /* Empty props */

    this.form = null
    this.groups.clear()
    this.init = false
    this.submitted = false
    Form.templates.clear()
    this.clones.clear()
    this.#labels.clear()
    this.#legends.clear()
    this.#errorList.clear()

    /* Clear timeouts */

    clearTimeout(this.#changeDelayId)
  }

  /**
   * Init check required items and set properties
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const form = getItem('form', this)
    const inputs = getItem(['[data-form-input]'], this) as FormInput[]
    const errorInlineId = this.getAttribute('error-inline')

    /* Check required items exist */

    if (!isHtmlElementArray(inputs) || !isHtmlElement(form, HTMLFormElement) || !isStringStrict(errorInlineId)) {
      return false
    }

    /* Error inline template required */

    if (!Form.templates.has('errorInline')) {
      const errorInline = getTemplateItem(errorInlineId)

      if (!isHtmlElement(errorInline)) {
        return false
      }

      Form.templates.set('errorInline', errorInline)
    }

    /* Optional templates */

    const optionalTemplates: FormTemplateKeys[] = ['errorSummary', 'error', 'success', 'loader']

    optionalTemplates.forEach(tmpl => {
      const tmplId = this.getAttribute(tmpl === 'errorSummary' ? 'error-summary' : tmpl)
      
      if (!isStringStrict(tmplId)) {
        return
      }

      this.usedTemplates.add(tmpl)

      if (!Form.templates.has(tmpl)) {
        const tmplItem = getTemplateItem(tmplId)

        if (isHtmlElement(tmplItem)) {
          Form.templates.set(tmpl, tmplItem)
        }
      }
    })

    /* Validate on */

    const validateOn = this.getAttribute('validate-on')

    if (isStringStrict(validateOn)) {
      this.validateOn = validateOn as FormValidateOn
    }

    /* Create groups */

    for (const input of inputs) {
      this.appendInput(input)
    }

    if (!this.groups.size) {
      return false
    }

    /* Form */

    this.form = form
    this.form.addEventListener('submit', this.#submitHandler as EventListener)

    /* Init successful */

    return true
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

    if (!values.length) {
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
      const changed = existingItem && existingMessage === message

      this.#errorList.set(errorId, {
        message: isStringStrict(message) ? message : '',
        item: existingItem, changed
      })

      this.getClone('errorSummary')
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
   * Field error message
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
   * Handle error summary element display and focus
   *
   * @private
   * @param {boolean} display
   * @param {boolean} [focus]
   * @return {void}
   */
  #displayErrorSummary (display: boolean, focus: boolean = false): void {
    const errorSummary = this.getClone('errorSummary')

    if (!errorSummary) {
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
    if (!this.#errorList.size) {
      this.#displayErrorSummary(false)
    }

    const errorList = this.clones.get('errorList')

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

      if (!currentItem) {
        currentItem = document.createElement('li')
        currentItem.innerHTML = `<a href="#${id}">${message}</a>`
      }

      frag.append(currentItem)

      this.#errorList.set(id, { message, item: currentItem })
    })

    errorList.innerHTML = ''
    errorList.append(frag)

    if (focusItem) {
      focusItem.focus()
    }
  }

  /**
   * Change handler on input element
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #change (e: Event): void {
    /* Clear timeout */

    clearTimeout(this.#changeDelayId)

    /* Check validation onset */

    const on = this.validateOn

    if (!this.submitted && on === 'both') {
      return
    }

    /* Group required */

    const name = (e.currentTarget as HTMLInputElement).name
    const group = this.groups.get(name)

    if (!group) {
      return
    }

    /* Delay for correct active element */

    this.#changeDelayId = window.setTimeout(() => {
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

      const focusInErrorSummary = this.clones.get('errorSummary')?.contains(document.activeElement)

      if (focusInErrorSummary && prevFocusItem) {
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
   * @return {Promise<void>|void}
   */
  submit (e: SubmitEvent): Promise<void> | void {
    e.preventDefault()

    this.submitted = true
    this.validate()
  }

  /**
   * Clone and return template element if used
   *
   * @param {FormTemplateKeys} type
   * @param {HTMLElement|null} [appendTo]
   * @return {HTMLElement|null}
   */
  getClone (type: FormTemplateKeys, appendTo?: HTMLElement | null): HTMLElement | null {
    /* Check if exists */

    if (!this.usedTemplates.has(type)) {
      return null
    }

    const result = this.clones.get(type)

    if (isHtmlElement(result)) {
      return result
    }

    /* Clone template */

    const clone = cloneItem(Form.templates.get(type))

    if (!isHtmlElement(clone)) {
      return null
    }

    this.clones.set(type, clone)

    /* Append to element */

    if (isHtmlElement(appendTo)) {
      appendTo.append(clone)
    }

    /* Error summary and list */

    if (type === 'errorSummary') {
      this.form?.prepend(clone)
      clone.addEventListener('blur', this.#blurSummaryHandler)

      const errorList = getItem('ul', clone)

      if (isHtmlElement(errorList, HTMLUListElement)) {
        this.clones.set('errorList', errorList)
      }
    }

    /* Return clone */

    return clone
  }

  /**
   * Add input to groups
   *
   * @param {FormInput} input
   * @return {boolean}
   */
  appendInput (input: FormInput): boolean {
    /* Name and id (error list) required */

    const name = input.name
    const id = input.id

    if (!isStringStrict(name) || !isStringStrict(id)) {
      return false
    }

    /* Type */

    let type = input.tagName.toLowerCase()

    if (type === 'input') {
      type = input.type
    }

    if (type === 'hidden') {
      this.groups.set(name, {
        field: input,
        inputs: [input],
        label: input,
        labelType: 'label',
        required: false,
        type: [type],
        values: [],
        valid: true,
        emptyMessage: '',
        invalidMessage: ''
      })

      return true
    }

    /* Change */

    const addChange = this.validateOn !== 'submit'

    /* Group data */

    const group = this.groups.get(name)
    const groupExists = group != null

    if (addChange && groupExists) {
      input.addEventListener('change', this.#changeHandler)
    }

    if (groupExists) {
      group.inputs.push(input)
      group.type.push(type)
      return true
    }

    /* Field required */

    const field = input.closest('[data-form-field]')

    if (!isHtmlElement(field)) {
      return false
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
      return false
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
      return false
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

    /* Change to validate after submit */

    if (addChange) {
      input.addEventListener('change', this.#changeHandler)
    }

    /* Successfully added */

    return true
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
      const empty = !valuesLen

      let newValues: string | string[] = values

      if (empty) {
        newValues = ''
      }

      if (single) {
        newValues = values[0] as string
      }

      const formObj: FormValue = {
        value: newValues,
        type: single || empty ? type[0] as string : type
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
