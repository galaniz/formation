/**
 * Objects: modal
 *
 * @param {object} args {
 *  @param {HTMLElement} modal
 *  @param {HTMLElement} window
 *  @param {HTMLElement} overlay
 *  @param {HTMLElement} trigger
 *  @param {HTMLElement} close
 *  @param {string} overflowHiddenClass
 *  @param {function} onToggle
 * }
 */

/* Imports */

import {
  toggleFocusability,
  focusSelector
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
      overflowHiddenClass = 'l-overflow-hidden',
      onToggle = () => {}
    } = args

    this.modal = modal
    this.window = window
    this.overlay = overlay
    this.trigger = trigger
    this.close = close
    this.overflowHiddenClass = overflowHiddenClass
    this.onToggle = onToggle

    /**
     * Internal variables
     */

    /* For key events */

    this._KEYS = {
      27: 'ESC',
      Escape: 'ESC'
    }

    /* Store focusable elements outside modal */

    this._focusableItems = []

    /* Store first focusable element in modal */

    this._firstFocusableItem = null

    /* Track modal state */

    this._open = false

    /* Store root element */

    this._html = document.documentElement

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

    /* Get focusable elements */

    const modalFocusableItems = Array.from(this.modal.querySelectorAll(focusSelector))

    if (modalFocusableItems.length) {
      this._firstFocusableItem = modalFocusableItems[0]
      this._focusableItems = Array.from(document.querySelectorAll(focusSelector))

      this._focusableItems = this._focusableItems.filter(item => {
        if (modalFocusableItems.indexOf(item) === -1) {
          return true
        }

        return false
      })
    }

    /* Check if open */

    if (this.modal.getAttribute('data-open') === 'true') {
      this._toggle(true)
    }

    return true
  }

  /**
   * Internal helpers
   */

  /* Open or close modal */

  _toggle (open = true) {
    this._open = open

    this.onToggle(open)

    toggleFocusability(!this._open, this._focusableItems)

    this.modal.setAttribute('data-open', open)

    if (open) {
      if (this._firstFocusableItem) {
        this._firstFocusableItem.focus()
      }

      this._html.classList.add(this.overflowHiddenClass)
    } else {
      this.trigger.focus()
      this._html.classList.remove(this.overflowHiddenClass)
    }
  }

  /**
   * Event handlers
   */

  _keyHandler (e) {
    const key = e.keyCode || e.which || e.code || e.key

    if (this._KEYS[key] === 'ESC') {
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
