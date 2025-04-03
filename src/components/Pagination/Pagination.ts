/**
 * Components - Pagination
 */

/* Imports */

import type { PaginationTemplate, PaginationFilterInput } from './PaginationTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { getItem, getTemplateItem } from '../../utils/item/item.js'

/**
 * Custom event details
 */
declare global {
  interface ElementEventMap {
    'pagination:click': CustomEvent<URL>
  }
}

/**
 * Handles dynamic pagination list
 */
class Pagination extends HTMLElement {
  /**
   * Current page
   *
   * @type {number}
   */
  current: number = 1

  /**
   * Total number of items
   *
   * @type {number}
   */
  total: number = 1

  /**
   * Number of list item links to display
   *
   * @type {number}
   */
  display: number = 5

  /**
   * List element
   *
   * @type {HTMLUListElement|null}
   */
  list: HTMLUListElement | null = null

  /**
   * Form element of filter inputs
   *
   * @type {HTMLFormElement|null}
   */
  form: HTMLFormElement | null = null

  /**
   * Filter inputs
   *
   * @type {PaginationFilterInput[]}
   */
  filters: PaginationFilterInput[] = []

  /**
   * Filter input/url param values
   *
   * @private
   * @type {Object<string, string>}
   */
  data: Record<string, string> = {}

  /**
   * Initialize state
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * List item fragments
   *
   * @type {Map<PaginationTemplate, HTMLElement>}
   */
  static templates: Map<PaginationTemplate, HTMLElement> = new Map()

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #clickHandler = this.#click.bind(this)
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

    this.list?.removeEventListener('click', this.#clickHandler)
    this.form?.removeEventListener('submit', this.#submitHandler)

    /* Empty/nullify props */

    this.list = null
    this.form = null
    this.init = false
  }

  /**
   * Initialize - check required items exist and run set
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const ellipsis = getTemplateItem(this.getAttribute('ellipsis') || '')
    const prevLink = getTemplateItem(this.getAttribute('prev-link') || '')
    const prevText = getTemplateItem(this.getAttribute('prev-text') || '')
    const nextLink = getTemplateItem(this.getAttribute('next-link') || '')
    const nextText = getTemplateItem(this.getAttribute('next-text') || '')
    const current = getTemplateItem(this.getAttribute('current') || '')
    const item = getTemplateItem(this.getAttribute('item') || '')
    const list = getItem('[data-pag-list]', this)
    const form = getItem('[data-pag-form]', this)
    const filters = getItem(['[data-pag-filter]'], this)

    /* Check required items exist */

    if (!isHtmlElement(list, HTMLUListElement) ||
      !isHtmlElement(prevLink) ||
      !isHtmlElement(prevText) ||
      !isHtmlElement(nextLink) ||
      !isHtmlElement(nextText) ||
      !isHtmlElement(current) ||
      !isHtmlElement(item)) {
      return false
    }

    /* List */

    this.list = list
    this.list.addEventListener('click', this.#clickHandler)

    /* Templates */

    if (Pagination.templates.size === 0) {
      Pagination.templates = new Map([
        ['prev-link', prevLink],
        ['prev-text', prevText],
        ['next-link', nextLink],
        ['next-text', nextText],
        ['current', current],
        ['item', item]
      ])
  
      if (isHtmlElement(ellipsis)) {
        Pagination.templates.set('ellipsis', ellipsis)
      }
    }

    /* Form */

    if (isHtmlElement(form, HTMLFormElement)) {
      this.form = form
      this.form.addEventListener('submit', this.#submitHandler)
    }

    if (isHtmlElementArray(filters)) {
      this.filters = filters as PaginationFilterInput[]
    }

    /* Init successful */

    return true
  }

  /**
   * Click handler on list to listen for link clicks
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #click (e: Event): void {
    /* Must be link */
  
    const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement

    if (target.tagName !== 'A') {
      return
    }

    e.preventDefault()

    /* Emit click event */

    const onClick = new CustomEvent('pagination:click', {
      detail: new URL(target.href)
    })

    this.dispatchEvent(onClick)
  }

  /**
   * Submit handler on form element of filter inputs
   *
   * @param {Event} e
   * @return {void}
   */
  submit (e: Event): void {
    e.preventDefault()
  }
}

/* Exports */

export { Pagination }
