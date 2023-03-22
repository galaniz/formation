/**
 * Effects - visible
 */

/* Imports */

import { prefix, subscribe } from '../../utils'

/**
 * Class - check if item visible in viewport
 */

class Visible {
  /**
   * Set public properties and initialize
   *
   * @param {object} args {
   *  @prop {HTMLElement} item
   *  @prop {HTMLElement} visibleItem
   *  @prop {number} visibleOffset
   *  @prop {number} visibleOffsetPercentage
   *  @prop {boolean} visAll
   *  @prop {boolean} allowUnset
   *  @prop {number} delay
   *  @prop {string} wait
   *  @prop {boolean} sticky
   *  @prop {number} stickyOffset
   *  @prop {number} stickyDelay
   *  @prop {function} onVisible
   *  @prop {function} endVisible
   *  @prop {function} onInit
   *  @prop {object} parallax {
   *   @prop {float} rate
   *   @prop {number} x
   *   @prop {number} y
   *   @prop {number} z
   *  }
   *  @prop {object} breakpoints {
   *   @prop {number} min
   *   @prop {number} max
   *  }
   * }
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
      sticky = false,
      stickyOffset = 0,
      stickyDelay = 0,
      onVisible = () => {},
      endVisible = () => {},
      onInit = () => {},
      parallax = {
        rate: 0.2,
        x: 0,
        y: 0,
        z: 0
      },
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
    this.sticky = sticky
    this.stickyOffset = stickyOffset
    this.stickyDelay = stickyDelay
    this.onVisible = onVisible
    this.endVisible = endVisible
    this.onInit = onInit
    this.parallax = parallax
    this.breakpoints = breakpoints

    /**
     * Check if already initialized
     *
     * @type {boolean}
     * @private
     */

    this._initDone = false

    /**
     * Check if requestanimationframe supported
     *
     * @type {boolean}
     * @private
     */

    this._requestAnimationSupported = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')

    /**
     * Check if scrolling up or down
     *
     * @type {boolean}
     * @private
     */

    this._scrollDown = true

    /**
     * Store visible state
     *
     * @type {boolean}
     * @private
     */

    this._isVisible = false

    /**
     * Store window scroll y position - visible check, item position and parallax
     *
     * @type {number}
     * @private
     */

    this._scrollY = 0

    /**
     * Store last window scroll y position to check if scrolling up or down
     *
     * @type {number}
     * @private
     */

    this._lastScrollY = 0

    /**
     * Store timeout id in resize event
     *
     * @type {number}
     * @private
     */

    this._resizeTimer = -1

    /**
     * Store viewport width for resize event
     *
     * @type {number}
     * @private
     */

    this._viewportWidth = window.innerWidth

    /**
     * Store viewport height - visible check and parallax
     *
     * @type {number}
     * @private
     */

    this._viewportHeight = window.innerHeight

    /**
     * Store offset and dimension info for item
     *
     * @type {object}
     * @prop {number} top
     * @prop {number} bottom
     * @prop {number} height
     * @private
     */

    this._rect = {
      top: 0,
      bottom: 0,
      height: 0
    }

    /**
     * If sticky store height of item
     *
     * @type {number}
     * @private
     */

    this._stickyItemHeight = 0

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
      if (this._withinBreakpoints()) {
        this._setItemRect()
      }
    }

    /* Make sure item doesn't have transition */

    if (this.parallax) {
      prefix('transition', this.item, 'none')
    }

    /* Event listeners and */

    if (!this.wait) {
      this._eventListeners()
      this._scrollHandler()
    } else {
      subscribe(this.wait, () => {
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
    const visibleItem = this.visibleItem ? this.visibleItem : this.item
    const rect = visibleItem.getBoundingClientRect()

    this._scrollY = window.scrollY

    const top = rect.top + this._scrollY
    const bottom = rect.bottom + this._scrollY

    this._rect = {
      top,
      ogTop: top,
      bottom,
      ogBottom: bottom,
      height: rect.height
    }

    if (this.sticky) {
      this._stickyItemHeight = this.item.clientHeight
    }
  }

  /**
   * Add visible offset to item offsets on scroll
   *
   * @private
   * @return {void}
   */

  _setOffset () {
    let percent = 0
    const offset = this.visibleOffset

    if (this.visibleOffsetPercentage) {
      percent = (this.visibleOffsetPercentage / 100) * this._rect.height
    }

    if (this._scrollDown) {
      this._rect.top = this._rect.ogTop + percent + offset
      this._rect.bottom = this._rect.ogBottom + percent + offset
    } else {
      this._rect.top = this._rect.ogTop - percent - offset
      this._rect.bottom = this._rect.ogBottom - percent - offset
    }
  }

  /**
   * Set visible attributes and parallax transform
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

    if (this.parallax && this._requestAnimationSupported) {
      window.requestAnimationFrame(this._parallax.bind(this))
    }
  }

  /**
   * Unset visible and sticky attributes and parallax transform
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

    if (this.sticky) {
      this.item.removeAttribute('data-sticky')
      this.item.removeAttribute('data-sticky-pos')
    }

    if (this.parallax) {
      prefix('transform', this.item, '')
    }
  }

  /**
   * Set parallax transform on item
   *
   * @private
   * @return {void}
   */

  _parallax () {
    const scrollAmount = this._scrollY - (this._rect.top > this._viewportHeight ? this._rect.top : 0)
    const percentageMoved = ((scrollAmount / this._viewportHeight) * this._rect.height)
    const transformY = Math.round(percentageMoved * (this._viewportHeight / this._rect.height) * this.parallax.rate)

    this.parallax.y = transformY

    prefix('transform', this.item, `translate3d(${this.parallax.x}, ${transformY}px, ${this.parallax.z})`)
  }

  /**
   * Check if visible based on item offsets, viewport height and scroll position
   *
   * @private
   * @return {boolean}
   */

  _visible () {
    return ((this._scrollY + this._viewportHeight >= this._rect.top) && this._scrollY <= this._rect.bottom)
  }

  /**
   * Check if sticky element is visible - account for sticky offset and height
   *
   * @private
   * @return {boolean}
   */

  _stickyVisible () {
    return (
      (this._scrollY >= this._rect.top - this.stickyOffset) && (this._scrollY <= this._rect.bottom - (this._stickyItemHeight + this.stickyOffset))
    )
  }

  /**
   * Scroll handler on window and general method to check if visible and/or sticky and set/unset attributes
   *
   * @private
   * @return {void}
   */

  _scrollHandler () {
    this._scrollY = window.scrollY
    this._scrollDown = this._lastScrollY - this._scrollY <= 0

    this._setOffset()

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

      if (this.sticky) {
        if (this._stickyVisible()) {
          this.item.setAttribute('data-sticky-pos', false)
          this.item.setAttribute('data-sticky', true)
        } else {
          let stickyDelay = 0

          /* Reached bottom limit */

          if (this._scrollY > this._rect.bottom - (this._stickyItemHeight + this.stickyOffset)) {
            this.item.setAttribute('data-sticky-pos', 'bottom')
            stickyDelay = this.stickyDelay
          }

          setTimeout(() => {
            this.item.setAttribute('data-sticky', false)
          }, stickyDelay)

          /* Reached the top limit */

          if (this._scrollY < this._rect.top - this.stickyOffset) {
            this.item.setAttribute('data-sticky-pos', 'top')
          }
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
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        /* On touch devices account for variable viewport height on scroll */

        if (!this.sticky) {
          return
        }
      }

      if (this._withinBreakpoints()) {
        this._viewportHeight = window.innerHeight
        this._setItemRect()

        /* On touch devices account for variable viewport height on scroll */

        if (this.sticky || this.parallax !== false) {
          this._scrollHandler()
        }
      } else {
        this._unset()
      }
    }, 100)
  }
}

/* Exports */

export default Visible
