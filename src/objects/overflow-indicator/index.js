/**
 * Objects: overflow indicator
 *
 * @param args [object] {
 *  @param indicator [HTMLElement]
 *  @param scroll [HTMLElement]
 *  @param y [boolean]
 *  @param x [boolean]
 * }
 */

import { mergeObjects } from '../../utils'

/* Class */

class OverflowIndicator {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    this.indicator = null
    this.scroll = null
    this.y = true
    this.x = false

    /* Merge default variables with args */

    mergeObjects(this, args)

    /**
     * Internal variables
     */

    /* Check if there is overflow */

    this._overflowing = false

    /* Height or width of indicator element */

    this._indicatorEnd = 0

    /* Height or width of scroll element */

    this._scrollEnd = 0

    /* For throttling resize event */

    this._resizeTimer = null

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) {
      return false
    } else {
      return true
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required items exist */

    if (!this.indicator || !this.scroll) { return false }

    this._resizeHandler = this._resize.bind(this)
    window.addEventListener('resize', this._resizeHandler)

    this._scrollHandler = this._scroll.bind(this)
    this.scroll.addEventListener('scroll', this._scrollHandler)

    this._isOverflowing()
    this._show()

    return true
  }

  /**
   * Internal helpers
   */

  _show () {
    const scrollValue = this.y ? this.scroll.scrollTop : this.scroll.scrollLeft

    if (this.y) {
      this.indicator.setAttribute('data-top', this._overflowing && scrollValue > 0)
      this.indicator.setAttribute('data-bottom', this._overflowing && scrollValue < this._scrollEnd - this._indicatorEnd)
    } else {
      this.indicator.setAttribute('data-left', this._overflowing && scrollValue > 0)
      this.indicator.setAttribute('data-right', this._overflowing && scrollValue < this._scrollEnd - this._indicatorEnd)
    }
  }

  _isOverflowing () {
    this._overflowing = false

    if (this.y) {
      this._indicatorEnd = this.indicator.clientHeight
      this._scrollEnd = this.scroll.scrollHeight
    } else {
      this._indicatorEnd = this.indicator.clientWidth
      this._scrollEnd = this.scroll.scrollWidth
    }

    this._overflowing = this._scrollEnd > this._indicatorEnd
  }

  /**
   * Event handlers
   */

  _scroll () {
    setTimeout(() => {
      this._show()
    }, 100)
  }

  _resize () {
    /* Throttles resize event */

    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      this._isOverflowing()
      this._show()
    }, 100)
  }
} // End OverflowIndicator

/* Exports */

export default OverflowIndicator
