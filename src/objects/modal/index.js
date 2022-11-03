/**
 * Objects: modal
 *
 * @param {object} args {
 *  @param {HTMLElement} modal
 *  @param {HTMLElement} window
 *  @param {HTMLElement} overlay
 *  @param {HTMLElement} trigger
 *  @param {HTMLElement} close
 *  @param {function} onToggle
 * }
 */

/* Imports */

import {
  toggleFocusability,
  focusSelector,
  innerFocusableItems,
  getOuterFocusableItems,
  getKey,
  stopScroll
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
      onToggle = () => {}
    } = args

    this.modal = modal
    this.window = window
    this.overlay = overlay
    this.trigger = trigger
    this.close = close
    this.onToggle = onToggle

    /**
     * Internal variables
     */

    /* Store first focusable element in modal */

    this._firstFocusableItem = null

    /* Track modal state */

    this._open = false

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

    /* Add event listeners */

    this.trigger.addEventListener('click', this._openHandler.bind(this))
    this.close.addEventListener('click', this._closeHandler.bind(this))

    if (this.overlay) {
      this.overlay.addEventListener('click', this._closeHandler.bind(this))
    }

    document.body.addEventListener('keydown', this._keyHandler.bind(this))

    /* Store focusable elements */

    const focusableItems = Array.from(this.modal.querySelectorAll(focusSelector))

    if (focusableItems.length) {
      this._firstFocusableItem = focusableItems[0]
    }

    innerFocusableItems[this.modal.id] = focusableItems

    toggleFocusability(false, focusableItems)

    return true
  }

  /**
   * Internal helpers
   */

  /* Open or close modal */

  _toggle (open = true) {
    this._open = open

    this.onToggle(open)

    toggleFocusability(this._open, innerFocusableItems[this.modal.id])
    toggleFocusability(!this._open, getOuterFocusableItems())

    this.modal.setAttribute('data-open', open)

    if (open) {
      if (this._firstFocusableItem) {
        setTimeout(() => {
          this._firstFocusableItem.focus()
        }, 100)
      }

      stopScroll(true)
    } else {
      this.trigger.focus()

      stopScroll(false)
    }
  }

  /**
   * Event handlers
   */

  _keyHandler (e) {
    if (getKey(e) === 'ESC' && this._open) {
      this._toggle(false)
    }
  }

  _openHandler (e) {
    this._toggle(true)
  }

  _closeHandler (e) {
    this._toggle(false)
  }
} // End Modal

/* Exports */

export default Modal
