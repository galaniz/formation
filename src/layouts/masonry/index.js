/**
 * Layouts: masonry by placing items into columns
 *
 * @param {object} args {
 *  @param {HTMLElement} container
 *  @param {nodelist} items
 *  @param {array} breakpoints
 *  @param {object} column {
 *   @param {string} tag
 *   @param {string} class
 *  }
 * }
 */

/* Class */

class Masonry {
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
     * Internal variables (more set in init)
     */

    /* Store break point ranges */

    this._bkRanges = []

    /* For throttling resize event */

    this._resizeTimer = null

    /* For resize event and arrange */

    this._viewportWidth = window.innerWidth

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

    if (!this.container || !this.items || this.items.length === 0) { return false }

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
  }

  /**
   * Determine columns from what current range
   */

  _arrange () {
    let currentRange

    for (let i = 0; i < this._bkRangesLength; i++) {
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
   * Wrap and unwrap helper methods
   */

  _wrapItems (cols) {
    const fragment = document.createDocumentFragment()
    const colItems = {}
    const colHeights = []
    const colKeys = []
    const itemCols = []
    const itemHeights = []
    let indexTracker = 0

    for (let i = 0; i < cols; i++) {
      colItems[i] = []
      colHeights[i] = 0
      colKeys.push(i)
    }

    this.items.forEach((item, index) => {
      itemCols[index] = indexTracker
      colItems[indexTracker].push(item)

      indexTracker++

      if (colKeys.indexOf(indexTracker) === -1) { indexTracker = 0 }

      indexTracker = colKeys[indexTracker]
    })

    for (const index in colItems) {
      const elem = document.createElement(this.column.tag)
      elem.setAttribute('class', this.column.class)

      colItems[index].forEach((item) => {
        elem.appendChild(item)
      })

      fragment.appendChild(elem)
    }

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
   * Event handlers
   */

  _resizeHandler () {
    /* Throttles resize event */

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
   * Public methods
   */

  addItems (items) {
    items = Array.from(items)

    items.forEach((item) => {
      this.items.push(item)
    })

    this._itemsLength = this.items.length

    this._arrange()
  }
} // End Masonry

/* Exports */

export default Masonry
