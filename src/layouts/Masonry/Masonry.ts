/**
 * Layouts - Masonry
 */

import type { ActionResizeArgs } from '../../actions/actionsTypes.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { getItem } from '../../items/items.js'
import { onResize, removeResize } from '../../actions/actionResize.js'
import { config } from '../../config/config.js'

/**
 * Custom event details.
 */
declare global {
  interface ElementEventMap {
    'masonry:set': CustomEvent
    'masonry:load': CustomEvent
  }
}

/**
 * Handles arranging items into masonry layout.
 */
class Masonry extends HTMLElement {
  /**
   * Elements to arrange.
   *
   * @type {HTMLElement[]}
   */
  items: HTMLElement[] = []

  /**
   * Number of columns and margins by breakpoint.
   *
   * @type {Set<Record<string, number>>}
   */
  breakpoints: Set<Record<'low' | 'high' | 'columns' | 'margin', number>> = new Set()

  /**
   * Element that requests more items when scrolled into view.
   *
   * @type {HTMLElement|null}
   */
  loads: HTMLElement | null = null

  /**
   * Pixels beyond the viewport to request more items.
   *
   * @type {number}
   */
  loadsOffset: number = 0

  /**
   * More items requested and not yet appended.
   *
   * @type {boolean}
   */
  loading: boolean = false

  /**
   * No more items to request.
   *
   * @type {boolean}
   */
  done: boolean = false

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Item heights (without margins applied).
   *
   * @private
   * @type {number[]}
   */
  #heights: number[] = []

  /**
   * Viewport width to check breakpoint(s).
   *
   * @private
   * @type {number}
   */
  #viewportWidth: number = 0

  /**
   * Watches loads element.
   *
   * @private
   * @type {IntersectionObserver|null}
   */
  #observer: IntersectionObserver | null = null

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #resizeHandler = this.#resize.bind(this)
  #intersectHandler = this.#intersect.bind(this)

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
    this.#observer?.disconnect()

    /* Clear styles */

    document.getElementById(`msn-${this.id}-styles`)?.remove()

    /* Empty props */

    this.items = []
    this.breakpoints.clear()
    this.loads = null
    this.loadsOffset = 0
    this.loading = false
    this.done = false
    this.init = false
    this.#heights = []
    this.#observer = null
  }

  /**
   * Init check required items and set props.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const items = getItem(['[data-masonry-item]'], this)
    const ids = items.map(item => item.id)

    /* Check required items exist */

    if (!isHtmlElementArray(items) || ids.includes('') || !isStringStrict(this.id)) {
      return false
    }

    /* Breakpoints required */

    const { fontSizeMultiplier } = config

    const breakpoints = this.getAttribute('breakpoints')
    const columns = this.getAttribute('columns')
    const margins = this.getAttribute('margins')

    if (isStringStrict(breakpoints) && isStringStrict(columns) && isStringStrict(margins)) {
      const breakpointsArr = breakpoints.split(',')
      const columnsArr = columns.split(',')
      const marginsArr = margins.split(',')

      breakpointsArr.forEach((b, i) => {
        const c = columnsArr[i]
        const m = marginsArr[i]

        if (!isStringStrict(c) || !isStringStrict(m)) {
          return
        }

        const low = parseInt(b, 10)
        const columns = parseInt(c, 10)
        const margin = parseInt(m, 10)

        if (!isNumber(low) || !isNumber(columns) || !isNumber(margin)) {
          return
        }

        const next = breakpointsArr[i + 1]
        const high = !isStringStrict(next) ? 99999 : parseInt(next, 10)

        if (!isNumber(high)) {
          return
        }

        this.breakpoints.add({
          low: low * fontSizeMultiplier,
          high: high * fontSizeMultiplier,
          margin: margin * fontSizeMultiplier,
          columns
        })
      })
    }

    if (!this.breakpoints.size) {
      return false
    }

    /* Loads element and offset if they exist */

    const loads = getItem('[data-masonry-loads]', this)
    const loadsOffset = this.getAttribute('loads-offset')

    if (isStringStrict(loadsOffset)) {
      const loadsOffsetValue = parseInt(loadsOffset, 10)

      if (isNumber(loadsOffsetValue)) {
        this.loadsOffset = loadsOffsetValue * fontSizeMultiplier
      }
    }

    /* Props */

    this.items = items
    this.loads = isHtmlElement(loads) ? loads : null

    /* Event listeners */

    const viewportWidth = onResize(this.#resizeHandler)

    /* Layout */

    this.#style()
    this.#set(viewportWidth)

    /* Watch loads */

    this.#watch()

    /* Init successful */

    return true
  }

  /**
   * Observe loads element to request more items.
   *
   * @private
   * @return {void}
   */
  #watch (): void {
    if (!isHtmlElement(this.loads)) {
      return
    }

    this.#observer = new IntersectionObserver(this.#intersectHandler, {
      rootMargin: `${this.loadsOffset}px 0px`
    })

    this.#observer.observe(this.loads)
  }

  /**
   * Re-observe loads element as observer only fires when intersection changes.
   *
   * @private
   * @return {void}
   */
  #rewatch (): void {
    if (this.#observer == null || !isHtmlElement(this.loads) || this.done) {
      return
    }

    this.#observer.unobserve(this.loads)
    this.#observer.observe(this.loads)
  }

  /**
   * Add margin styles.
   *
   * @private
   * @return {void}
   */
  #style (): void {
    const style = document.createElement('style')

    style.id = `msn-${this.id}-styles`
    style.textContent = `#${this.id} [data-masonry-item]{margin-top:var(--msn-margin, 0)}`

    document.head.appendChild(style)
  }

  /**
   * Update negative margins based on current columns, margins and index.
   *
   * @private
   * @param {number} [viewportWidth]
   * @param {number} [fromIndex=0]
   * @return {void}
   */
  #set (viewportWidth?: number, fromIndex: number = 0): void {
    /* Viewport width */

    if (viewportWidth) {
      this.#viewportWidth = viewportWidth
    }

    /* Columns and margin */

    let newColumns = 1
    let newMargin = 0

    this.breakpoints.forEach(bk => {
      const { low, high, columns, margin } = bk

      if (this.#viewportWidth >= low && this.#viewportWidth < high) {
        newColumns = columns
        newMargin = margin
      }
    })

    /* Heights */

    const newCount = this.items.length

    for (let i = fromIndex; i < newCount; i += 1) {
      const item = this.items[i] as HTMLElement

      this.#heights[i] = item.getBoundingClientRect().height
    }

    this.#heights.length = newCount

    /* Layout stacks each item below the item above it in its column */

    const bottoms: number[] = []

    let rowTop = 0
    let rowBottom = 0

    for (let i = 0; i < newCount; i += 1) {
      if (i > 0 && i % newColumns === 0) { // Row starts below tallest item in previous row
        rowTop = rowBottom + newMargin
        rowBottom = 0
      }

      const height = this.#heights[i] as number
      const peerBottom = bottoms[i - newColumns] as number // Item one row up in the same column
      const top = i < newColumns ? 0 : peerBottom + newMargin
      const bottom = top + height
      const offset = rowTop - top

      bottoms[i] = bottom
      rowBottom = Math.max(rowBottom, bottom)

      /* Margins before the index are unchanged so stay as set */

      if (i >= fromIndex) {
        const item = this.items[i] as HTMLElement

        item.style.setProperty('--msn-margin', `${offset > 0 ? offset * -1 : 0}px`)
      }
    }

    /* Emit set event */

    const onSet = new CustomEvent('masonry:set')
    this.dispatchEvent(onSet)
  }

  /**
   * Resize action callback.
   *
   * @private
   * @param {ActionResizeArgs} args
   * @return {void}
   */
  #resize (args: ActionResizeArgs): void {
    const [oldViewportWidth, newViewportWidth] = args

    if (oldViewportWidth === newViewportWidth) {
      return
    }

    this.#set(newViewportWidth)
  }

  /**
   * Loads intersection callback.
   *
   * @private
   * @param {IntersectionObserverEntry[]} entries
   * @return {void}
   */
  #intersect (entries: IntersectionObserverEntry[]): void {
    const entry = entries[0]

    if (entry?.isIntersecting !== true || this.loading || this.done || !this.init) {
      return
    }

    this.loading = true

    /* Emit load event */

    const onLoad = new CustomEvent('masonry:load')
    this.dispatchEvent(onLoad)
  }

  /**
   * Add new items to layout and reset.
   *
   * @param {HTMLElement[]} newItems
   * @return {boolean}
   */
  appendItems (newItems: HTMLElement[]): boolean {
    this.loading = false

    const newIds = newItems.map(item => item.id)

    if (!this.init || !isHtmlElementArray(newItems) || newIds.includes('')) {
      return false
    }

    const fromIndex = this.items.length

    this.items.push(...newItems)

    this.#set(undefined, fromIndex)
    this.#rewatch()

    return true
  }

  /**
   * Stop requesting more items.
   *
   * @return {boolean}
   */
  endItems (): boolean {
    if (!this.init) {
      return false
    }

    this.loading = false
    this.done = true

    this.#observer?.disconnect()

    return true
  }
}

export { Masonry }
