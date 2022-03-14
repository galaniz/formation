/**
 * Objects: table collapse dynamically
 *
 * @param args [object] {
 *  @param table [HTMLElement]
 *  @param equalWidthTo [HTMLElement]
 * }
 */

/* Imports */

import { mergeObjects } from '../../utils'

/* Class */

class Table {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    this.table = null
    this.equalWidthTo = null

    /* Merge default variables with args */

    mergeObjects(this, args)

    /**
     * Internal variables
     */

    /* For throttling resize event */

    this._resizeTimer = null

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

    if (!this.table || !this.equalWidthTo) { return false }

    window.addEventListener('resize', this._resizeHandler.bind(this))

    this._go()

    return true
  }

  _go () {
    this.table.setAttribute('data-collapse', false)
    this.table.style.maxWidth = 'none'

    const targetWidth = this.equalWidthTo.clientWidth
    const currentWidth = this.table.clientWidth
    const collapse = currentWidth > targetWidth

    this.table.style.maxWidth = ''
    this.table.setAttribute('data-collapse', collapse)
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
} // End Table

/* Exports */

export default Table
