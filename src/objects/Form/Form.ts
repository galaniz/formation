/**
 * Objects - Form
 */

/* Imports */

import type {
  FormInput,
  FormPrimitive,
  FormGroup,
  FormErrorOn,
  FormValidateResult,
  FormValidateFilterArgs,
  FormValue,
  FormValueFilterArgs,
  FormValues,
  FormValuesFilterArgs,
  FormChangeActionArgs,
  FormTemplates,
  FormTemplateKeys,
  FormClones,
  FormGroups
} from './FormTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { cloneItem, getItem, getTemplateItem } from '../../items/items.js'
import { applyFilters } from '../../filters/filters.js'
import { doActions } from '../../actions/actions.js'

/**
 * Handles form validation and retrieval of values.
 */
class Form extends HTMLElement {
  /**
   * Form element.
   *
   * @type {HTMLFormElement|null}
   */
  form: HTMLFormElement | null = null

  /**
   * Data (values, inputs, type) by input name.
   *
   * @type {FormGroups}
   */
  groups: FormGroups = new Map()

  /**
   * Display errors on submit, change or both.
   *
   * @type {FormErrorOn}
   */
  errorOn: FormErrorOn = 'both'

  /**
   * Track submit state.
   *
   * @type {boolean}
   */
  submitted: boolean = false

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Template types in use.
   *
   * @type {Set<FormTemplateKeys>}
   */
  usedTemplates: Set<FormTemplateKeys> = new Set(['errorInline'])

  /**
   * Error, loader and success fragments.
   *
   * @type {FormTemplates}
   */
  static templates: FormTemplates = new Map()

  /**
   * Clones of templates.
   *
   * @type {FormClones}
   */
  clones: FormClones = new Map()

  /**
   * Track number of instances.
   *
   * @type {number}
   */
  static #count: number = 0

  /**
   * Labels by input name.
   *
   * @private
   * @type {Map<string, string>}
   */
  #labels: Map<string, string> = new Map()

  /**
   * Legends by input name.
   *
   * @private
   * @type {Map<string, string>}
   */
  #legends: Map<string, string> = new Map()

  /**
   * Error list item IDs, messages and focus ID.
   *
   * @private
   * @type {Map<string, string[]>}
   */
  #errorList: Map<string, [string, string]> = new Map()

  /**
   * Error IDs following initial DOM order.
   *
   * @private
   * @type {string[]}
   */
  #errorOrder: string[] = []

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #changeHandler = this.#change.bind(this)
  #blurSummaryHandler = this.#blurSummary.bind(this)
  #submitHandler = this.submit.bind(this) as (e: SubmitEvent) => void

  /**
   * Create new instance.
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM.
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up after removed from DOM.
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Count */

    Form.#count -= 1

    /* Clear event listeners */

    this.form?.removeEventListener('submit', this.#submitHandler)
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

    if (!Form.#count) { // Clear if last element
      Form.templates.clear()
    }

    this.clones.clear()
    this.#labels.clear()
    this.#legends.clear()
    this.#errorList.clear()
    this.#errorOrder = []
  }

  /**
   * Init check required items and set props.
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

    /* Error display */

    const errorOn = this.getAttribute('error-on')

    if (isStringStrict(errorOn)) {
      this.errorOn = errorOn as FormErrorOn
    }

    /* Create groups */

    for (const input of inputs) {
      this.#appendInput(input)
    }

    if (!this.groups.size) {
      return false
    }

    /* Form */

    this.form = form
    this.form.addEventListener('submit', this.#submitHandler)

    /* Init successful */

    Form.#count += 1

    return true
  }

  /**
   * Add input and field info to groups.
   *
   * @private
   * @param {FormInput} input
   * @return {boolean}
   */
  #appendInput (input: FormInput): boolean {
    /* Name and ID required */

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
        invalidMessage: '',
        id
      })

      return true
    }

    /* Group data */

    const group = this.groups.get(name)
    const groupExists = group != null

    if (groupExists) {
      input.addEventListener('change', this.#changeHandler)
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

    if (fieldsetRequired && !isStringStrict(legendId)) { // Legend ID required
      return false
    }

    if (hasLegend) {
      const legendText = getItem('[data-form-legend-text]', legend)?.textContent

      if (isStringStrict(legendText)) {
        this.#legends.set(name, legendText)
      }
    }

    /* Label */

    const label = field.querySelector('label')
    const hasLabel = isHtmlElement(label)

    if (hasLabel) {
      const labelText = getItem('[data-form-label-text]', label)?.textContent

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

    /* Error order */

    const groupId = (fieldsetRequired ? legendId : id) as string // Cast as IDs required
    this.#errorOrder.push(groupId)

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
      invalidMessage: isStringStrict(invalidMessage) ? invalidMessage : '',
      id: groupId
    })

    input.addEventListener('change', this.#changeHandler)

    /* Successfully added */

    return true
  }

  /**
   * Validate inputs.
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
    let values: FormPrimitive[] = []
    const ariaInvalid: number[] = []

    let message = ''
    let valid = true

    /* Values from inputs */

    inputs.forEach((input, i) => {
      let value: FormPrimitive | undefined
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

          for (const option of selected) {
            const optValue = option.value.trim()

            if (isStringStrict(optValue)) {
              hasValue = true
              values.push(optValue)
            }
          }

          break
        case 'file':
          const files = (input as HTMLInputElement).files

          if (files) {
            hasValue = true
            values = Array.from(files)
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
   * Validate input group.
   *
   * @private
   * @param {FormGroup} group
   * @param {string} name
   * @param {boolean} [quiet=false]
   * @return {boolean}
   */
  #validateGroup (group: FormGroup, name: string, quiet: boolean = false): boolean {
    /* Group data */

    const {
      field,
      inputs,
      type,
      label,
      required,
      emptyMessage,
      id
    } = group

    /* Validate input group */

    const validate = this.#validateInputs(inputs, name, type, required, emptyMessage)
    const { values, valid, ariaInvalid, message } = validate

    /* Save valid state and values in group */

    group.values = values
    group.valid = valid

    /* Display errors */

    if (quiet) {
      return valid
    }

    if (!valid) {
      this.#setErrorMessage(id, message, field, inputs, label, ariaInvalid)
      this.#errorList.set(id, [message, inputs[0]?.id as string]) // Cast as input ID required in append

      const newErrorList = new Map<string, [string, string]>()
      this.#errorOrder.forEach(id => {
        const value = this.#errorList.get(id)

        if (!value) {
          return
        }

        newErrorList.set(id, value)
      })

      this.#errorList = newErrorList
      this.getClone('errorSummary')
    } else {
      this.#removeErrorMessage(id, field, inputs, label)
      this.#errorList.delete(id)
    }

    /* Reset summary list */

    this.#setErrorList()

    /* Result */

    return valid
  }

  /**
   * Field error message.
   *
   * @private
   * @param {string} id
   * @param {string} message
   * @param {HTMLElement} field
   * @param {FormInput[]} inputs
   * @param {HTMLElement} label
   * @param {number[]} ariaInvalid
   * @return {void}
   */
  #setErrorMessage (
    id: string,
    message: string,
    field: HTMLElement,
    inputs: FormInput[],
    label: HTMLElement,
    ariaInvalid: number[]
  ): void {
    /* Check if error element exists */

    const errorId = `${id}-error`
    const errorTextId = `${errorId}-text`
    const error = document.getElementById(errorTextId)

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
      cloneText.id = errorTextId
      cloneText.textContent = message

      label.append(clone)
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
   * Remove field error message.
   *
   * @private
   * @param {string} id
   * @param {HTMLElement} field
   * @param {FormInput[]} inputs
   * @param {HTMLElement} label
   * @return {void}
   */
  #removeErrorMessage (
    id: string,
    field: HTMLElement,
    inputs: FormInput[],
    label: HTMLElement
  ): void {
    /* Check if error element exists */

    const errorId = `${id}-error`
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
   * Update error summary display and focus or first error focus.
   *
   * @private
   * @param {boolean} display
   * @param {boolean} [focus]
   * @return {void}
   */
  #displayErrors (display: boolean, focus: boolean = false): void {
    const errorSummary = this.getClone('errorSummary')

    if (!errorSummary) {
      if (display && focus) {
        const [, id] = this.#errorList.values().next().value as [string, string] // Cast as error exists if display true

        document.getElementById(id)?.focus()
      }

      return
    }

    errorSummary.style.display = !display ? 'none' : ''

    if (focus) {
      errorSummary.setAttribute('role', 'alert')
      errorSummary.focus()
    }
  }

  /**
   * Create/update error list items.
   *
   * @private
   * @return {void}
   */
  #setErrorList (): void {
    if (!this.#errorList.size) {
      this.#displayErrors(false)
    }

    const errorList = this.clones.get('errorList')

    if (!isHtmlElement(errorList, HTMLUListElement)) {
      return
    }

    const frag = new window.DocumentFragment()

    this.#errorList.forEach(([message], id) => {
      const item = document.createElement('li')
      const link = document.createElement('a')

      link.href = `#${id}`
      link.textContent = message

      item.append(link)
      frag.append(item)
    })

    errorList.textContent = ''
    errorList.append(frag)
  }

  /**
   * Change handler on input element.
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #change (e: Event): void {
    /* Group required */

    const target = (e.currentTarget as HTMLInputElement)
    const name = target.name
    const group = this.groups.get(name)

    if (!group) {
      return
    }

    /* Check errors onset */

    const on = this.errorOn
    const quiet = on === 'submit' || (!this.submitted && on === 'both')

    /* Validate group */

    this.#validateGroup(group, name, quiet)

    const changeArgs: FormChangeActionArgs = {
      name,
      group,
      target
    }

    doActions(`form:change:${this.id}`, changeArgs)

    if (quiet) {
      return
    }

    /* Display error summary */

    if (this.#errorList.size) {
      this.#displayErrors(true)
    }
  }

  /**
   * Blur handler on error summary element.
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #blurSummary (e: Event): void {
    (e.currentTarget as HTMLElement).removeAttribute('role')
  }

  /**
   * Submit handler on form element.
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
   * Clone, return and optionally append template element.
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

    /* Error summary and list */

    if (type === 'errorSummary') {
      this.form?.prepend(clone)
      clone.addEventListener('blur', this.#blurSummaryHandler)

      const errorList = getItem('ul', clone)

      if (isHtmlElement(errorList, HTMLUListElement)) {
        this.clones.set('errorList', errorList)
      }

      return clone
    }

    /* Append to element */

    if (isHtmlElement(appendTo)) {
      appendTo.append(clone)
    }

    /* Return clone */

    return clone
  }

  /**
   * Validate form.
   *
   * @param {boolean} [quiet=false] Display errors.
   * @return {boolean}
   */
  validate (quiet: boolean = false): boolean {
    let valid = true

    this.groups.forEach((group, name) => {
      const validGroup = this.#validateGroup(group, name, quiet)

      if (!validGroup) {
        valid = false
      }
    })

    if (!quiet) {
      this.#displayErrors(!valid, true)
    }

    return valid
  }

  /**
   * Retrieve form values.
   *
   * @return {FormValues}
   */
  getValues (): FormValues {
    const formValues: FormValues = {}

    this.groups.forEach((group, name) => {
      const { values, type } = group
      const valuesCount = values.length
      const legend = this.#legends.get(name)
      const label = this.#labels.get(name)
      const single = valuesCount === 1
      const empty = !valuesCount

      let newValues: FormPrimitive | FormPrimitive[] = values

      if (empty) {
        newValues = ''
      }

      if (single) {
        newValues = values[0] as FormPrimitive
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
   * Clear form values, error messages and summary.
   *
   * @return {void}
   */
  clear (): void {
    this.form?.reset()
    this.groups.forEach(group => {
      const { id, field, inputs, label } = group

      this.#removeErrorMessage(id, field, inputs, label)
    })

    this.#errorList.clear()
    this.#setErrorList()
  }
}

/* Exports */

export { Form }
