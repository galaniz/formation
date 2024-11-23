/**
 * Utils - Loader
 */

/* Imports */

import { isHtmlElement } from '../html/html.js'

/**
 * Toggle display and focus of loader
 *
 * @param {HTMLElement} loader
 * @param {boolean} show
 * @param {boolean} focus
 * @return {boolean|undefined}
 */
const setLoader = (
  loader: HTMLElement,
  show: boolean = true,
  focus: boolean = true
): boolean | undefined => {
  if (!isHtmlElement(loader)) {
    return
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
