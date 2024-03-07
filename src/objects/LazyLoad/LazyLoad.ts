// @ts-nocheck

/**
 * Objects - Lazy Load
 *
 * @param {HTMLElement[]} items
 */

/* Imports */

import { assetLoaded } from '../../../utils'

/* Class */

class LazyLoad {
  /**
   * Constructor
   */

  constructor (items = []) {
    /* Public variables */

    this.items = items

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.items.length) return false

    /* Check if IntersectionObserver is supported */

    let ioSupported = false

    if (
      'IntersectionObserver' in window &&
      'IntersectionObserverEntry' in window &&
      'intersectionRatio' in window.IntersectionObserverEntry.prototype
    ) {
      ioSupported = true
    }

    this.items.forEach(item => {
      if (ioSupported) {
        this._show(item)
      } else {
        this._setSrc(item)
      }
    })
  }

  /**
   * Set src and show asset
   */

  /* Source: https://web.dev/lazy-loading-images/ */

  _show (item) {
    const observer = new window.IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this._setSrc(item)
          observer.unobserve(item)
        }
      })
    })

    observer.observe(item)
  }

  _setSrc (item) {
    const url = item.getAttribute('data-src')

    if (!url) {
      return
    }

    item.src = url

    if (item.hasAttribute('data-srcset')) {
      item.srcset = item.getAttribute('data-srcset')
    }

    if (item.hasAttribute('data-sizes')) {
      item.sizes = item.getAttribute('data-sizes')
    }

    assetLoaded(item)
      .then(() => {
        item.setAttribute('data-loaded', 'true')
      })
      .catch(() => {
        item.setAttribute('data-loaded', 'error')
      })
  }
}

/* Exports */

export { LazyLoad }
