/**
 * Layouts - Masonry
 */

/**
 * Class - create masonry layout by placing items into columns
 */

class Masonry {
  /**
   * Set public properties and initialize
   *
   * @param {object} args
   * @param {HTMLElement} args.container
   * @param {NodeList} args.items
   * @param {object[]} args.breakpoints
   * @param {object} args.column
   * @param {string} args.column.tag
   * @param {string} args.column.class
   * @return {void|boolean} - false if init errors
   */

  constructor (args) {
    const {
      container = null,
      items = null,
      breakpoints = [],
      column = {
        tag: 'div',
        class: ''
      }
    } = args

    this.container = container
    this.items = items
    this.breakpoints = breakpoints
    this.column = column

    /**
     * Store break point ranges
     *
     * @private
     * @type {object[]}
     */

    this._bkRanges = []

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
   * Initialize - check required props, set breakpoint ranges and arrange
   *
   * @private
   * @return {boolean}
   */

  _initialize () {
    /* Check that required properties not null */

    if (!this.container || !this.items || this.items.length === 0) {
      return false
    }

    /* Convert items to array */

    this.items = Array.from(this.items)

    /* Store number of items */

    this._itemsLength = this.items.length

    /* Set breakpoint ranges */

    const breakpointLength = this.breakpoints.length

    this.breakpoints.forEach((bk, i) => {
      let low = 0
      let high = bk.width
      let cols = 1

      if (i > 0) {
        low = this.breakpoints[i - 1].width
        cols = this.breakpoints[i - 1].cols
      }

      this._bkRanges.push({
        high,
        low,
        cols
      })

      if (i === breakpointLength - 1) {
        low = bk.width
        high = 99999
        cols = bk.cols

        this._bkRanges.push({
          high,
          low,
          cols
        })
      }
    })

    /* Store number of breakpoint ranges */

    this._bkRangesLength = this._bkRanges.length

    /* Event listeners */

    window.addEventListener('resize', this._resizeHandler.bind(this))

    /* Arrange into columns */

    this._arrange()

    return true
  }

  /**
   * Determine columns from current breakpoint range and arrange items
   *
   * @private
   * @return {void}
   */

  _arrange () {
    let currentRange

    for (let i = 0; i < this._bkRangesLength; i += 1) {
      const bkRange = this._bkRanges[i]
      const low = bkRange.low
      const high = bkRange.high

      if (this._viewportWidth >= low && this._viewportWidth < high) {
        currentRange = this._bkRanges[i]
        break
      }
    }

    this._wrapItems(currentRange.cols)
  }

  /**
   * Wrap and unwrap items from columns
   *
   * @private
   * @param {number} cols
   * @return {void}
   */

  _wrapItems (cols) {
    const fragment = document.createDocumentFragment()
    const colItems = {}
    const colHeights = []
    const colKeys = []
    const itemCols = []
    const itemHeights = []
    let indexTracker = 0

    for (let i = 0; i < cols; i += 1) {
      colItems[i] = []
      colHeights[i] = 0
      colKeys.push(i)
    }

    this.items.forEach((item, index) => {
      itemCols[index] = indexTracker
      colItems[indexTracker].push(item)

      indexTracker += 1

      if (colKeys.indexOf(indexTracker) === -1) {
        indexTracker = 0
      }

      indexTracker = colKeys[indexTracker]
    })

    Object.keys(colItems || {}).forEach((index) => {
      const elem = document.createElement(this.column.tag)
      elem.setAttribute('class', this.column.class)

      colItems[index].forEach((item) => {
        elem.appendChild(item)
      })

      fragment.appendChild(elem)
    })

    this.container.innerHTML = ''
    this.container.appendChild(fragment)

    /**
     * Hack for trying to equalize column heights a bit
     */

    /* Get offsets of all items */

    const offsets = []

    this.items.forEach((item, index) => {
      offsets.push(item.offsetTop)

      const itemHeight = item.clientHeight

      colHeights[itemCols[index]] += itemHeight
      itemHeights[index] = itemHeight
    })

    /* Get last item (visually) */

    const maxOffset = Math.max(...offsets)
    const lastVisualItemIndex = offsets.indexOf(maxOffset)

    colHeights[itemCols[lastVisualItemIndex]] -= itemHeights[lastVisualItemIndex]

    /* Get smallest column */

    const smCol = Math.min(...colHeights)
    const smColIndex = colHeights.indexOf(smCol)
    const smColContainer = this.container.children[smColIndex]

    smColContainer.appendChild(this.items[lastVisualItemIndex])
  }

  /**
   * Resize event handler - re-arrange
   *
   * @private
   * @return {void}
   */

  _resizeHandler () {
    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      this._arrange()
    }, 100)
  }

  /**
   * Public method - add items and re-arrange
   *
   * @param {NodeList} items
   * @return {void}
   */

  addItems (items) {
    items = Array.from(items)

    items.forEach((item) => {
      this.items.push(item)
    })

    this._itemsLength = this.items.length

    this._arrange()
  }
}

/* Exports */

export { Masonry }
