/**
 * Layouts: masonry with negative margins
 *
 * @param {object} args {
 *  @param {HTMLElement} container
 *  @param {nodelist} items
 *  @param {string} itemSelector
 *  @param {array} breakpoints
 * }
 */

/* Imports */

import { getScrollY } from '../../utils'

/* Class */

class MarginMasonry {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      container = null,
      items = null,
      itemSelector = '',
      breakpoints = []
    } = args

    this.container = container
    this.items = items
    this.itemSelector = itemSelector
    this.breakpoints = breakpoints

    /**
     * Internal variables
     */

    this._itemInfo = []
    this._rows = {}

    this._cumulativeOffset = 0

    this._currentColumns = 0
    this._currentMargin = 0

    /* For throttling resize event */

    this._resizeTimer = null

    this._viewportWidth = window.innerWidth
    this._viewportHeight = window.innerHeight

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) { return false }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.container || !this.items || !this.itemSelector || !this.breakpoints) { return false }

    this.items = Array.from(this.items)
    this._containerParent = this.container.parentNode

    /* Set breakpoint ranges */

    const breakpointLength = this.breakpoints.length

    this.breakpoints.forEach((bk, i) => {
      const low = bk.width
      let high = 99999

      if (breakpointLength > 1 && i < breakpointLength - 1) { high = this.breakpoints[i + 1].width }

      bk.low = low
      bk.high = high
    })

    const set = this._setVars(true)

    if (set) {
      this._getMargins()
      this._setMargins()
    }

    this._resizeHandler = this._resize.bind(this)
    window.addEventListener('resize', this._resizeHandler)

    return true
  }

  /**
   * Internal helpers
   */

  _setVars (init = false) {
    /* Current columns and margin */

    this._currentColumns = 0
    this._currentMargin = 0

    this.breakpoints.forEach((bk) => {
      if (this._viewportWidth >= bk.low && this._viewportWidth < bk.high) {
        this._currentColumns = bk.columns
        this._currentMargin = bk.margin
      }
    })

    if (!this._currentColumns && !this._currentMargin) {
      this._setMargins(true)
      return false
    }

    /* Get actual number of columns (eg. user zoomed in) */

    let firstOffset = 0
    let c = 0

    for (let i = 0; i < this.items.length; i++) {
      const offset = this.items[i].offsetTop

      if (i === 0) { firstOffset = offset }

      if (offset === firstOffset) {
        c++
      } else {
        break
      }
    }

    if (c) { this._currentColumns = c }

    /* Item and row info */

    if (!init) { this._setMargins(true) }

    this._cumulativeOffset = 0

    this._rows = {}
    this._itemInfo = []

    const scrollY = getScrollY()

    this.items.forEach((item, i) => {
      const rect = item.getBoundingClientRect()
      const offsetTop = rect.top + scrollY
      const height = rect.height

      if (!Object.getOwnPropertyDescriptor(this._rows, offsetTop)) {
        this._rows[offsetTop] = {
          items: [],
          ogHeights: [],
          ogHeight: 0,
          heights: [],
          height: 0
        }
      }

      const indexInRow = this._rows[offsetTop].items.push(item)

      this._rows[offsetTop].ogHeights.push(height)
      this._rows[offsetTop].heights.push(height)

      const sI = i - this._currentColumns
      const sisterIndex = this.items[sI] ? sI : undefined

      this._itemInfo.push({
        item,
        top: offsetTop,
        bottom: rect.bottom + scrollY,
        height,
        sisterIndex,
        indexInRow: indexInRow - 1,
        marginTop: 0
      })
    })

    for (const r in this._rows) {
      const rr = this._rows[r]
      rr.ogHeight = Math.max(...rr.ogHeights)
    }

    return true
  }

  _getMargins () {
    this._itemInfo.forEach((it, i) => {
      if (it.sisterIndex === undefined) { return }

      const sister = this._itemInfo[it.sisterIndex]
      const sisterOffset = sister.bottom
      const itOffset = it.top - this._cumulativeOffset
      let marginTop = itOffset - sisterOffset - this._currentMargin

      if (marginTop < 0) { marginTop = 0 }

      const newItHeight = it.height - marginTop

      const row = this._rows[it.top]

      row.heights[it.indexInRow] = newItHeight

      it.marginTop = marginTop
      it.bottom = it.bottom - marginTop - this._cumulativeOffset

      /* Set cumulative height at end of row */

      if (it.indexInRow === row.heights.length - 1) {
        row.height = Math.max(...row.heights)
        this._cumulativeOffset += row.ogHeight - row.height
      }
    })
  }

  _setMargins (unset = false) {
    const frag = new window.DocumentFragment()

    frag.appendChild(this.container)

    const items = Array.from(frag.querySelectorAll(this.itemSelector))

    items.forEach((item, i) => {
      item.parentNode.replaceChild(this.items[i], item)
    })

    const actualItems = Array.from(frag.querySelectorAll(this.itemSelector))

    actualItems.forEach((item, i) => {
      let val = 0

      if (!unset) { val = this._itemInfo[i].marginTop }

      const marginTop = unset ? '' : `-${val}px`

      item.style.marginTop = marginTop
    })

    this._containerParent.appendChild(frag)
  }

  /**
   * Event handlers
   */

  _resize () {
    /* Throttles resize event */

    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      this._viewportHeight = window.innerHeight

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      this._setMargins(true)

      const set = this._setVars()

      if (set) {
        this._getMargins()
        this._setMargins()
      }
    }, 100)
  }
} // End MarginMasonry

/* Exports */

export default MarginMasonry
