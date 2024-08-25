/**
 * Config
 */

/* Imports */

import type { Config, ConfigFallback } from './configTypes'
import { configDefaultFontSize } from './configDefaultFontSize'

/**
 * Store attributes and feature support
 *
 * @type {import('./configTypes').Config}
 */
const config: Config = {
  inert: false,
  reduceMotion: false,
  intersectionObserver: false,
  wellFormed: false,
  flexGap: false,
  defaultFontSize: 16,
  fontSizeMultiplier: 1,
  resizeDelay: 100,
  scrollDelay: 10
}

/**
 * Store feature fallback functions
 *
 * @type {import('./configTypes').ConfigFallback}
 */
const configFallback: ConfigFallback = {}

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

  const testStr = new String() // eslint-disable-line

  if ('toWellFormed' in testStr) {
    config.wellFormed = true
  }

  /* Default font size */

  configDefaultFontSize()
}

/* Exports */

export {
  config,
  configFallback,
  setConfig
}
