/**
 * Objects - Modal
 */

/* Imports */

import { isHtmlElementArray, isHtmlElement } from '../../utils/html/html.js'
import { onEscape, removeEscape } from '../../utils/escape/escape.js'
import { stopScroll } from '../../utils/scroll/scrollStop.js'
import { getItem } from '../../utils/item/item.js'
import {
  toggleFocusability,
  getInnerFocusableItems,
  getOuterFocusableItems
} from '../../utils/focusability/focusability.js'

/**
 * Custom event details
 */
declare global {
  interface ElementEventMap {
    'modal:toggle': CustomEvent
  }
}

/**
 * Handles display of modal
 */
class Modal extends HTMLElement {
  /**
   * Button element(s) open modal
   *
   * @type {HTMLButtonElement[]}
   */
  opens: HTMLButtonElement[] = []

  /**
   * Element(s) close modal
   *
   * @type {HTMLElement[]}
   */
  closes: HTMLElement[] = []

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Open state
   *
   * @type {boolean}
   */
  open: boolean = false

  /**
   * Id for focus delay timeout
   *
   * @private
   * @type {number}
   */
  #focusDelayId: number = 0

  /**
   * First focusable element in modal
   *
   * @private
   * @type {HTMLElement|null}
   */
  #firstFocusable: HTMLElement | null = null

  /**
   * Last button element to open modal
   *
   * @private
   * @type {HTMLButtonElement|null}
   */
  #lastOpens: HTMLButtonElement | null = null

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #openHandler = this.#open.bind(this)
  #closeHandler = this.#close.bind(this)
  #escapeHandler = this.#escape.bind(this)

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

    /* Clear event listeners */

    this.opens.forEach(open => {
      open.removeEventListener('click', this.#openHandler)
    })

    this.closes.forEach(close => {
      close.removeEventListener('click', this.#closeHandler)
    })

    removeEscape(this.#escapeHandler)

    /* Empty props */

    this.opens = []
    this.closes = []
    this.init = false
    this.#firstFocusable = null
    this.#lastOpens = null

    /* Clear timeouts */

    clearTimeout(this.#focusDelayId)
  }

  /**
   * Init check required items and set properties
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const opens = this.getAttribute('opens')?.split(',').map(id => document.getElementById(id))
    const closes = getItem(['[data-modal-close]'], this)

    /* Check required items exist */

    if (!isHtmlElementArray(opens, HTMLButtonElement) || !isHtmlElementArray(closes)) {
      return false
    }

    /* Element props */

    this.opens = opens
    this.closes = closes

    /* Event listeners */

    this.opens.forEach(open => {
      open.addEventListener('click', this.#openHandler)
    })

    this.closes.forEach(close => {
      close.addEventListener('click', this.#closeHandler)
    })

    onEscape(this.#escapeHandler)

    /* Init successful */

    return true
  }

  /**
   * Open/close modal - handle attributes and toggle focusability
   *
   * @private
   * @param {boolean} open
   * @return {void}
   */
  #toggle (open: boolean): void {
    /* Open state */

    this.open = open

    /* Clear timeouts */

    clearTimeout(this.#focusDelayId)

    /* Emit on event */

    const onToggle = new CustomEvent('modal:toggle')
    this.dispatchEvent(onToggle)

    /* Items outside modal inert and save first focusable element */

    toggleFocusability(!this.open, getOuterFocusableItems(this))

    if (! (this.#firstFocusable)) {
      const innerFocusable = getInnerFocusableItems(this)
      const [firstFocusable] = innerFocusable

      if (isHtmlElement(firstFocusable)) {
        this.#firstFocusable = firstFocusable
      }
    }

    /* Update attributes, modal focus and scroll */

    this.setAttribute('open', this.open.toString())

    if (open) {
      this.#focusDelayId = window.setTimeout(() => {
        this.#firstFocusable?.focus()
      }, 100)

      stopScroll(true)
    } else {
      this.#lastOpens?.focus()
      stopScroll(false)
    }
  }

  /**
   * Escape hook callback
   *
   * @private
   * @return {void}
   */
  #escape (): void {
    if (this.open) {
      this.#toggle(false)
    }
  }

  /**
   * Click handler on close element(s) to close modal
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #close (e: Event): void {
    e.preventDefault()

    this.#toggle(false)
  }

  /**
   * Click handler on open button to open modal
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #open (e: Event): void {
    e.preventDefault()

    this.#lastOpens = e.currentTarget as HTMLButtonElement
    this.#toggle(true)
  }
}

/* Exports */

export { Modal }
