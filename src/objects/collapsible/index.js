/**
 * Objects: collapsible
 *
 * @param {object} args {
 *  @param {HTMLElement} container
 *  @param {HTMLElement} collapsible
 *  @param {HTMLElement} trigger
 *  @param {boolean} closeOnLastBlur
 *  @param {array} accordianInstances
 *  @param {boolean} startOpen
 *  @param {boolean} resize
 * }
 */

/* Imports */

import {
  subscribe,
  focusSelector
} from '../../utils'

/* Class */

class Collapsible {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      container = null,
      collapsible = null,
      trigger = null,
      closeOnLastBlur = false,
      accordianInstances = [],
      startOpen = false,
      resize = true
    } = args

    this.container = container
    this.collapsible = collapsible
    this.trigger = trigger
    this.closeOnLastBlur = closeOnLastBlur
    this.accordianInstances = accordianInstances
    this.startOpen = startOpen
    this.resize = resize

    /**
     * Internal variables
     */

    /* For resize event */

    this._resizeTimer = null
    this._viewportWidth = window.innerWidth

    /* Track height */

    this._collapsibleHeight = 0

    /* Used in set method */

    this._set = true

    /* Keep track of state */

    this._open = false

    /* For this.closeOnLastBlur */

    this._focusableItems = []
    this._tabbing = false

    subscribe('tabState', t => {
      this._tabbing = t[0]
    })

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

    if (!this.collapsible || !this.trigger) { return false }

    /* Get focusable elements */

    this._focusableItems = Array.from(this.container.querySelectorAll(focusSelector))

    if (this.closeOnLastBlur) {
      this._blurHandler = this._blur.bind(this)
      document.addEventListener('focusout', this._blurHandler)
    }

    /* Event listeners */

    this._triggerHandler = this._trigger.bind(this)
    this._resizeHandler = this._resize.bind(this)

    this.trigger.addEventListener('click', this._triggerHandler)

    window.addEventListener('resize', this._resizeHandler.bind(this))

    window.addEventListener('load', () => {
      this._setCollapsibleHeight()
      this._toggleCollapsible(this.startOpen)
      this._setContainer()
    })

    return true
  }

  /**
   * Internal helpers
   */

  _setContainer () {
    if (!this.container) { return }

    if (this._set) {
      this.container.setAttribute('data-set', '')
    } else {
      this.container.removeAttribute('data-set')
    }
  }

  _setCollapsibleHeight () {
    this.collapsible.style.height = 'auto'

    if (!this._set) { return }

    this._collapsibleHeight = this.collapsible.clientHeight
  }

  _toggleCollapsible (open = true, source = '') {
    if (!this._set) { return }

    this._open = open
    this.trigger.setAttribute('aria-expanded', open)

    if (open) {
      if (this.trigger !== document.activeElement && source === 'tap') {
        this.trigger.focus() // iOS Safari not focusing on buttons
      }

      if (this.accordianInstances.length) {
        this.accordianInstances.forEach(a => {
          if (a._open) { a.toggle(false) }
        })
      }
    }

    if (open) {
      if (this.container) { this.container.setAttribute('data-expanded', 'true') }

      this.collapsible.style.height = this._collapsibleHeight + 'px'
    } else {
      if (this.container) { this.container.setAttribute('data-expanded', 'false') }

      this.collapsible.style.height = ''
    }

    if (this.container) { this.container.setAttribute('data-source', source) }
  }

  /**
   * Event handlers
   */

  _resize () {
    if (!this.resize) { return }

    /* Throttles resize event */

    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      this._setCollapsibleHeight()
      this._toggleCollapsible(this._open)
    }, 100)
  }

  _trigger () {
    const open = !this._open
    this._toggleCollapsible(open, 'tap')
  }

  /* Close if focus outside */

  _blur () {
    setTimeout(() => {
      if (!this._focusableItems.includes(document.activeElement) && this._open) {
        this._toggleCollapsible(false, 'blur')
      }
    }, 0)
  }

  /**
   * Public methods
   */

  set (set = true) {
    this._set = set
    this._setContainer()

    if (set) {
      this._setCollapsibleHeight()
      this._toggleCollapsible(this._open)
    } else {
      this.collapsible.style.height = ''
    }
  }

  toggle (open = true) {
    this._toggleCollapsible(open)
  }
} // End Collapsible

/* Exports */

export default Collapsible
