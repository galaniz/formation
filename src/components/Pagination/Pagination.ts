/**
 * Components - Pagination
 */

/* Imports */

import type { PaginationTemplate } from './PaginationTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { getItem, getTemplateItem } from '../../utils/item/item.js'

/**
 * Handles dynamic pagination list.
 */
class Pagination extends HTMLElement {
  /**
   * Base URL.
   *
   * @private
   * @type {string}
   */
  url: string = ''

  /**
   * Current page.
   *
   * @type {number}
   */
  current: number = 1

  /**
   * Total number of items.
   *
   * @type {number}
   */
  total: number = 1

  /**
   * Number of list item links to display.
   *
   * @type {number}
   */
  display: number = 5

  /**
   * List element.
   *
   * @type {HTMLUListElement|null}
   */
  list: HTMLUListElement | null = null

  /**
   * Form element of filter inputs.
   *
   * @type {HTMLFormElement|null}
   */
  form: HTMLFormElement | null = null

  /**
   * Filter input values by name.
   *
   * @type {Object<string, string>}
   */
  filters: Record<string, string> = {}

  /**
   * Initialize state.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * List item fragments.
   *
   * @type {Map<PaginationTemplate, HTMLElement>}
   */
  static templates: Map<PaginationTemplate, HTMLElement> = new Map()

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #clickHandler = this.#click.bind(this)
  #submitHandler = this.submit.bind(this)
  #resetHandler = this.reset.bind(this)

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

    /* Clear event listeners */

    this.list?.removeEventListener('click', this.#clickHandler)
    this.form?.removeEventListener('submit', this.#submitHandler)

    /* Empty props */

    this.list = null
    this.form = null
    this.init = false
  }

  /**
   * Init check required items and run set.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const url = this.getAttribute('url')
    const ellipsis = getTemplateItem(this.getAttribute('ellipsis') || '')
    const prevLink = getTemplateItem(this.getAttribute('prev-link') || '')
    const prevText = getTemplateItem(this.getAttribute('prev-text') || '')
    const nextLink = getTemplateItem(this.getAttribute('next-link') || '')
    const nextText = getTemplateItem(this.getAttribute('next-text') || '')
    const current = getTemplateItem(this.getAttribute('current') || '')
    const item = getTemplateItem(this.getAttribute('item') || '')
    const list = getItem('[data-pag-list]', this)
    const form = getItem('[data-pag-form]', this)

    /* Check required items exist */

    if (!isHtmlElement(list, HTMLUListElement) ||
      !isHtmlElement(prevLink) ||
      !isHtmlElement(prevText) ||
      !isHtmlElement(nextLink) ||
      !isHtmlElement(nextText) ||
      !isHtmlElement(current) ||
      !isHtmlElement(item) ||
      !url) {
      return false
    }

    /* URL */

    this.url = url

    /* List */

    this.list = list
    this.list.addEventListener('click', this.#clickHandler)

    /* Templates */

    if (!Pagination.templates.size) {
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
      this.form.addEventListener('reset', this.#resetHandler)
    }

    /* Init successful */

    return true
  }

  /**
   * Refresh list element with new items.
   *
   * @private
   * @return {void}
   */
   #resetList (): void {
    if (!isHtmlElement(this.list, HTMLUListElement)) {
      return
    }

    /* Clear list */

    this.list.innerHTML = ''

    /* Total must be greater than 1 and base link required */

    if (this.total <= 1 || !this.url) {
      return
    }

    /* Update history */

    const state = {
      total: this.total,
      current: this.current,
      filters: this.filters
    }

    const url = '' // assume page and filters are params

    history.pushState(state, '', url)
  }

  /**
   * Click handler on list to listen for link clicks.
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #click (e: Event): void {
    /* Link required */

    const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement

    if (target.tagName !== 'A') {
      return
    }

    e.preventDefault()

    /* Current */

    const url = new URL(target.href)
    const newCurrent = Number(url.searchParams.get('page')) || 1

    if (newCurrent === this.current) {
      return
    }

    this.current = newCurrent

    /* Fetch and update list */

    this.fetch()
    this.#resetList()
  }

  /**
   * Submit handler on form element of filter inputs.
   *
   * @param {Event} e
   * @return {void}
   */
  submit (e: Event): void {
    e.preventDefault()

    /* Filter values */

    if (!isHtmlElement(this.form, HTMLFormElement)) {
      return
    }

    const formData = new FormData(this.form)
    const newFilters: Record<string, string> = {}
    let diff = false

    for (const [name, value] of formData.entries()) {
      newFilters[name] = value as string

      if (this.filters[name] !== value) {
        diff = true
      }
    }

    if (!diff) {
      return
    }

    this.filters = newFilters

    /* Fetch and update list */

    this.fetch()
    this.#resetList()
  }

  /**
   * Reset handler on form element of filter inputs.
   *
   * @return {void}
   */
  reset (): void {
    /* Reset */

    this.current = 1
    this.filters = {}

    /* Fetch and update list */

    this.fetch()
    this.#resetList()
  }

  /**
   * Override to fetch data.
   *
   * @return {void}
   */
  fetch (): void {}
}

/* Exports */

export { Pagination }
