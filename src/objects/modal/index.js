/**
 * Objects: modal
 *
 * @param args [object] {
 *  @param modal [HTMLElement]
 *  @param window [HTMLElement]
 *  @param overlay [HTMLElement]
 *  @param trigger [HTMLElement]
 *  @param close [HTMLElement]
 *  @param scaleTransition [boolean]
 *  @param scaleTransitionDelay [int]
 *  @param bodyOverflowHiddenClass [string]
 *  @param onToggle [function]
 * }
 */

/* Imports */

import {
  addClass,
  removeClass,
  prefix
} from '../../utils'

/* Class */

class Modal {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      modal = null,
      window = null,
      overlay = null,
      trigger = null,
      close = null,
      scaleTransition = false,
      scaleTransitionDelay = 300,
      bodyOverflowHiddenClass = 'u-o-h',
      onToggle = () => {}
    } = args

    this.modal = modal
    this.window = window
    this.overlay = overlay
    this.trigger = trigger
    this.close = close
    this.scaleTransition = scaleTransition
    this.scaleTransitionDelay = scaleTransitionDelay
    this.bodyOverflowHiddenClass = bodyOverflowHiddenClass
    this.onToggle = onToggle

    /**
     * Internal variables
     */

    /* For key events */

    this._KEYS = {
      9: 'TAB',
      Tab: 'TAB',
      27: 'ESC',
      Escape: 'ESC'
    }

    /* For giving focus to right elements */

    this._focusableItems = []
    this._firstFocusableItem = null
    this._lastFocusableItem = null

    /* Track modal state */

    this._open = false

    /* To prevent body scroll */

    this._body = document.body

    /* For throttling resize event */

    this._resizeTimer = null

    this._viewportWidth = window.innerWidth
    this._viewportHeight = window.innerHeight

    this._matrix = {
      open: {
        sX: 1,
        sY: 1,
        tX: 0,
        tY: 0
      },
      close: {
        sX: 1,
        sY: 1,
        tX: 0,
        tY: 0
      }
    }

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

    if (!this.modal || !this.window || !this.trigger || !this.close) { return false }

    if (this.scaleTransition && !this.window) { return false }

    if (this.scaleTransition) {
      this._windowWidth = this.window.clientWidth
      this._windowHeight = this.window.clientHeight
    }

    /* Check if open */

    if (this.modal.getAttribute('aria-hidden') === 'false') {
      this._toggle(true)
    }

    /* Add event listeners */

    this.modal.addEventListener('keydown', this._keyHandler.bind(this))
    this.trigger.addEventListener('click', this._openHandler.bind(this))
    this.close.addEventListener('click', this._closeHandler.bind(this))

    if (this.overlay) {
      this.overlay.addEventListener('click', this._closeHandler.bind(this))
    }

    window.addEventListener('resize', this._resizeHandler.bind(this))

    /* Get focusable elements in modal */

    this._focusableItems = Array.from(this.window.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'))
    this._focusableItemsLength = this._focusableItems.length

    this._firstFocusableItem = this._focusableItems[0]
    this._lastFocusableItem = this._focusableItems[this._focusableItemsLength - 1]

    return true
  }

  /**
   * Internal helpers
   */

  _setMatrix () {
    const triggerRect = this.trigger.getBoundingClientRect()

    this._matrix = {
      open: {
        sX: 1,
        sY: 1,
        tX: this._windowWidth < this._viewportWidth ? (this._viewportWidth - this._windowWidth) / 2 : 0,
        tY: this._windowHeight < this._viewportHeight ? (this._viewportHeight - this._windowHeight) / 2 : 0
      },
      close: {
        sX: triggerRect.width / this._windowWidth,
        sY: triggerRect.height / this._windowHeight,
        tX: triggerRect.left,
        tY: triggerRect.top
      }
    }
  }

  _setTransforms () {
    if (this.scaleTransition) {
      const prop = this._open ? 'open' : 'close'
      const sX = this._matrix[prop].sX
      const sY = this._matrix[prop].sY
      const tX = this._matrix[prop].tX
      const tY = this._matrix[prop].tY

      prefix('transform', this.window, `matrix(${sX}, 0, 0, ${sY}, ${tX}, ${tY})`)
    }
  }

  /* Handle classes/transforms to open/close */

  _toggle (open = true) {
    this._open = open
    this.modal.setAttribute('aria-hidden', !open)

    if (open) {
      this._firstFocusableItem.focus()
      addClass(this._body, this.bodyOverflowHiddenClass)
    } else {
      this.trigger.focus()
      removeClass(this._body, this.bodyOverflowHiddenClass)
    }

    if (this.scaleTransition) {
      if (!open) { this.modal.removeAttribute('data-window-open') }

      setTimeout(() => {
        this._setTransforms()
      }, !open ? this.scaleTransitionDelay : 0)

      if (open) {
        setTimeout(() => {
          this.modal.setAttribute('data-window-open', '')
        }, open ? this.scaleTransitionDelay : 0)
      }
    }

    this.onToggle(open)
  }

  _handleBackwardTab (e) {
    if (document.activeElement === this._firstFocusableItem) {
      e.preventDefault()
      this._lastFocusableItem.focus()
    }
  }

  _handleForwardTab (e) {
    if (document.activeElement === this._lastFocusableItem) {
      e.preventDefault()
      this._firstFocusableItem.focus()
    }
  }

  /**
   * Event handlers
   */

  _keyHandler (e) {
    const key = e.keyCode || e.which || e.code || e.key

    switch (this._KEYS[key]) {
      case 'TAB':
        if (this._focusableItemsLength === 1) {
          e.preventDefault()
          break
        }

        /* Keep focus in modal */

        if (e.shiftKey) {
          this._handleBackwardTab(e)
        } else {
          this._handleForwardTab(e)
        }

        break
      case 'ESC':
        this._toggle(false)
        break
    }
  }

  _openHandler (e) {
    this._toggle(true)
  }

  _closeHandler (e) {
    this._toggle(false)
  }

  _resizeHandler () {
    /* Throttles resize event */

    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      if (this.scaleTransition) {
        this._viewportWidth = window.innerWidth
        this._viewportHeight = window.innerHeight

        this._windowWidth = this.window.clientWidth
        this._windowHeight = this.window.clientHeight

        this._setMatrix()
        this._setTransforms()
      }
    }, 100)
  }
} // End Modal

/* Exports */

export default Modal
