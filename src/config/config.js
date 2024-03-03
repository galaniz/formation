/**
 * Config
 */

/* Imports */

import { getDefaultFontSize } from '../utils/getDefaultFontSize/getDefaultFontSize'

/**
 * Store attributes
 *
 * @type {object}
 */

const config = {
  inert: false,
  reduceMotion: false,
  defaultFontSize: 16,
  fontSizeMultiplier: 1,
  intersectionObserver: false,
  flexGap: false,
  vars: {}
}

/**
 * Function - check attribute/feature support
 *
 * Source - https://css-tricks.com/snippets/javascript/test-if-element-supports-attribute/
 *
 * @return {void}
 */

const setConfig = () => {
  /* Body element */

  const body = document.body

  /* Javascript enabled */

  body.classList.remove('no-js')
  body.classList.add('js')

  /* Inert */

  const test = document.createElement('div')

  if ('inert' in test) {
    config.inert = true
  }

  /* Reduce motion */

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  if (!mediaQuery || mediaQuery.matches) {
    config.reduceMotion = true
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
