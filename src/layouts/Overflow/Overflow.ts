/**
 * Layouts - Overflow
 */

/* Imports */

import { isHtmlElement } from '../../utils/html/html.js'
import { getItem } from '../../items/items.js'
import { onResize, removeResize } from '../../actions/actionResize.js'

/**
 * Custom event details.
 */
declare global {
  interface ElementEventMap {
    'overflow:scroll': CustomEvent
    'overflow:set': CustomEvent
  }
}

/**
 * Handles state and direction of overflow.
 */
class Overflow extends HTMLElement {
  /**
   * Scrollable element.
   *
   * @type {HTMLElement|null}
   */
  track: HTMLElement | null = null

  /**
   * Scroll direction.
   *
   * @type {'vertical'|'horizontal'}
   */
  direction: 'vertical' | 'horizontal' = 'horizontal'

  /**
   * Overflow state.
   *
   * @type {boolean}
   */
  overflow: boolean = false

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Scroll listener timeout ID.
   *
   * @private
   * @type {number}
   */
  #scrollId: number = 0

  /**
   * Difference between track and container dimensions.
   *
   * @private
   * @type {number}
   */
  #scrollDiff: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #scrollHandler = this.#scroll.bind(this)
  #resizeHandler = this.#resize.bind(this)

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

    this.track?.removeEventListener('scroll', this.#scrollHandler)
    removeResize(this.#resizeHandler)

    /* Empty props */

    this.track = null
    this.init = false
    this.overflow = false

    /* Clear timeout */

    clearTimeout(this.#scrollId)
  }

  /**
   * Init check required items and set props.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const track = getItem('[data-overflow-track]', this)

    /* Check required items exist */

    if (!isHtmlElement(track)) {
      return false
    }

    /* Direction */

    const direction = this.getAttribute('direction')

    /* Props */

    this.track = track
    this.direction = direction === 'vertical' ? 'vertical' : 'horizontal'

    /* Event listeners */

    track.addEventListener('scroll', this.#scrollHandler)
    onResize(this.#resizeHandler)

    /* Check and set state */

    this.#overflowing()
    this.#set()

    /* Init successful */

    return true
  }

  /**
   * Update overflow attribute.
   *
   * @private
   * @return {void}
   */
  #set (): void {
    if (!isHtmlElement(this.track)) {
      return
    }

    /* Attributes */

    const isHorizontal = this.direction === 'horizontal'
    const scrollValue = isHorizontal ? this.track.scrollLeft : this.track.scrollTop
    const overflowFirst = this.overflow && scrollValue > 0
    const overflowLast = this.overflow && scrollValue < this.#scrollDiff

    this.setAttribute('overflow', this.overflow.toString())
    this.setAttribute(isHorizontal ? 'left' : 'top', overflowFirst.toString())
    this.setAttribute(isHorizontal ? 'right' : 'bottom', overflowLast.toString())

    /* Emit set event */

    const onSet = new CustomEvent('overflow:set')
    this.dispatchEvent(onSet)
  }

  /**
   * Check if track element is overflowing.
   *
   * @private
   * @return {void}
   */
  #overflowing (): void {
    if (!isHtmlElement(this.track)) {
      return
    }

    const isHorizontal = this.direction === 'horizontal'
    const containerEnd = isHorizontal ? this.clientWidth : this.clientHeight
    const scrollEnd = isHorizontal ? this.track.scrollWidth : this.track.scrollHeight

    this.overflow = scrollEnd > containerEnd
    this.#scrollDiff = scrollEnd - containerEnd
  }

  /**
   * Scroll handler on track element.
   *
   * @private
   * @return {void}
   */
  #scroll (): void {
    /* Clear timeout */

    clearTimeout(this.#scrollId)

    /* Emit scroll event */

    const onScroll = new CustomEvent('overflow:scroll')
    this.dispatchEvent(onScroll)

    /* Debounce */

    this.#scrollId = window.setTimeout(() => {
      this.#set()
    }, 100)
  }

  /**
   * Resize action callback.
   *
   * @private
   * @return {void}
   */
  #resize (): void {
    this.#overflowing()
    this.#set()
  }
}

/* Exports */

export { Overflow }
