/**
 * Objects: collapsible
 *
 * @param {object} args {
 *  @param {HTMLElement} container
 *  @param {HTMLElement} collapsible
 *  @param {HTMLElement} trigger
 *  @param {string} accordionId
 *  @param {boolean} startOpen
 *  @param {boolean} resize
 * }
 */

/* Imports */

import {
  subscribe,
  publish
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
      accordionId = '',
      startOpen = false,
      resize = true
    } = args

    this.container = container
    this.collapsible = collapsible
    this.trigger = trigger
    this.accordionId = accordionId
    this.startOpen = startOpen
    this.resize = resize

    /**
     * Internal variables
     */

    /* For resize event */

    this._resizeTimer = null
    this._viewportWidth = window.innerWidth

    /* Collapsible id for accordion */

    this._collapsibleId = ''

    /* Track height */

    this._collapsibleHeight = 0

    /* Used in set method */

    this._set = true

    /* Keep track of state */

    this._open = false

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

    /* Add prefix to accordion id */

    if (this.accordionId) {
      this.accordionId = `collapsible-${this.accordionId}`
      this._collapsibleId = this.collapsible.id || performance.now().toString(36)

      subscribe(this.accordionId, (args) => {
        const { collapsibleId } = args

        if (collapsibleId !== this._collapsibleId && this._open) {
          this._toggleCollapsible(false)
        }
      })
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

      publish(this.accordionId, {
        collapsibleId: this._collapsibleId
      })
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
