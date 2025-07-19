/**
 * Effects - Reveal
 */

/* Imports */

import type { Asset } from '../../utils/asset/assetTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { getItem } from '../../utils/item/item.js'
import { assetLoaded } from '../../utils/asset/asset.js'

/**
 * Handles reveal based on loaded state of asset.
 */
class Reveal extends HTMLElement {
  /**
   * Load success.
   *
   * @type {boolean}
   */
  loaded: boolean = false

  /**
   * Create new instance.
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM.
   */
  async connectedCallback (): Promise<void> {
    if (this.loaded) {
      return
    }

    this.loaded = await this.#load()
  }

  /**
   * Init check required items and listen for load.
   *
   * @private
   * @return {boolean}
   */
  async #load (): Promise<boolean> {
    /* Items */

    const asset = getItem('[data-reveal]', this)

    if (!isHtmlElement(asset)) {
      return false
    }

    /* Check if loaded */

    try {
      await assetLoaded(asset as Asset)

      asset.dataset.reveal = 'loaded'
    } catch {
      asset.dataset.reveal = 'error'

      return false
    }

    /* Load successful */

    return true
  }
}

/* Exports */

export { Reveal }
