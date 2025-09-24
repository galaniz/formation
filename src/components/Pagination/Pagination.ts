/**
 * Components - Pagination
 */

/* Imports */

import type {
  PaginationDisplay,
  PaginationSlots,
  PaginationTemplateKeys,
  PaginationTemplates,
  PaginationState,
  PaginationSource
} from './PaginationTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { getItem, getTemplateItem, cloneItem } from '../../utils/item/item.js'
import { getInnerFocusableItems } from '../../utils/focusability/focusability.js'
import { setDisplay } from '../../utils/display/display.js'

/**
 * Handles dynamic pagination navigation and entries.
 */
class Pagination extends HTMLElement {
  /**
   * Base URL.
   *
   * @type {string}
   */
  url: string = ''

  /**
   * Current page.
   *
   * @type {number}
   */
  page: number = 1

  /**
   * Total number of items.
   *
   * @type {number}
   */
  total: number = 1

  /**
   * Number of items to display.
   *
   * @type {PaginationDisplay}
   */
  display: PaginationDisplay = new Map()

  /**
   * Navigation and entry containers.
   *
   * @type {PaginationSlots}
   */
  slots: PaginationSlots = new Map()

  /**
   * Loader and error fragments.
   *
   * @type {PaginationTemplates}
   */
  templates: PaginationTemplates = new Map()

  /**
   * Clones of templates.
   *
   * @type {PaginationTemplates}
   */
  clones: PaginationTemplates = new Map()

  /**
   * Params for push state and request.
   *
   * @type {Object<string, string|undefined>}
   */
  params: Record<string, string | undefined> = {}

  /**
   * Initialize state.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * ID for loader display timeout.
   *
   * @private
   * @type {number}
   */
  #loaderDelayId: number = 0

  /**
   * ID for result focus timeout.
   *
   * @private
   * @type {number}
   */
  #resultDelayId: number = 0

  /**
   * ID for item focus timeout.
   *
   * @private
   * @type {number}
   */
  #focusDelayId: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #clickHandler = this.#click.bind(this) as EventListener
  #popHandler = this.#pop.bind(this) as (e: PopStateEvent) => void

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

    this.slots.get('nav')?.removeEventListener('click', this.#clickHandler)
    window.removeEventListener('popstate', this.#popHandler)

    /* Empty props */

    this.slots.clear()
    this.display.clear()
    this.templates.clear()
    this.clones.clear()
    this.params = {}
    this.init = false

    /* Clear timeouts */

    clearTimeout(this.#loaderDelayId)
    clearTimeout(this.#resultDelayId)
    clearTimeout(this.#focusDelayId)
  }

  /**
   * Init check required items and set props.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const url = this.getAttribute('url')
    const loaderId = this.getAttribute('loader')
    const errorId = this.getAttribute('error')
    const noneId = this.getAttribute('none')
    const entry = getItem('[data-pag-slot="entry"]', this)
    const nav = getItem('[data-pag-slot="nav"]', this)

    /* Check required items exist */

    if (
      !isHtmlElement(entry) ||
      !isHtmlElement(nav) ||
      !isStringStrict(url) ||
      !isStringStrict(loaderId) ||
      !isStringStrict(errorId) ||
      !isStringStrict(noneId)
    ) {
      return false
    }

    /* Display required */

    const entryDisplay = parseInt(entry.dataset.pagDisplay || '', 10)
    const navDisplay = parseInt(nav.dataset.pagDisplay || '', 10)

    if (!isNumber(entryDisplay) || !isNumber(navDisplay)) {
      return false
    }

    /* Error and loader required */

    const error = getTemplateItem(errorId)
    const loader = getTemplateItem(loaderId)
    const none = getTemplateItem(noneId)

    if (!isHtmlElement(error) || !isHtmlElement(loader) || !isHtmlElement(none)) {
      return false
    }

    this.templates.set('error', error)
    this.templates.set('loader', loader)
    this.templates.set('none', none)

    /* Props */

    this.url = url
    this.slots.set('nav', nav)
    this.slots.set('entry', entry)
    this.display.set('nav', navDisplay)
    this.display.set('entry', entryDisplay)

    /* Event listeners */

    this.slots.get('nav')?.addEventListener('click', this.#clickHandler)
    window.addEventListener('popstate', this.#popHandler)

    /* Init successful */

    return true
  }

  /**
   * Click handler on navigation listens for link clicks.
   *
   * @private
   * @param {Event} e
   * @return {Promise<void>}
   */
  async #click (e: Event): Promise<void> {
    /* Link required */

    const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement

    if (target.tagName !== 'A') {
      return
    }

    e.preventDefault()

    /* Page */

    const url = new URL(target.href)
    const newPage = Number(url.searchParams.get('page')) || 1

    if (newPage === this.page) {
      return
    }

    this.page = newPage

    /* Request and update items */

    await this.load('nav')
  }

  /**
   * Popstate handler on window navigation triggers load.
   *
   * @private
   * @param {PopStateEvent} e
   * @return {Promise<void>}
   */
  async #pop (e: PopStateEvent): Promise<void> {
    const {
      total,
      page,
      params
    } = e.state as PaginationState

    this.total = total
    this.page = page
    this.params = params

    await this.load('pop')
  }

  /**
   * Clone and return template element.
   *
   * @param {PaginationTemplateKeys} type
   * @return {HTMLElement|null}
   */
  getClone (type: PaginationTemplateKeys): HTMLElement | null {
    /* Check if exists */

    const result = this.clones.get(type)

    if (isHtmlElement(result)) {
      return result
    }

    /* Clone template */

    const clone = cloneItem(this.templates.get(type))

    if (!isHtmlElement(clone)) {
      return null
    }

    if (type === 'loader') {
      this.append(clone)
    } else {
      this.insertBefore(clone, this.slots.get('nav') || null)
    }

    this.clones.set(type, clone)

    /* Return clone */

    return clone
  }

  /**
   * Refresh navigation and entry slots with result.
   *
   * @param {'error'|'none'|'output'} result
   * @param {DocumentFragment|string} [nav]
   * @param {DocumentFragment|string} [entry]
   * @return {boolean} - Slots and history updated.
   */
   update (
    result: 'error' | 'none' | 'output',
    nav?: DocumentFragment | string,
    entry?: DocumentFragment | string
  ): boolean {
    /* Loader */

    setDisplay(this.getClone('loader'), 'hide', 'loader')

    /* Error or none */

    if (result === 'error' || result === 'none') {
      this.getClone(result)

      this.#resultDelayId = setDisplay(this.getClone(result), 'focus')

      return false
    }

    /* Output */

    const navSlot = this.slots.get('nav')
    const entrySlot = this.slots.get('entry')

    if (!navSlot || !entrySlot) {
      return false
    }

    navSlot.textContent = ''
    entrySlot.textContent = ''

    let navSet = false
    let entrySet = false

    if (isStringStrict(nav)) {
      navSlot.insertAdjacentHTML('afterbegin', nav)
      navSet = true
    }

    if (isHtmlElement(nav)) {
      navSlot.append(nav)
      navSet = true
    }

    if (isStringStrict(entry)) {
      entrySlot.insertAdjacentHTML('afterbegin', entry)
      entrySet = true
    }

    if (isHtmlElement(entry)) {
      entrySlot.append(entry)
      entrySet = true
    }

    if (!navSet || !entrySet) {
      return false
    }

    this.#focusDelayId = window.setTimeout(() => {
      const innerFocusable = getInnerFocusableItems(entrySlot)
      const [firstFocusable] = innerFocusable

      if (isHtmlElement(firstFocusable)) {
        firstFocusable.focus()
      }
    }, 0)

    /* Update history */

    const url = new URL(this.url)
    const newParams: Record<string, string> = {}

    if (this.page > 1) {
      url.searchParams.set('page', this.page.toString())
    } else {
      url.searchParams.delete('page')
    }

    for (const [key, value] of Object.entries(this.params)) {
      if (!value) {
        url.searchParams.delete(key)
      } else {
        url.searchParams.set(key, value)
      }
    }

    const state: PaginationState = {
      total: this.total,
      page: this.page,
      params: newParams
    }

    history.pushState(state, '', url.toString())

    return true
  }

  /**
   * Fetch data and update slots.
   *
   * @param {PaginationSource} source
   * @return {Promise<void>|void}
   */
  request (source: PaginationSource): Promise<void> | void {
    void source
  }

  /**
   * Initiate loader and data request.
   *
   * @param {PaginationSource} source
   * @return {Promise<void>}
   */
  async load (source: PaginationSource): Promise<void> {
    clearTimeout(this.#loaderDelayId)
    clearTimeout(this.#resultDelayId)
    clearTimeout(this.#focusDelayId)

    if (this.clones.has('error')) {
      setDisplay(this.getClone('error'), 'hide')
    }

    if (this.clones.has('none')) {
      setDisplay(this.getClone('none'), 'hide')
    }

    this.#loaderDelayId = setDisplay(this.getClone('loader'), 'focus', 'loader')

    await this.request(source)
  }
}

/* Exports */

export { Pagination }
