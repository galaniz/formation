/**
 * Objects - Lazy
 */

/* Imports */

import type { Asset } from '../../utils/asset/assetTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { getItem } from '../../utils/item/item.js'
import { assetLoaded } from '../../utils/asset/asset.js'

/**
 * Handles loaded state of asset
 */
class Lazy extends HTMLElement {
  /**
   * Load success
   *
   * @type {boolean}
   */
  loaded: boolean = false

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init - each time added to DOM
   */
  async connectedCallback (): Promise<void> {
    if (this.loaded) {
      return
    }

    this.loaded = await this.#load()
  }

  /**
   * Initialize - check required items and listen for load
   *
   * @private
   * @return {boolean}
   */
  async #load (): Promise<boolean> {
    /* Items */

    const asset = getItem('[data-lazy]', this)

    if (!isHtmlElement(asset)) {
      return false
    }

    /* Check if loaded */

    try {
      await assetLoaded(asset as Asset)

      asset.dataset.lazy = 'loaded'
    } catch {
      asset.dataset.lazy = 'error'

      return false
    }

    /* Load successful */

    return true
  }
}

/* Exports */

export { Lazy }
