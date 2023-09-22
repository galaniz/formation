/**
 * Config
 */

/* Imports */

import { getDefaultFontSize } from '../utils/functions/get-default-font-size'

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
  flexGap: false
}

/**
 * Function - check attribute/feature support
 *
 * Source - https://css-tricks.com/snippets/javascript/test-if-element-supports-attribute/
 *
 * @return {void}
 */

export const setConfig = () => {
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

  /* Body element */

  const body = document.body

  /* Javascript enabled */

  body.classList.remove('no-js')
  body.classList.add('js')

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

  /* Flexbox gap - source: https://ishadeed.com/article/flexbox-gap/ */

  const flex = document.createElement('div')

  flex.style.display = 'flex'
  flex.style.flexDirection = 'column'
  flex.style.rowGap = '1px'

  flex.appendChild(document.createElement('div'))
  flex.appendChild(document.createElement('div'))

  body.appendChild(flex)

  if (flex.scrollHeight === 1) {
    config.flexGap = true
  } else {
    body.classList.add('no-flex-gap')
  }

  flex.parentNode.removeChild(flex)
}

/* Exports */

export default config
