/**
 * Layouts - Masonry
 */

/* Imports */

import type { ResizeActionArgs } from '../../utils/resize/resizeTypes.js'
import { isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { getItem } from '../../utils/item/item.js'
import { onResize, removeResize } from '../../utils/resize/resize.js'
import { config } from '../../config/config.js'

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
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Item IDs for margin styles.
   *
   * @private
   * @type {string[]}
   */
  #ids: string[] = []

  /**
   * Viewport width to check breakpoint(s).
   *
   * @private
   * @type {number}
   */
  #viewportWidth: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
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

    removeResize(this.#resizeHandler)

    /* Empty props */

    this.items = []
    this.breakpoints.clear()
    this.init = false
    this.#ids = []
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

    /* Props */

    this.items = items
    this.#ids = ids

    /* Event listeners */

    const viewportWidth = onResize(this.#resizeHandler)

    /* Layout */

    this.#set(viewportWidth)

    /* Init successful */

    return true
  }

  /**
   * Update negative margins based on current columns and margins.
   *
   * @private
   * @param {number} [viewportWidth]
   * @return {void}
   */
  #set (viewportWidth?: number): void {
    /* Viewport width */

    if (viewportWidth) {
      this.#viewportWidth = viewportWidth
    }

    /* Reset margins */

    const styleId = `mas-${this.id}-styles`
    let styles = ''

    this.#ids.forEach(id => {
      styles += `#${id}{margin-top:var(--msn-${id}-margin, 0)}`
    })

    let style = document.getElementById(styleId) as HTMLStyleElement
    const hasStyle = style != null // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    const newStyle = hasStyle ? style : document.createElement('style')

    newStyle.id = styleId
    newStyle.textContent = styles

    if (!hasStyle) {
      style = document.head.appendChild(newStyle)
    }

    /* Items */

    const newLength = this.items.length

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

    /* Layout */

    const newLayout = Array.from({ length: newLength }, (_, i): [number, number, number] => {
      const item = this.items[i] as HTMLElement
      const rect = item.getBoundingClientRect()
      const top = rect.top + scrollY
      const height = rect.height

      if (i < newColumns - 1) {
        return [
          i,
          top + height + newMargin, // Bottom offset for next row
          0 // Negative offset not needed for first row
        ]
      }

      const prevOffset = (newLayout[i - newColumns] as [number, number, number])[1] // Number as previous row must exist
      const negativeOffset = top - prevOffset
      const bottomOffset = negativeOffset + height + newMargin

      return [
        i,
        bottomOffset,
        negativeOffset
      ]
    })

    /* Update styles */

    let newStyles = ''

    this.#ids.forEach((id, i) => {
      const negativeOffset = (newLayout[i] as [number, number, number])[2] // Number as IDs length always matches items length

      newStyles += `--msn-${id}-margin:${negativeOffset > 0 ? negativeOffset * -1 : 0}px;`
    })

    newStyles = `#${this.id}{${newStyles}}`
    style.textContent = styles + newStyles
  }

  /**
   * Resize hook callback.
   *
   * @private
   * @param {ResizeActionArgs} args
   * @return {void}
   */
  #resize (args: ResizeActionArgs): void {
    const [oldViewportWidth, newViewportWidth] = args

    if (oldViewportWidth === newViewportWidth) {
      return
    }

    this.#set(newViewportWidth)
  }

  /**
   * Add new items to layout and reset.
   *
   * @param {HTMLElement[]} newItems
   * @return {boolean}
   */
  appendItems (newItems: HTMLElement[]): boolean {
    const newIds = newItems.map(item => item.id)

    if (!isHtmlElementArray(newItems) || newIds.includes('')) {
      return false
    }

    this.items.push(...newItems)
    this.#ids.push(...newIds)
    this.#set()

    return true
  }
}

/* Exports */

export { Masonry }
