/**
 * Effects - Visible
 */

import type { VisibleItem } from './VisibleTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { getItem } from '../../items/items.js'
import { onScroll, removeScroll } from '../../actions/actionScroll.js'
import { onResize, removeResize } from '../../actions/actionResize.js'

/**
 * Handles link state based on item visibility.
 */
class Visible extends HTMLElement {
  /**
   * Group of link elements identified by `data-visible-link`, with corresponding items, state and offsets, keyed by item id.
   *
   * @type {Map<string, VisibleItem>}
   */
  items: Map<string, VisibleItem> = new Map()

  /**
   * Optional element identified by `end="{id}"` marks the end of the last item.
   *
   * @type {HTMLElement|null}
   */
  end: HTMLElement | null = null

  /**
   * Optional top offset (eg. scroll margin), set by `offset="{number}"`.
   *
   * @type {number}
   */
  offset: number = 0

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Scroll position.
   *
   * @type {number}
   */
  #scrollY: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #resizeHandler = this.#resize.bind(this)
  #scrollHandler = this.#scroll.bind(this)

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

    removeResize(this.#resizeHandler)
    removeScroll(this.#scrollHandler)

    /* Empty props */

    this.init = false
    this.end = null
    this.items.clear()
  }

  /**
   * Init check required items and set props.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Links */

    const links = getItem(['[data-visible-link]'], this)

    if (!isHtmlElementArray(links, HTMLAnchorElement)) {
      return false
    }

    /* End element */

    const endId = this.getAttribute('end')

    this.end = endId ? document.getElementById(endId) : null

    /* Corresponding items required */

    let prevId = ''

    links.forEach(link => {
      const id = link.hash.replace('#', '')
      const item = document.getElementById(id)

      if (!isHtmlElement(item)) {
        return
      }

      this.items.set(id, {
        link,
        item,
        next: this.end,
        top: 0,
        bottom: 0,
        visible: false
      })

      /* Item marks end of preceding item */

      const prevItem = this.items.get(prevId)

      if (prevItem) {
        prevItem.next = item
      }

      prevId = id
    })

    if (!this.items.size) {
      return false
    }

    /* Offset */

    const offset = this.getAttribute('offset')
    const offsetNum = parseInt(offset || '0', 10)

    if (isNumber(offsetNum)) {
      this.offset = offsetNum
    }

    /* Offsets and visibiliy */

    this.#setScrollY()
    this.#setOffsets()
    this.#setVisible()

    /* Event listeners */

    onResize(this.#resizeHandler)
    onScroll(this.#scrollHandler)

    /* Init successful */

    return true
  }

  /**
   * Set scroll position.
   *
   * @private
   * @return {void}
   */
  #setScrollY (): void {
    this.#scrollY = window.scrollY
  }

  /**
   * Top and bottom offsets.
   *
   * @private
   * @return {void}
   */
  #setOffsets (): void {
    const scrollY = this.#scrollY

    this.items.forEach(entry => {
      const { item, next } = entry

      const rect = item.getBoundingClientRect()
      const top = rect.top + scrollY
      let bottom = rect.bottom + scrollY

      if (next) {
        bottom = next.getBoundingClientRect().top + scrollY
      }

      entry.top = Math.floor(top) // Browsers truncate scroll position to integer
      entry.bottom = Math.floor(bottom)
    })
  }

  /**
   * Check if top/bottom of item reached/exited top of viewport.
   *
   * @private
   * @return {void}
   */
  #setVisible (): void {
    const scrollY = this.#scrollY

    this.items.forEach(entry => {
      const { link, top, bottom } = entry

      const visible = (scrollY >= top - this.offset) && scrollY < bottom - this.offset // Exclude bottom as shared with next item top

      if (visible) {
        link.setAttribute('aria-current', 'true')
      } else {
        link.removeAttribute('aria-current')
      }

      entry.visible = visible
    })
  }

  /**
   * Scroll action callback.
   *
   * @private
   * @return {void}
   */
  #scroll (): void {
    this.#setScrollY()
    this.#setVisible()
  }

  /**
   * Resize action callback.
   *
   * @private
   * @return {void}
   */
  #resize (): void {
    this.#setScrollY()
    this.#setOffsets()
    this.#setVisible()
  }
}

export { Visible }
