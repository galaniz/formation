// @ts-nocheck

/**
 * Objects - Conditional
 *
 * @param {HTMLElement} item
 */

/* Show/enable fields */

class Conditional {
  /**
   * Constructor
   */

  constructor (item = null) {
    /* Public variables */

    this.item = item

    /**
     * Internal variables
     */

    /* Store item type */

    this._itemType = 'text'

    /* Store item input if not item itself */

    this._itemInput = null

    /* Store display conditionals and input types */

    this._displayConditionals = []
    this._displayTypes = {}

    /* Store enable conditionals and input types */

    this._enableConditionals = []
    this._enableTypes = {}

    /* Store radio conditionals */

    this._radioConditionals = {}

    /* Initialize */

    const init = this._initialize()

    return init
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.item) {
      return false
    }

    /* Item type */

    this._itemType = this._getType(this.item)

    /* Item input */

    this._itemInput = this.item

    if (this._itemType === 'div') {
      const itemInput = this.item.querySelector('input, select')

      if (itemInput) {
        this._itemInput = itemInput
        this._itemType = this._getType(itemInput)
      }
    }

    /* Type of conditional */

    const display = this.item.getAttribute('data-display')
    const enable = this.item.getAttribute('data-enable')

    if (display) {
      const displayIds = display.split(',')

      this._setConditionals(displayIds, 'display')
    }

    if (enable) {
      const enableIds = enable.split(',')

      this._setConditionals(enableIds, 'enable')
    }

    return true
  }

  /**
   * Set conditionals and types
   */

  _setConditionals (ids = [], type = 'display') {
    if (!ids.length) {
      return
    }

    const conditionalsArray = type === 'display' ? this._displayConditionals : this._enableConditionals
    const conditionalsType = type === 'display' ? this._displayTypes : this._enableTypes
    const changeHandler = type === 'display' ? this._changeDisplayHandler.bind(this) : this._changeEnableHandler.bind(this)

    ids.forEach((id) => {
      const conditional = document.getElementById(id)

      if (conditional) {
        /* Add on change to each input */

        conditional.addEventListener('change', changeHandler)

        /* Input type */

        const cType = this._getType(conditional)

        if (cType === 'radio') {
          const r = Array.from(conditional.form.querySelectorAll(`[name="${conditional.name}"]`))

          this._radioConditionals[r.id] = id

          r.forEach((rr) => {
            rr.addEventListener('change', changeHandler)
          })
        }

        /* Store elements and types */

        conditionalsArray.push(conditional)
        conditionalsType[id] = cType
      }
    })
  }

  /**
   * Get type of element
   */

  _getType (item) {
    let type = item.tagName.toLowerCase()

    if (type === 'input') {
      type = item.type
    }

    return type
  }

  /**
   * Get value of item
   */

  _getValue (item, type) {
    let value = ''

    switch (type) {
      case 'checkbox':
      case 'radio':
        value = item.checked
        break
      case 'select':
        value = item.options[item.selectedIndex].value.trim()
        break
      default:
        value = item.value.trim()
    }

    return value
  }

  /**
   * Clear item if display none or disabled
   */

  _clearItem (clear = true) {
    if (!clear) {
      return
    }

    switch (this._itemType) {
      case 'checkbox':
      case 'radio':
        this._itemInput.checked = false
        break
      default:
        this._itemInput.value = ''
    }
  }

  /**
   * Event handlers
   */

  _changeDisplayHandler (e) {
    let display = true

    this._displayConditionals.forEach((d) => {
      const value = this._getValue(d, this._displayTypes[d.id])

      if (!value) {
        display = false
      }
    })

    this.item.style.setProperty('display', display ? 'block' : 'none')

    this._clearItem(!display)
  }

  _changeEnableHandler (e) {
    let enable = true

    this._enableConditionals.forEach((e) => {
      const value = this._getValue(e, this._enableTypes[e.id])

      if (!value) {
        enable = false
      }
    })

    this.item.disabled = !enable

    this._clearItem(!enable)
  }
}

/* Exports */

export { Conditional }
