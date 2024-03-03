/**
 * Layouts - Margin Masonry
 */

/**
 * Class - create masonry layout with negative margins
 */

class MarginMasonry {
  /**
   * Set public properties and initialize
   *
   * @param {object} args
   * @param {HTMLElement} args.container
   * @param {NodeList} args.items
   * @param {string} args.itemSelector
   * @param {object[]} args.breakpoints
   * @return {void|boolean} - false if init errors
   */

  constructor (args) {
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
     * Store items info - element, offsets, height and indexes
     *
     * @private
     * @type {object[]}
     */

    this._itemInfo = []

    /**
     * Store items and height by top offset
     *
     * @private
     * @type {object}
     */

    this._rows = {}

    /**
     * Store heights from previous rows to get offsets
     *
     * @private
     * @type {number}
     */

    this._cumulativeOffset = 0

    /**
     * Store specified column in breakpoints array/adjusted column number
     *
     * @private
     * @type {number}
     */

    this._currentColumns = 0

    /**
     * Store specified margin in breakpoints array
     *
     * @private
     * @type {number}
     */

    this._currentMargin = 0

    /**
     * Store timeout id in resize event
     *
     * @private
     * @type {number}
     */

    this._resizeTimer = -1

    /**
     * Store viewport width for resize event and check if within breakpoints
     *
     * @private
     * @type {number}
     */

    this._viewportWidth = window.innerWidth

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize - check required props, set breakpoint ranges
   *
   * @private
   * @return {boolean}
   */

  _initialize () {
    /* Check that required properties not null */

    if (!this.container || !this.items || !this.itemSelector || !this.breakpoints) {
      return false
    }

    /* Make sure items are array instead of nodelist */

    this.items = Array.from(this.items)

    /* Store container parent for appending adjusted items */

    this._containerParent = this.container.parentNode

    /* Set breakpoint ranges */

    const breakpointLength = this.breakpoints.length

    this.breakpoints.forEach((bk, i) => {
      const low = bk.width
      let high = 99999

      if (breakpointLength > 1 && i < breakpointLength - 1) {
        high = this.breakpoints[i + 1].width
      }

      bk.low = low
      bk.high = high
    })

    /* Set rows and item info and margins */

    const set = this._setVars(true)

    if (set) {
      this._getMargins()
      this._setMargins()
    }

    /* Event listeners */

    this._resizeHandler = this._resize.bind(this)

    window.addEventListener('resize', this._resizeHandler)

    return true
  }

  /**
   * Set column number and margin, reset cumulative offset, rows and item info
   *
   * @private
   * @param {boolean} init
   * @return {boolean}
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

    for (let i = 0; i < this.items.length; i += 1) {
      const offset = this.items[i].offsetTop

      if (i === 0) {
        firstOffset = offset
      }

      if (offset === firstOffset) {
        c += 1
      } else {
        break
      }
    }

    if (c) {
      this._currentColumns = c
    }

    /* Item and row info */

    if (!init) {
      this._setMargins(true)
    }

    this._cumulativeOffset = 0
    this._rows = {}
    this._itemInfo = []

    const scrollY = window.scrollY

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

    Object.keys(this._rows || {}).forEach((r) => {
      const rr = this._rows[r]
      rr.ogHeight = Math.max(...rr.ogHeights)
    })

    return true
  }

  /**
   * Update item info objects - margin top and bottom offset
   *
   * @private
   * @return {void}
   */

  _getMargins () {
    this._itemInfo.forEach((it, i) => {
      if (it.sisterIndex === undefined) {
        return
      }

      const sister = this._itemInfo[it.sisterIndex]
      const sisterOffset = sister.bottom
      const itOffset = it.top - this._cumulativeOffset
      let marginTop = itOffset - sisterOffset - this._currentMargin

      if (marginTop < 0) {
        marginTop = 0
      }

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

  /**
   * Set and unset item margins
   *
   * @private
   * @param {boolean} unset
   * @return {void}
   */

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

      if (!unset) {
        val = this._itemInfo[i].marginTop
      }

      const marginTop = unset ? '' : `-${val}px`

      item.style.marginTop = marginTop
    })

    this._containerParent.appendChild(frag)
  }

  /**
   * Resize event handler - reset margins
   *
   * @private
   * @return {void}
   */

  _resize () {
    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

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
}

/* Exports */

export { MarginMasonry }
