/**
 * Objects - float labels above inputs
 *
 * @param {object} args {
 *  @param {HTMLElement} input
 *  @param {HTMLElement} label
 * }
 */

/* Class */

class FloatLabel {
  /**
   * Constructor
   */

  constructor (args) {
    /* Public variables */

    const {
      input = null,
      label = null
    } = args

    this.input = input
    this.label = label

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.input || !this.label) {
      return false
    }

    /* Add event listeners */

    this.input.addEventListener('focus', this._inputHandler.bind(this))
    this.input.addEventListener('blur', this._inputHandler.bind(this))

    /* Init */

    this._inputHandler()

    return true
  }

  /**
   * Event handlers
   */

  _inputHandler (e) {
    const type = e !== undefined ? e.type : false
    let float = false

    if (type === 'focus') {
      float = true
    } else {
      const value = this.input.value.trim()

      if (value) {
        float = true
      } else {
        float = false
      }
    }

    if (float) {
      this.label.setAttribute('data-float', '')
    } else {
      this.label.removeAttribute('data-float')
    }
  }
}

/* Exports */

export default FloatLabel
