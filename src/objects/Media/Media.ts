/**
 * Objects - Media
 */

/* Imports */

import type { MediaTemplates } from './MediaTypes.js'

/**
 * Handles
 */
class Media extends HTMLElement {
  /**
   * Media element
   *
   * @type {HTMLMediaElement | null}
   */
  media: HTMLMediaElement | null = null

  /**
   * Type of media
   *
   * @type {'audio'|'video'}
   */
  type: 'audio' | 'video' = 'video'

  /**
   * Url of file to load
   *
   * @type {string}
   */
  url: string = ''

  /**
   * Play state
   *
   * @type {boolean}
   */
  playing: boolean = false

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Loader, error and source fragments
   *
   * @type {MediaTemplates}
   */
  static templates: MediaTemplates = new Map()

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init - each time added to DOM
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up - each time removed from DOM
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Empty/nullify props */

    this.init = false
  }

  /**
   * Initialize - check required items and set properties
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Init successful */

    return true
  }
}

/* Exports */

export { Media }
