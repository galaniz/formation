/**
 * Objects - Form
 */

/* Imports */

import type {
  FormInput,
  FormGroup,
  FormErrorListItem,
  FormValidateResult,
  FormValue,
  FormValueFilter
} from './FormTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isFunction } from '../../utils/function/function.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isItemFocusable, focusSelector } from '../../utils/focusability/focusability.js'
import { getOuterItems } from '../../utils/item/itemOuter.js'
import { getItem } from '../../utils/item/item.js'

/**
 * Form validation and input values retrieval
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
   * @type {Map<string, FormGroup>}
   */
  groups: Map<string, FormGroup> = new Map()

  /**
   * Error summary container
   *
   * @type {HTMLElement|null}
   */
  errorSummary: HTMLElement | null = null

  /**
   * Error list container
   *
   * @type {HTMLUListElement|null}
   */
  errorList: HTMLUListElement | null = null

  /**
   * Error message template element
   *
   * @type {HTMLTemplateElement|null}
   */
  errorTemplate: HTMLTemplateElement | null = null

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
   * Types by input name
   *
   * @private
   * @type {Map<string, string>}
   */
  #types: Map<string, string> = new Map()

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
   * Error list item ids
   *
   * @private
   * @type {Set<string>}
   */
  #errorListIds: Set<string> = new Set()

  /**
   * Error list item messages by id
   *
   * @private
   * @type {Map<string, string>}
   */
  #errorListMessages: Map<string, string> = new Map()

  /**
   * Error list item element and message by id
   *
   * @private
   * @type {Map<string, FormErrorListItem>}
   */
  #errorListItems: Map<string, FormErrorListItem> = new Map()

  /**
   * Url validation regex
   *
   * @private
   * @type {RegExp}
   * @see {@link https://urlregex.com/|Source}
   */
  #urlRegex: RegExp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/

  /**
   * Email validation regex
   *
   * @private
   * @type {RegExp}
   * @see {@link https://emailregex.com/|Source}
   */
  #emailRegex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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

    this.errorSummary?.addEventListener('blur', this.#blurSummaryHandler)

    this.groups.forEach(group => {
      const { inputs } = group

      inputs.forEach(input => {
        input.removeEventListener('click', this.#blurHandler)
      })
    })

    /* Empty/nullify props */

    this.groups.clear()
    this.form = null
    this.errorSummary = null
    this.errorList = null
    this.errorTemplate = null
    this.init = false
    this.submitted = false
    this.#types.clear()
    this.#labels.clear()
    this.#legends.clear()
    this.#errorListIds.clear()
    this.#errorListMessages.clear()
    this.#errorListItems.clear()

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
    /* Get items */

    const inputs = getItem(['[data-form-input]'], this) as FormInput[]
    const errorSummary = getItem(['[data-form-error-summary]'], this)
    const errorList = getItem(['[data-form-error-list]'], this)

    /* Check that required items exist */

    if (!isHtmlElementArray(inputs)) {
      return false
    }

    /* Error template required */

    const errorTemplateId = this.dataset.errorTemplateId

    if (!isStringStrict(errorTemplateId)) {
      return false
    }

    const errorTemplate = document.getElementById(errorTemplateId)

    if (!isHtmlElement(errorTemplate, HTMLTemplateElement)) {
      return false
    }

    this.errorTemplate = errorTemplate

    /* Create groups */

    let init = false

    inputs.forEach(input => {
      /* Name */

      const name = input.name

      if (!isStringStrict(name)) {
        return
      }

      /* Append input */

      const group = this.groups.get(name)

      if (group != null) {
        group.inputs.push(input)
        return
      }

      /* Required */

      const ariaRequired = input.getAttribute('aria-required')
      const dataRequired = input.dataset.ariaRequired // Required radio buttons and checkboxes in groups

      let required = ariaRequired === 'true'
      let allowAriaInvalid = true

      if (dataRequired === 'true') {
        required = true
        allowAriaInvalid = false
      }

      /* Type */

      let type = input.tagName.toLowerCase()

      if (type === 'input') {
        type = input.type
      }

      this.#types.set(name, type)

      /* Legend */

      const legend = input.closest('fieldset')?.querySelector('legend')
      const hasLegend = isHtmlElement(legend)

      let allowLabel = true
      let groupLabel = null

      if (hasLegend) {
        groupLabel = legend
        allowLabel = type !== 'radio' && type !== 'checkbox'

        const legendText = legend.textContent

        if (isStringStrict(legendText)) {
          this.#legends.set(name, legendText.replace(' required', ''))
        }
      }

      /* Label */

      const label = input.closest('[data-form-field]')?.querySelector('[data-form-label]')
      const hasLabel = isHtmlElement(label)

      if (hasLabel && allowLabel) {
        groupLabel = label

        const labelText = label.textContent

        if (isStringStrict(labelText)) {
          this.#labels.set(name, labelText.replace(' required', ''))
        }
      }

      /* Group label required */

      if (!groupLabel) {
        return
      }

      /* Empty and invalid messages */

      const emptyMessage = input.dataset.formEmpty
      const invalidMessage = input.dataset.formInvalid

      /* Group data */

      this.groups.set(name, {
        inputs: [input], // Array for checkboxes and radio buttons
        label: groupLabel,
        labelType: hasLegend ? 'legend' : 'label',
        required,
        type,
        values: [],
        valid: false,
        emptyMessage: isStringStrict(emptyMessage) ? emptyMessage : '',
        invalidMessage: isStringStrict(invalidMessage) ? invalidMessage : '',
        allowAriaInvalid
      })

      /* Blur to validate beyond submit */

      input.addEventListener('blur', this.#blurHandler)

      /* Input processed */

      init = true
    })

    /* Error list container */

    if (isHtmlElement(errorSummary) && isHtmlElement(errorList, HTMLUListElement)) {
      this.errorSummary = errorSummary
      this.errorList = errorList
      this.errorSummary.addEventListener('blur', this.#blurSummaryHandler)
    }

    /* Init successful */

    return init
  }

  /**
   * Validate inputs
   *
   * @private
   * @param {FormInput[]} inputs
   * @param {string} type
   * @param {boolean} required
   * @param {string} emptyMessage
   * @param {string} invalidMessage
   * @return {FormValidateResult}
   */
  #validateInputs (
    inputs: FormInput[],
    type: string,
    required: boolean,
    emptyMessage: string,
    invalidMessage: string
  ): FormValidateResult {
    const values: string[] = []

    let message = ''
    let valid = false

    /* Get values from inputs */

    inputs.forEach(input => {
      let value: string | undefined

      switch (type) {
        case 'checkbox':
        case 'radio':
          value = ((input as HTMLInputElement).checked ? (input as HTMLInputElement).value.trim() : '')
          break
        case 'select':
          const selected = (input as HTMLSelectElement).selectedOptions

          for (const option of selected) {
            values.push(option.value.trim())
          }

          break
        default:
          value = input.value.trim()
      }

      if (isStringStrict(value)) {
        values.push(value)
      }
    })

    /* Bail if no values */

    if (values.length === 0) {
      return {
        values: [],
        message: isStringStrict(emptyMessage) ? emptyMessage : 'This field is required',
        valid: required ? false : true
      }
    }

    /* Check if inputs like email, url... are valid */

    const hasInvalidMessage = isStringStrict(invalidMessage)
    const firstValue = values[0] as string

    switch (type) {
      case 'email':
        if (firstValue.toLowerCase().match(this.#emailRegex)) {
          valid = true
        } else {
          valid = false
          message = hasInvalidMessage ? invalidMessage : 'Enter a valid email'
        }

        break
      case 'url':
        if (firstValue.toLowerCase().match(this.#urlRegex)) {
          valid = true
        } else {
          valid = false
          message = hasInvalidMessage ? invalidMessage : 'Enter a valid URL'
        }

        break
      default:
        valid = true
    }

    /* Result */

    return {
      values,
      message,
      valid
    }
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
      inputs,
      label,
      labelType,
      type,
      required,
      allowAriaInvalid,
      emptyMessage,
      invalidMessage
    } = group

    /* Label required */

    if (!isHtmlElement(label)) {
      return true
    }

    /* Error id required */

    const useLegend = labelType === 'legend'
    const errorId: string | undefined = useLegend ? label.id : inputs[0]?.id

    if (!isStringStrict(errorId)) {
      return true
    }

    /* Validate input group */

    const validate = this.#validateInputs(inputs, type, required, emptyMessage, invalidMessage)
    const { values, valid, message } = validate

    if (!valid) {
      this.#setErrorMessage(inputs, name, label, message, allowAriaInvalid)
      this.#errorListIds.add(errorId)
      this.#errorListMessages.set(errorId, message)
    } else {
      this.#removeErrorMessage(inputs, name, label, allowAriaInvalid)
      this.#errorListIds.delete(errorId)
      this.#errorListMessages.delete(errorId)
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
   * @param {FormInput[]} inputs
   * @param {string} name
   * @param {HTMLElement} label
   * @param {string} message
   * @param {boolean} allowAriaInvalid
   * @return {void}
   */
  #setErrorMessage (
    inputs: FormInput[],
    name: string,
    label: HTMLElement,
    message: string,
    allowAriaInvalid: boolean
  ): void {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(`${errorId}-text`)

    /* Output */

    if (isHtmlElement(error)) {
      error.textContent = message
    } else {
      const template = this.errorTemplate?.content.cloneNode(true).firstChild
      const span = isHtmlElement(template) ? template : document.createElement('span')
      const templateText = span.querySelector('[data-form-error-text]')
      const spanText = isHtmlElement(templateText) ? templateText : span.appendChild(document.createElement('span'))

      span.id = errorId
      spanText.id = `${errorId}-text`
      spanText.textContent = message

      label.insertAdjacentElement('beforeend', span)
    }

    /* Set inputs as invalid */

    if (allowAriaInvalid) {
      inputs.forEach(input => {
        input.setAttribute('aria-invalid', 'true')
      })
    }
  }

  /**
   * Remove field error message
   *
   * @private
   * @param {FormInput[]} inputs
   * @param {string} name
   * @param {HTMLElement} label
   * @param {boolean} allowAriaInvalid
   * @return {void}
   */
  #removeErrorMessage (
    inputs: FormInput[],
    name: string,
    label: HTMLElement,
    allowAriaInvalid: boolean
  ): void {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorId)

    if (isHtmlElement(error)) {
      label.removeChild(error)
    }

    /* Set inputs as valid */

    if (allowAriaInvalid) {
      inputs.forEach(input => {
        input.setAttribute('aria-invalid', 'false')
      })
    }
  }

  /**
   * Clear error messages and hide error summary
   *
   * @private
   * @return {void}
   */
  #clearErrorMessages (): void {
    this.groups.forEach((group, name) => {
      const { inputs, label, allowAriaInvalid } = group

      if (!isHtmlElement(label)) {
        return
      }

      this.#removeErrorMessage(inputs, name, label, allowAriaInvalid)
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
    if (!isHtmlElement(this.errorSummary)) {
      return
    }

    this.errorSummary.style.display = display ? 'block' : 'none'

    if (focus) {
      this.errorSummary.setAttribute('role', 'alert')
      this.errorSummary.focus()
    }
  }

  /**
   * Create/update error list items
   *
   * @private
   * @return {void}
   */
  #setErrorList (): void {
    if (!isHtmlElement(this.errorList)) {
      return
    }

    if (this.#errorListIds.size === 0) {
      this.#displayErrorSummary(false)
    }

    const frag = new window.DocumentFragment()
    let focusItem: HTMLElement | null = null

    this.#errorListIds.forEach(id => {
      const existing = this.#errorListItems.get(id)
      const currentMessage = this.#errorListMessages.get(id)
      const { message, item } = existing as FormErrorListItem

      let currentItem: HTMLLIElement | null = null

      if (existing != null && message === currentMessage) {
        currentItem = item

        if (currentItem.firstElementChild === document.activeElement) {
          focusItem = document.activeElement as HTMLElement
        }
      }

      if (currentItem == null) {
        currentItem = document.createElement('li')
        currentItem.innerHTML = `<a href="#${id}">${currentMessage}</a>`
      }

      frag.appendChild(currentItem)

      this.#errorListItems.set(id, {
        message: isStringStrict(currentMessage) ? currentMessage : '',
        item: currentItem
      })
    })

    this.errorList.innerHTML = ''
    this.errorList.appendChild(frag)

    if (focusItem != null) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      (focusItem as HTMLElement).focus()
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

    /* Only after submit */

    if (!this.submitted) {
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

      if (this.#errorListIds.size) {
        this.#displayErrorSummary(true)
        return
      }

      /* Previous focusable element from error summary */

      let prevFocusItem: Element | null = null

      getOuterItems(
        this.errorSummary,
        'prev',
        (store) => {
          let stop = false

          for (const item of store) {
            if (isItemFocusable(item)) {
              stop = true
              prevFocusItem = item
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

      const focusInErrorSummary = this.errorSummary?.contains(document.activeElement)

      if (focusInErrorSummary && prevFocusItem != null) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
        (prevFocusItem as HTMLElement).focus()
      }
    }, 10)
  }

  /**
   * Blur handler on error summary element
   *
   * @private
   * @return {void}
   */
  #blurSummary (): void {
    this.errorSummary?.removeAttribute('role')
  }

  /**
   * Submit form
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  submit (e: Event): void {
    e.preventDefault()

    this.submitted = true
    this.validate()
  }

  /**
   * Validate form
   *
   * @private
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
   * Filtered form values
   *
   * @param {FormValueFilter} filter
   * @return {Object<string, FormValue>}
   */
  getValues (filter: FormValueFilter): Record<string, FormValue> {
    const formValues: Record<string, FormValue> = {}

    this.groups.forEach((group, name) => {
      const { values } = group
      const valuesLen = values.length

      const legend = this.#legends.get(name)
      const label = this.#labels.get(name)
      const type = this.#types.get(name)

      let newValues: string | string[] = values

      if (valuesLen === 0) {
        newValues = ''
      }

      if (valuesLen === 1) {
        newValues = values[0] as string
      }

      let formObj: FormValue | null = {
        value: newValues,
        type: isStringStrict(type) ? type : ''
      }

      if (legend) {
        formObj.legend = legend
      }

      if (label) {
        formObj.label = label
      }

      if (isFunction(filter)) {
        formObj = filter(formObj)
      }

      if (formObj == null) {
        return
      }

      formValues[name] = formObj
    })

    return formValues
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
