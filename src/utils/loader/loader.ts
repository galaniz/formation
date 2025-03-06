/**
 * Utils - Loader
 */

/* Imports */

import { isHtmlElement } from '../html/html.js'

/**
 * Toggle display and focus of loader
 *
 * @param {Element|null} loader
 * @param {boolean} show
 * @param {boolean} focus
 * @return {boolean}
 */
const setLoader = (
  loader: Element | null,
  show = true,
  focus = true
): boolean => {
  if (!isHtmlElement(loader)) {
    return false
  }

  if (!show) {
    delete loader.dataset.loaderShow

    return false
  }

  loader.dataset.loaderShow = ''

  if (focus) {
    loader.focus()
  }

  return true
}

/* Exports */

export { setLoader }
