/**
 * Config
 */

/* Imports */

import type { Config } from './configTypes.js'
import { configDefaultFontSize } from './configDefaultFontSize.js'

/**
 * Attributes and feature support
 *
 * @type {Config}
 */
const config: Config = {
  inert: false,
  reduceMotion: false,
  wellFormed: false,
  flexGap: false,
  defaultFontSize: 16,
  fontSizeMultiplier: 1,
  resizeDelay: 100,
  scrollDelay: 10,
  labels: {}
}

/**
 * Check attribute/feature support
 *
 * @return {void}
 */
const setConfig = (): void => {
  /* Body element */

  const body = document.body

  /* Javascript enabled */

  body.classList.remove('no-js')
  body.classList.add('js')

  /* Inert */

  let test: HTMLDivElement | null = document.createElement('div')

  if ('inert' in test) {
    config.inert = true
  }

  test.remove()
  test = null

  /* Reduce motion */

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  if (mediaQuery.matches) {
    config.reduceMotion = true
  }

  /* Well formed */

  const testStr = new String()

  if ('toWellFormed' in testStr) {
    config.wellFormed = true
  }

  /* Default font size */

  configDefaultFontSize()
}

/* Exports */

export {
  config,
  setConfig
}
