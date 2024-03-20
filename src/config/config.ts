/**
 * Config
 */

/* Imports */

import type { Config } from './configTypes'
import { getDefaultFontSize } from '../utils/utils'

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
  defaultFontSize: 16,
  fontSizeMultiplier: 1
}

/**
 * Function - check attribute/feature support
 *
 * Source - https://css-tricks.com/snippets/javascript/test-if-element-supports-attribute/
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

  const defaultFontSize = getDefaultFontSize()

  config.defaultFontSize = defaultFontSize
  config.fontSizeMultiplier = defaultFontSize / 16

  /* Intersection observer */

  if ('IntersectionObserver' in window &&
     'IntersectionObserverEntry' in window &&
     'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    config.intersectionObserver = true
  }

  if (config.intersectionObserver) {
    body.classList.remove('no-io')
    body.classList.add('io')
  }
}

/* Exports */

export { config, setConfig }
