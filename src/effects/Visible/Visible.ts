/**
 * Effects - Visible
 */

/* Imports */

import type { VisibleItem } from './VisibleTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { getItem } from '../../utils/item/item.js'
import { onScroll, removeScroll } from '../../utils/scroll/scroll.js'
import { onResize, removeResize } from '../../utils/resize/resize.js'

/**
 * Handles link state based on item visibility
 */
class Visible extends HTMLElement {
  /**
   * Links, corresponding items, state and offsets
   *
   * @type {Map<string, VisibleItem>}
   */
  items: Map<string, VisibleItem> = new Map()

  /**
   * Top offset (eg. scroll margin)
   *
   * @type {number}
   */
  offset: number = 0

  /**
   * Id of end element
   *
   * @type {string}
   */
  end: string = ''

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * End element
   *
   * @type {HTMLElement|null}
   */
  #end: HTMLElement | null = null

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #resizeHandler = this.#resize.bind(this)
  #scrollHandler = this.#scroll.bind(this)

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

    removeResize(this.#resizeHandler)
    removeScroll(this.#scrollHandler)

    /* Empty props */

    this.init = false
    this.items.clear()
  }

  /**
   * Init check required items and set properties
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Links */

    const links = getItem(['[data-vis-link]'], this)

    if (!isHtmlElementArray(links, HTMLAnchorElement)) {
      return false
    }

    /* End element */

    const end = document.getElementById(this.getAttribute('end') || '')

    if (isHtmlElement(end)) {
      this.#end = end
    }

    /* Corresponding items required */

    const nextMap: Map<string, HTMLElement> = new Map()

    links.forEach((link, i) => {
      const id = link.hash.replace('#', '')
      const item = document.getElementById(id)

      if (!isHtmlElement(item)) {
        return false
      }

      this.items.set(id, {
        link,
        item,
        next: this.#end,
        top: 0,
        bottom: 0,
        visible: false
      })

      if (i === 0) {
        return
      }

      nextMap.set(id, item)      
    })

    nextMap.forEach((item, id) => {
      const visibleItem = this.items.get(id)

      if (visibleItem) {
        visibleItem.next = item
      }
    })

    nextMap.clear()

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

    this.#setOffsets()
    this.#setVisible()

    /* Event listeners */

    onResize(this.#resizeHandler)
    onScroll(this.#scrollHandler)

    /* Init successful */

    return true
  }

  /**
   * Top and bottom offsets
   *
   * @private
   * @return {void}
   */
  #setOffsets (): void {
    this.items.forEach(entry => {
      const { item, next } = entry

      const rect = item.getBoundingClientRect()
      const scrollY = window.scrollY

      const top = rect.top + scrollY
      let bottom = rect.bottom + scrollY

      if (next) {
        bottom = next.getBoundingClientRect().top + scrollY
      }

      entry.top = top
      entry.bottom = bottom
    })
  }

  /**
   * Check if top/bottom of item reached/exited top of viewport
   *
   * @private
   * @return {void}
   */
  #setVisible (): void {
    const scrollY = window.scrollY

    this.items.forEach(entry => {
      const { link, top, bottom } = entry

      const visible = (scrollY >= top - this.offset) && scrollY <= bottom - this.offset

      if (visible) {
        link.setAttribute('aria-current', 'true')
      } else {
        link.removeAttribute('aria-current')
      }

      entry.visible = visible
    })
  }

  /**
   * Scroll hook callback
   *
   * @private
   * @return {void}
   */
  #scroll (): void {
    this.#setVisible()
  }

  /**
   * Resize hook callback
   *
   * @private
   * @return {void}
   */
  #resize (): void {
    this.#setOffsets()
    this.#setVisible()
  }
}

/* Exports */

export { Visible }
