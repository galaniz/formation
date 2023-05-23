/**
 * Utils - set settings
 */

/**
 * Store settings attributes
 *
 * @type {object}
 */

const settings = {
  inert: false,
  reduceMotion: false,
  intersectionObserver: false
}

/**
 * Function - check attribute/feature support
 *
 * Source - https://css-tricks.com/snippets/javascript/test-if-element-supports-attribute/
 *
 * @return {void}
 */

const setSettings = () => {
  /* Inert */

  const test = document.createElement('div')

  if ('inert' in test) {
    settings.inert = true
  }

  /* Reduce motion */

  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  if (!mediaQuery || mediaQuery.matches) {
    settings.reduceMotion = true
  }

  /* Body element */

  const body = document.body

  /* Intersection observer */

  if ('IntersectionObserver' in window &&
     'IntersectionObserverEntry' in window &&
     'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    settings.intersectionObserver = true
  }

  if (settings.intersectionObserver) {
    body.classList.remove('no-io')
    body.classList.add('io')
  }

  /* Javascript enabled */

  body.classList.remove('no-js')
  body.classList.add('js')
}

/* Export */

export { settings, setSettings }
