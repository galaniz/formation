/**
 * Effects - Visible
 */

/* Imports */

import { addAction } from '../../../lib/utils/actions/actions'

/**
 * Class - check if item visible in viewport
 */

class Visible {
  /**
   * Set public properties and initialize
   *
   * @param {object} args
   * @param {HTMLElement} args.item
   * @param {HTMLElement} args.visibleItem
   * @param {number} args.visibleOffset
   * @param {number} args.visibleOffsetPercentage
   * @param {boolean} args.visAll
   * @param {boolean} args.allowUnset
   * @param {number} args.delay
   * @param {string} args.wait
   * @param {function} args.onVisible
   * @param {function} args.endVisible
   * @param {function} args.onInit
   * @param {object} args.breakpoints
   * @param {number} args.breakpoints.min
   * @param {number} args.breakpoints.max
   * @return {void|boolean} - False if init errors
   */

  constructor (args) {
    const {
      item = null,
      visibleItem = null,
      visibleOffset = 0,
      visibleOffsetPercentage = 0,
      visAll = false,
      allowUnset = false,
      delay = 0,
      wait = '',
      onVisible = () => {},
      endVisible = () => {},
      onInit = () => {},
      breakpoints = {
        min: 0,
        max: 99999
      }
    } = args

    this.item = item
    this.visibleItem = visibleItem
    this.visibleOffset = visibleOffset
    this.visibleOffsetPercentage = visibleOffsetPercentage
    this.visAll = visAll
    this.allowUnset = allowUnset
    this.delay = delay
    this.wait = wait
    this.onVisible = onVisible
    this.endVisible = endVisible
    this.onInit = onInit
    this.breakpoints = breakpoints

    /**
     * Check if already initialized
     *
     * @private
     * @type {boolean}
     */

    this._initDone = false

    /**
     * Check if scrolling up or down
     *
     * @private
     * @type {boolean}
     */

    this._scrollDown = true

    /**
     * Store visible state
     *
     * @private
     * @type {boolean}
     */

    this._isVisible = false

    /**
     * Store window scroll y position - visible check, item position
     *
     * @private
     * @type {number}
     */

    this._scrollY = 0

    /**
     * Store last window scroll y position to check if scrolling up or down
     *
     * @private
     * @type {number}
     */

    this._lastScrollY = 0

    /**
     * Store timeout id in resize event
     *
     * @private
     * @type {number}
     */

    this._resizeTimer = -1

    /**
     * Store viewport width for resize event
     *
     * @private
     * @type {number}
     */

    this._viewportWidth = window.innerWidth

    /**
     * Store offset and dimension info for item
     *
     * @private
     * @type {object}
     * @prop {number} top
     * @prop {number} bottom
     * @prop {number} height
     */

    this._rect = {
      top: 0,
      bottom: 0,
      height: 0
    }

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize - check required props, set item offsets, event listeners and run scroll handler
   *
   * @private
   * @return {boolean}
   */

  _initialize () {
    /* Check required item not null */

    if (!this.item) {
      return false
    } else {
      if (this.visibleItem) {
        this.visibleItem = !Array.isArray(this.visibleItem) ? [this.visibleItem] : this.visibleItem
      }

      if (this._withinBreakpoints()) {
        this._setItemRect()
      }
    }

    /* Event listeners and */

    if (!this.wait) {
      this._eventListeners()
      this._scrollHandler()
    } else {
      addAction(this.wait, () => {
        this._eventListeners()
        this._scrollHandler()
      })
    }

    /* Init done */

    if (!this._initDone) {
      this.onInit()
      this._initDone = true
    }

    return true
  }

  /**
   * Set window event listeners
   *
   * @private
   * @return {void}
   */

  _eventListeners () {
    window.addEventListener('scroll', this._scrollHandler.bind(this))
    window.addEventListener('resize', this._resizeHandler.bind(this))
  }

  /**
   * Check if within specified breakpoints
   *
   * @private
   * @return {boolean}
   */

  _withinBreakpoints () {
    return (this._viewportWidth > this.breakpoints.min && this._viewportWidth < this.breakpoints.max)
  }

  /**
   * Store item dimensions and offsets
   *
   * @private
   * @return {void}
   */

  _setItemRect () {
    let itemTop = this.item
    let itemBottom = null

    if (this.visibleItem) {
      itemTop = this.visibleItem[0]

      if (this.visibleItem[1]) {
        itemBottom = this.visibleItem[1]
      }
    }

    const rect = itemTop.getBoundingClientRect()
    this._scrollY = window.scrollY

    const top = rect.top + this._scrollY

    let bottom = rect.bottom + this._scrollY

    if (itemBottom) {
      bottom = itemBottom.getBoundingClientRect().top + this._scrollY
    }

    this._rect = {
      top,
      ogTop: top,
      bottom,
      ogBottom: bottom,
      height: rect.height
    }
  }

  /**
   * Add visible offset to item offsets on scroll
   *
   * @private
   * @return {void}
   */

  _setOffset () {
    // let percent = 0
    const offset = this.visibleOffset

    if (this.visibleOffsetPercentage) {
      // percent = (this.visibleOffsetPercentage / 100) * this._rect.height
    }

    this._rect.top = this._rect.top - offset
    this._rect.bottom = this._rect.ogBottom - offset
  }

  /**
   * Set visible attributes
   *
   * @private
   * @return {void}
   */

  _set () {
    if (!this._isVisible) {
      this.item.setAttribute('data-vis', true)

      if (this.visAll) {
        this.item.setAttribute('data-vis-all', true)
      }

      this._isVisible = true

      this.onVisible()
    }
  }

  /**
   * Unset visible attributes
   *
   * @private
   * @return {void}
   */

  _unset () {
    if (this._isVisible) {
      this.item.setAttribute('data-vis', false)

      if (this.visAll) {
        this.item.setAttribute('data-vis-all', false)
      }

      this._isVisible = false

      this.endVisible()
    }
  }

  /**
   * Check if visible based on item offsets, viewport height and scroll position
   *
   * @private
   * @return {boolean}
   */

  _visible () { //TWO OPTIONSSSSSSS
    return ((this._scrollY >= this._rect.top - this.visibleOffset) && this._scrollY <= this._rect.bottom - this.visibleOffset)
  }

  /**
   * Scroll handler on window and general method to check if visible and set/unset attributes
   *
   * @private
   * @return {void}
   */

  _scrollHandler () {
    this._scrollY = window.scrollY
    this._scrollDown = this._lastScrollY - this._scrollY <= 0

    // this._setOffset()

    if (this._withinBreakpoints()) {
      if (this._visible()) {
        const delay = this.delay

        setTimeout(() => {
          this._set()
        }, delay)
      } else {
        if (this.allowUnset) {
          this._unset()
        }
      }
    } else {
      this._unset()
    }

    this._lastScrollY = this._scrollY
  }

  /**
   * Resize event handler - reset item offsets and run scroll handler
   *
   * @private
   * @return {void}
   */

  _resizeHandler () {
    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      this._viewportWidth = window.innerWidth

      if (this._withinBreakpoints()) {
        this._setItemRect()
      } else {
        this._unset()
      }
    }, 100)
  }
}

/* Exports */

export { Visible }
