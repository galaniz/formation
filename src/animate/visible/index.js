/**
 * Animate: visible in viewport check
 *
 * @param args [object] {
 *  @param item [HTMLElement]
 *  @param visibleItem [HTMLElement]
 *  @param visibleOffset [int]
 *  @param visibleOffsetPercentage [int]
 *  @param visAll [boolean]
 *  @param allowUnset [boolean]
 *  @param delay [int]
 *  @param wait [string]
 *  @param sticky [boolean]
 *  @param stickyOffset [int]
 *  @param stickyDelay [int]
 *  @param onVisible [function]
 *  @param endVisible [function]
 *  @param onInit [function]
 *  @param parallax [object] {
 *   @param rate [float]
 *   @param x [int]
 *   @param y [int]
 *   @param z [int]
 *  }
 *  @param breakpoints [object] {
 *   @param min [int]
 *   @param max [int]
 *  }
 * }
 */

/* Imports */

import {
  prefix,
  mergeObjects,
  getScrollY,
  subscribe
} from '../../utils'

/* Class */

class Visible {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    this.item = null
    this.visibleItem = null
    this.visibleOffset = 0
    this.visibleOffsetPercentage = 0
    this.visAll = false
    this.allowUnset = false
    this.delay = 0
    this.wait = ''
    this.sticky = false
    this.stickyOffset = 0
    this.stickyDelay = 0
    this.onVisible = () => {}
    this.endVisible = () => {}
    this.onInit = () => {}

    this.parallax = {
      rate: 0.2,
      x: 0,
      y: 0,
      z: 0
    }

    this.breakpoints = {
      min: 0,
      max: 99999
    }

    mergeObjects(this, args)

    /**
     * Internal variables
     */

    /* Check if already initialized */

    this._initDone = false

    /* Check if requestanimationframe supported */

    this._requestAnimationSupported = Object.getOwnPropertyDescriptor(window, 'requestAnimationFrame')

    /* Check if scrolling up or down */

    this._scrollDown = true

    /* Check if visible */

    this._isVisible = false

    /* For scroll event */

    this._scrollY = 0
    this._lastScrollY = 0
    this._parallaxScrollY = null

    /* For throttling resize event */

    this._resizeTimer = null

    /* For resizing only on x axis */

    this._viewportWidth = window.innerWidth

    /* For checking if item visible */

    this._viewportHeight = window.innerHeight

    /* Offset/dimensions info for item */

    this._rect = {
      top: 0,
      bottom: 0,
      height: 0
    }

    /* If sticky get height of item */

    this._stickyItemHeight = 0

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) { return false }
  }

  /**
   * Internal methods
   */

  _initialize () {
    /* Check required item not null */

    if (!this.item) {
      return false
    } else {
      if (this._withinBreakpoints()) { this._setItemRect() }
    }

    /* Make sure item doesn't have transition */

    if (this.parallax) {
      prefix('transition', this.item, 'none')
    }

    if (!this.wait) {
      this._eventListeners()
      this._scrollHandler()
    } else {
      subscribe(this.wait, () => {
        this._eventListeners()
        this._scrollHandler()
      })
    }

    if (!this._initDone) {
      this.onInit()
      this._initDone = true
    }

    return true
  }

  _eventListeners () {
    window.addEventListener('scroll', this._scrollHandler.bind(this))
    window.addEventListener('resize', this._resizeHandler.bind(this))
  }

  _withinBreakpoints () {
    return (this._viewportWidth > this.breakpoints.min && this._viewportWidth < this.breakpoints.max)
  }

  _setItemRect () {
    const visibleItem = this.visibleItem ? this.visibleItem : this.item
    const rect = visibleItem.getBoundingClientRect()

    this._scrollY = getScrollY()

    const top = rect.top + this._scrollY
    const bottom = rect.bottom + this._scrollY

    this._rect = {
      top: top,
      ogTop: top,
      bottom: bottom,
      ogBottom: bottom,
      height: rect.height
    }

    if (this.sticky) { this._stickyItemHeight = this.item.clientHeight }
  }

  _setOffset () {
    let percent = 0
    const offset = this.visibleOffset

    if (this.visibleOffsetPercentage) { percent = (this.visibleOffsetPercentage / 100) * this._rect.height }

    if (this._scrollDown) {
      this._rect.top = this._rect.ogTop + percent + offset
      this._rect.bottom = this._rect.ogBottom + percent + offset
    } else {
      this._rect.top = this._rect.ogTop - percent - offset
      this._rect.bottom = this._rect.ogBottom - percent - offset
    }
  }

  _set () {
    if (!this._isVisible) {
      this.item.setAttribute('data-vis', true)

      if (this.visAll) { this.item.setAttribute('data-vis-all', true) }

      this._isVisible = true

      this.onVisible()
    }

    if (this.parallax && this._requestAnimationSupported) {
      window.requestAnimationFrame(this._parallax.bind(this))
    }
  }

  _unset () {
    if (this._isVisible) {
      this.item.setAttribute('data-vis', false)

      if (this.visAll) { this.item.setAttribute('data-vis-all', false) }

      this._isVisible = false

      this.endVisible()
    }

    if (this.sticky) {
      this.item.removeAttribute('data-sticky')
      this.item.removeAttribute('data-sticky-pos')
    }

    if (this.parallax) { prefix('transform', this.item, '') }
  }

  _parallax () {
    const scrollAmount = this._scrollY - (this._rect.top > this._viewportHeight ? this._rect.top : 0)
    const percentageMoved = ((scrollAmount / this._viewportHeight) * this._rect.height)
    const transformY = Math.round(percentageMoved * (this._viewportHeight / this._rect.height) * this.parallax.rate)

    this.parallax.y = transformY

    prefix('transform', this.item, `translate3d(${this.parallax.x}, ${transformY}px, ${this.parallax.z})`)
  }

  _visible () {
    return ((this._scrollY + this._viewportHeight >= this._rect.top) && this._scrollY <= this._rect.bottom)
  }

  _stickyVisible () {
    return (
      (this._scrollY >= this._rect.top - this.stickyOffset) && (this._scrollY <= this._rect.bottom - (this._stickyItemHeight + this.stickyOffset))
    )
  }

  /**
   * Event handlers
   */

  _scrollHandler () {
    this._scrollY = getScrollY()
    this._scrollDown = this._lastScrollY - this._scrollY <= 0

    this._setOffset()

    if (this._withinBreakpoints()) {
      if (this._visible(this._scrollY)) {
        if (this._parallaxScrollY === null) { this._parallaxScrollY = this._scrollY }

        const delay = this.delay

        setTimeout(() => {
          this._set()
        }, delay)
      } else {
        this._parallaxScrollY = null

        if (this.allowUnset) { this._unset() }
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

  _resizeHandler () {
    /* Throttles resize event */

    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        /* On touch devices changing height of viewport on scroll */

        if (!this.sticky) { return }
      }

      if (this._withinBreakpoints()) {
        this._viewportHeight = window.innerHeight
        this._setItemRect()

        /* On touch devices changing height of viewport on scroll */

        if (this.sticky || this.parallax !== false) { this._scrollHandler() }
      } else {
        this._unset()
      }
    }, 100)
  }
} // End Visible

/* Exports */

export default Visible
