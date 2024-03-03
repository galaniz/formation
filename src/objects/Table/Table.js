/**
 * Objects - Table
 *
 * @param {object} args
 * @param {HTMLElement} args.table
 * @param {HTMLElement} args.equalWidthTo
 */

/* Class */

class Table {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      table = null,
      equalWidthTo = null
    } = args

    this.table = table
    this.equalWidthTo = equalWidthTo

    /**
     * Internal variables
     */

    /* For throttling resize event */

    this._resizeTimer = null

    /**
     * Initialize
     */

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

    if (!this.table || !this.equalWidthTo) {
      return false
    }

    window.addEventListener('resize', this._resizeHandler.bind(this))

    this._go()

    return true
  }

  _go () {
    this.table.setAttribute('data-table-overflow', false)
    this.table.style.maxWidth = 'none'

    const targetWidth = this.equalWidthTo.clientWidth
    const currentWidth = this.table.clientWidth
    const overflow = currentWidth > targetWidth

    this.table.style.maxWidth = ''
    this.table.style.setProperty('--target-width', `${targetWidth}px`)
    this.table.style.setProperty('--current-width', `${currentWidth}px`)
    this.table.setAttribute('data-table-overflow', overflow)
  }

  /**
   * Event handlers
   */

  _resizeHandler () {
    /* Throttles resize event */

    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      this._go()
    }, 100)
  }
}

/* Exports */

export { Table }
