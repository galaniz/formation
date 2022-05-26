/**
 * Objects: remove elements (if cookie or other condition + trigger click)
 *
 * @param args [object] {
 *  @param item [HTMLElement]
 *  @param trigger [HTMLElement]
 *  @param condition [function]
 *  @param cookie [object] {
 *   @param name [string]
 *   @param value [string]
 *   @param expirationDays [string]
 *  }
 * }
 */

/* Imports */

import {
  setCookie,
  getCookie
} from '../../utils'

/* Class */

class Remove {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      item = null,
      trigger = null,
      condition = () => {},
      cookie = {
        name: '',
        value: '',
        expirationDays: ''
      }
    } = args

    this.item = item
    this.trigger = trigger
    this.condition = condition
    this.cookie = cookie

    /**
     * Internal variables
     */

    this._hide = false

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

    if (!this.item || !this.trigger) { return false }

    if (this.cookie.name) { this._cookieCondition = true }

    /* Add event listeners */

    this.trigger.addEventListener('click', this._clickHandler.bind(this))

    /* Set display */

    this._setDisplay(true)

    window.addEventListener('load', () => {
      this._remove()
    })

    return true
  }

  /**
   * Helpers
   */

  _setDisplay (init = false, hide = false) {
    if (init) {
      if (this.cookie.name) {
        this._hide = !!getCookie(this.cookie.name)
      } else {
        this._hide = this.condition(true) // init true
      }
    } else {
      this._hide = hide
    }
  }

  _remove () {
    if (this._hide) {
      this.item.parentNode.removeChild(this.item)
    }
  }

  /**
   * Event handlers
   */

  _clickHandler (e) {
    let hide = false

    if (this.cookie.name) {
      setCookie(
        this.cookie.name,
        this.cookie.value,
        this.cookie.expirationDays
      )

      hide = true
    } else {
      hide = this.condition(false) // init false
    }

    this._setDisplay(false, hide)
    this._remove()
  }

  /**
   * Public methods
   */

  getHide () {
    return this._hide
  }
} // End Remove

/* Exports */

export default Remove
