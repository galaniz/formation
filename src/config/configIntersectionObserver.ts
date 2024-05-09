/**
 * Config - Intersection Observer
 */

/* Imports */

import { config } from './config'

/**
 * Function - check browser intersection observer support
 *
 * @return {void}
 */
const configIntersectionObserver = (): void => {
  if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    config.intersectionObserver = true
  }

  if (config.intersectionObserver) {
    document.body.classList.remove('no-io')
    document.body.classList.add('io')
  }
}

/* Exports */

export { configIntersectionObserver }
