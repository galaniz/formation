/**
 * Components - Pagination
 */

/* Imports */

import type {
  PaginationSlots,
  PaginationTemplateKeys,
  PaginationTemplates,
  PaginationState,
  PaginationSource,
  PaginationEventDetail
} from './PaginationTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { getItem, getTemplateItem, cloneItem } from '../../items/items.js'
import { getInnerFocusableItems } from '../../items/itemsFocusability.js'
import { setDisplay } from '../../utils/display/display.js'

/**
 * Custom event details.
 */
declare global {
  interface ElementEventMap {
    'pag:load': CustomEvent<PaginationEventDetail>
  }
}

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
  #clickHandler = (e: Event): void => { void this.#click(e) }
  #popHandler = (e: PopStateEvent): void => { void this.#pop(e) }

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
    this.templates.clear()
    this.clones.clear()
    this.params = {}
    this.init = false

    /* History */

    history.scrollRestoration = 'auto'

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

    const loaderId = this.getAttribute('loader')
    const errorId = this.getAttribute('error')
    const entry = getItem('[data-pag-slot="entry"]', this)
    const nav = getItem('[data-pag-slot="nav"]', this)

    /* Check required items exist */

    if (
      !isHtmlElement(entry) ||
      !isHtmlElement(nav) ||
      !isStringStrict(loaderId) ||
      !isStringStrict(errorId)
    ) {
      return false
    }

    /* Error and loader required */

    const error = getTemplateItem(errorId)
    const loader = getTemplateItem(loaderId)

    if (!isHtmlElement(error) || !isHtmlElement(loader)) {
      return false
    }

    this.templates.set('error', error)
    this.templates.set('loader', loader)
    this.slots.set('nav', nav)
    this.slots.set('entry', entry)

    /* Params and page */

    this.setState()

    /* Event listeners */

    this.slots.get('nav')?.addEventListener('click', this.#clickHandler)
    window.addEventListener('popstate', this.#popHandler)

    /* History */

    history.scrollRestoration = 'manual'

    /* Init successful */

    return true
  }

  /**
   * Click handler on navigation element to listen for link clicks.
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
   * Pop state handler on window navigation to trigger load.
   *
   * @private
   * @param {PopStateEvent} e
   * @return {Promise<void>}
   */
  async #pop (e: PopStateEvent): Promise<void> {
    const state = e.state as PaginationState | null

    if (!state) {
      this.setState()
    }

    const {
      page,
      params
    } = (e.state as PaginationState | null) || {}

    this.page = page || this.page
    this.params = params || this.params

    await this.load('pop')
  }

  /**
   * Current URL, page and params.
   *
   * @return {void}
   */
  setState (): void {
    const { origin, pathname, search } = window.location
    const url = origin + pathname
    const currentParams = new URLSearchParams(search)
    const params: Record<string, string> = {}
    let page = 1

    for (const [key, value] of currentParams.entries()) {
      if (key === 'page') {
        page = Number(value)
        continue
      }

      params[key] = value
    }

    this.url = url
    this.params = params
    this.page = page
  }

  /**
   * Clone, return and append template element.
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

    this.append(clone)
    this.clones.set(type, clone)

    /* Return clone */

    return clone
  }

  /**
   * Refresh navigation and entry slots with result.
   *
   * @param {'error'|'success'} result
   * @param {PaginationSource} source
   * @param {DocumentFragment|string} [nav]
   * @param {DocumentFragment|string} [entry]
   * @return {boolean} - Slots and/or history updated.
   */
  update (
    result: 'error' | 'success',
    source: PaginationSource,
    nav?: DocumentFragment | string,
    entry?: DocumentFragment | string
  ): boolean {
    /* Clear loader, nav and entry slots */

    setDisplay(this.getClone('loader'), 'hide', 'loader')

    const navSlot = this.slots.get('nav')
    const entrySlot = this.slots.get('entry')

    if (!navSlot || !entrySlot) {
      return false
    }

    navSlot.textContent = ''
    entrySlot.textContent = ''

    /* Error output */

    if (result === 'error') {
      this.getClone(result)

      this.#resultDelayId = setDisplay(this.getClone(result), 'focus')

      return false
    }

    /* Success output */

    if (isStringStrict(nav)) {
      navSlot.insertAdjacentHTML('afterbegin', nav)
    }

    if (isHtmlElement(nav)) {
      navSlot.append(nav)
    }

    if (isStringStrict(entry)) {
      entrySlot.insertAdjacentHTML('afterbegin', entry)
    }

    if (isHtmlElement(entry)) {
      entrySlot.append(entry)
    }

    this.#focusDelayId = window.setTimeout(() => {
      const innerFocusable = getInnerFocusableItems(entrySlot)
      const [firstFocusable] = innerFocusable

      if (isHtmlElement(firstFocusable)) {
        firstFocusable.focus()
      }
    }, 0)

    /* Update history */

    if (source === 'pop') {
      return true
    }

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
        newParams[key] = value
      }
    }

    const state: PaginationState = {
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
    const onLoad = new CustomEvent('pag:load', { detail: { source } })
    this.dispatchEvent(onLoad)

    clearTimeout(this.#loaderDelayId)
    clearTimeout(this.#resultDelayId)
    clearTimeout(this.#focusDelayId)

    if (this.clones.has('error')) {
      setDisplay(this.getClone('error'), 'hide')
    }

    this.#loaderDelayId = setDisplay(this.getClone('loader'), 'focus', 'loader')

    await this.request(source)
  }
}

/* Exports */

export { Pagination }
