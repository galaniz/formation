/**
 * Utils - Set Loader
 */

/* Imports */

import { isHTMLElement } from '../isHTMLElement/isHTMLElement'

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
  if (!isHTMLElement(loader)) {
    return
  }

  if (!show) {
    loader.removeAttribute('data-loader-show')

    return false
  }

  loader.setAttribute('data-loader-show', '')

  if (focus) {
    loader.focus()
  }

  return true
}

/* Exports */

export { setLoader }
