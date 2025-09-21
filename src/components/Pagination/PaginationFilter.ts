/**
 * Components - Pagination Filter
 */

/* Imports */

import type {
  PaginationFilterInput,
  PaginationFilterGroup,
  PaginationFilterGroups,
  PaginationFilterLoadOn
} from './PaginationTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { getItem } from '../../utils/item/item.js'
import { Pagination } from './Pagination.js'

/**
 * Handles dynamic pagination with form filters.
 */
class PaginationFilter extends Pagination {
  /**
   * Form element of inputs.
   *
   * @type {HTMLFormElement|null}
   */
  form: HTMLFormElement | null = null

  /**
   * Data (values, inputs, type) by input name.
   *
   * @type {PaginationFilterGroups}
   */
  groups: PaginationFilterGroups = new Map()

  /**
   * Event to fire load on.
   *
   * @type {PaginationFilterLoadOn}
   */
  loadOn: PaginationFilterLoadOn = 'submit'

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  subInit: boolean = false

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #changeHandler = (e: Event): void => { void this.#change(e) }
  #submitHandler = (e: SubmitEvent): void => { void this.#submit(e) }
  #resetHandler = (): void => { void this.#reset() }

  /**
   * Create new instance.
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM.
   */
  override connectedCallback (): void {
    /* Inherit */

    super.connectedCallback()

    /* Initialize */

    this.subInit = this.#initialize()
  }

  /**
   * Clean up after removed from DOM.
   */
  override async disconnectedCallback (): Promise<void> {
    /* Inherit */

    await super.disconnectedCallback()

    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.subInit) {
      return
    }

    /* Clear event listeners */

    this.form?.removeEventListener('submit', this.#submitHandler)
    this.groups.forEach(group => {
      group.inputs.forEach(input => {
        input.removeEventListener('change', this.#changeHandler)
      })
    })

    /* Empty props */

    this.form = null
    this.groups.clear()
    this.subInit = false
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
    const inputs = getItem(['[data-pag-filter]'], this) as PaginationFilterInput[]

    /* Check required items exist */

    if (!isHtmlElementArray(inputs) || !isHtmlElement(form, HTMLFormElement)) {
      return false
    }

    /* Load onset */

    const loadOn = this.getAttribute('load-on') || 'submit'

    this.loadOn = loadOn as PaginationFilterLoadOn

    /* Inputs */
    
    inputs.forEach(input => {
      const name = input.name

      if (loadOn === 'change') {
        input.addEventListener('change', this.#changeHandler)
      }

      if (this.groups.has(name)) {
        this.groups.get(name)?.inputs.push(input)
        return
      }

      const type = input.tagName.toLowerCase()

      this.groups.set(name, {
        inputs: [input],
        type: type === 'input' ? input.type : type,
        values: []
      })
    })

    /* Groups required */

    if (!this.groups.size) {
      return false
    }

    /* Form */

    this.form = form

    if (loadOn === 'submit') {
      this.form.addEventListener('submit', this.#submitHandler)
    }

    this.form.addEventListener('reset', this.#resetHandler)

    /* Init successful */

    return true
  }

  /**
   * Update input values and compare with params.
   *
   * @param {PaginationFilterGroup} group
   * @param {string} name
   * @return {boolean} - True if values different from current params. 
   */
  #setGroup (group: PaginationFilterGroup, name: string): boolean {
    const { inputs, type } = group
    const values: string[] = []
    const paramValue = this.params[name]

    inputs.forEach(input => {
      let value = ''

      switch (type) {
        case 'checkbox':
        case 'radio':
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
              values.push(optValue)
            }
          }

          break
        default:
          value = input.value.trim()
      }

      if (isStringStrict(value)) {
        values.push(value)
      }
    })

    group.values = values

    const newParamValue = values.length ? values.join(',') : undefined
    this.params[name] = newParamValue

    return paramValue !== newParamValue
  }

  /**
   * Change handler on input element.
   *
   * @private
   * @param {Event} e
   * @return {Promise<void>}
   */
  async #change (e: Event): Promise<void> {
    const name = (e.currentTarget as HTMLInputElement).name
    const group = this.groups.get(name)

    if (!group) {
      return
    }

    this.#setGroup(group, name)

    await this.load('form')
  }

  /**
   * Submit handler on form element of inputs.
   *
   * @param {SubmitEvent} e
   * @return {Promise<void>}
   */
  async #submit (e: SubmitEvent): Promise<void> {
    e.preventDefault()

    let diff = false

    this.groups.forEach((group, name) => {
      diff = this.#setGroup(group, name)
    })

    if (!diff) { // eslint-disable-line @typescript-eslint/no-unnecessary-condition
      return
    }

    await this.load('form')
  }

  /**
   * Reset handler on form element of inputs.
   *
   * @return {Promise<void>}
   */
  async #reset (): Promise<void> {
    this.page = 1
    this.params = {}

    await this.load('form')
  }
}

/* Exports */

export { PaginationFilter }
