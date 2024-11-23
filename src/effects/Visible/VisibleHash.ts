/**
 * Effects - Visible Hash
 */

/* Imports */

import type { VisibleHashArgs, VisibleHashRect } from './VisibleTypes'
import { config } from '../../config/config'
import { isArray } from '../../utils/array/array'
import { isObjectStrict } from '../../utils/object/object'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html'
import { onResize } from '../../utils/resize/resize'
import { onScroll } from '../../utils/scroll/scroll'

/**
 * Set current link from corresponding item visibility
 */
class VisibleHash {
  /**
   * Anchor element with hash link
   *
   * @type {HTMLElement}
   */
  link!: HTMLElement // Init false otherwise

  /**
   * Element(s) corresponding to hash
   *
   * @type {HTMLElement}
   */
  item!: HTMLElement[] // Init false otherwise

  /**
   * Top offset on item (eg. scroll margin)
   *
   * @type {number}
   */
  offset: number = 0

  /**
   * Store initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Store top and bottom offsets
   *
   * @private
   * @type {VisibleHashRect}
   */
  _rect: VisibleHashRect = {
    top: 0,
    bottom: 0
  }

  /**
   * Store visiblility
   *
   * @type {boolean}
   */
  _visible: boolean = false

  /**
   * Set properties and initialize
   *
   * @param {VisibleHashArgs} args
   */
  constructor (args: VisibleHashArgs) {
    this.init = this._initialize(args)
  }

  /**
   * Initialize - check required props and set props
   *
   * @private
   * @param {VisibleHashArgs} args
   * @return {boolean}
   */
  _initialize (args: VisibleHashArgs): boolean {
    /* Args must be object */

    if (!isObjectStrict(args)) {
      return false
    }

    /* Defaults */

    const {
      link = null,
      item = [],
      offset = 0
    } = args

    /* Check that required items exist */

    if (!isHtmlElement(link)) {
      return false
    }

    const itemArr = isArray(item) ? item : [item]

    if (!isHtmlElementArray(itemArr)) {
      return false
    }

    /* Set variables */

    this.link = link
    this.item = itemArr
    this.offset = offset * config.fontSizeMultiplier

    /* Set offsets, visibility and attributes */

    this._setItemRect()
    this._set()

    onResize(() => {
      this._setItemRect()
      this._set()
    })

    onScroll(() => {
      this._set()
    })

    /* Init successful */

    return true
  }

  /**
   * Get and set top and bottom offsets
   *
   * @private
   * @return {void}
   */
  _setItemRect (): void {
    const itemOne = this.item[0]

    if (itemOne === undefined) {
      return
    }

    const r = itemOne.getBoundingClientRect()
    const y = window.scrollY

    const top = r.top + y
    let bottom = r.bottom + y

    if (this.item[1] !== undefined) {
      bottom = this.item[1].getBoundingClientRect().top + y
    }

    this._rect = {
      top,
      bottom
    }
  }

  /**
   * Check if top/bottom of item reached/exited top of viewport
   *
   * @private
   * @return {void}
   */
  _setVisibility (): void {
    const y = window.scrollY

    this._visible = ((y >= this._rect.top - this.offset) && y <= this._rect.bottom - this.offset)
  }

  /**
   * Set visibility and current attribute
   *
   * @private
   * @return {void}
   */
  _set (): void {
    this._setVisibility()

    if (this._visible) {
      this.link.setAttribute('aria-current', 'true')
    } else {
      this.link.removeAttribute('aria-current')
    }
  }
}

/* Exports */

export { VisibleHash }
