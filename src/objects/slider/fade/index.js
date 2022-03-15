/**
 * Objects slider: fade
 *
 * @see Slider for base params
 * @param args [object] {
 *  @param transitionDuration [int]
 *  @param overlayItems [boolean]
 *  @param showLast [boolean]
 * }
 */

/* Imports */

import { prefix } from '../../../utils'
import Slider from '../index'

/* Class */

class Fade extends Slider {
  /**
   * Constructor
   */

  constructor (args = {}) {
    /**
     * Base variables & init
     */

    super(args)

    /**
     * Public variables
     */

    const childDefaults = {
      transitionDuration: 500,
      overlayItems: false,
      showLast: false
    }

    for (const prop in childDefaults) {
      this[prop] = Object.getOwnPropertyDescriptor(args, prop) ? args[prop] : childDefaults[prop]
    }

    /**
     * Set up
     */

    /* Overlay items on top of each other */

    if (this.overlayItems) {
      this.items.forEach((item, i) => {
        prefix('transform', item, `translate(-${i * 100}%)`)
      })
    }

    /* Nav set up */

    this._setUpNav()

    this._goTo(this.currentIndex, true)
  }

  /**
   * Helpers
   */

  _doGoTo (index) {
    const ogIndex = this.currentIndex
    const lastIndex = super._doGoTo(index)

    if (this.showLast) { this.items[lastIndex].style.opacity = 1 }

    this.items[ogIndex].removeAttribute('data-active')
    this.items[this.currentIndex].addAttribute('data-active', '')

    /* Fade without flash of background */

    setTimeout(() => {
      if (this.showLast) { this.items[lastIndex].style.opacity = '' }
    }, this.transitionDuration)
  }
} // End Fade

/* Exports */

export default Fade
