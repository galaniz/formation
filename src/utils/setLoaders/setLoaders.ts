// @ts-nocheck

/**
 * Utils - Set Loaders
 */

/**
 * Function - toggle display of loaders/disable buttons
 *
 * @param {HTMLElement[]} loaders
 * @param {HTMLElement[]} buttons
 * @param {boolean} show
 * @return {void}
 */
const setLoaders = (loaders = [], buttons = [], show = true) => {
  if (loaders.length) {
    loaders.forEach(l => {
      if (show) {
        l.setAttribute('data-loader-show', '')
      } else {
        l.removeAttribute('data-loader-show')
      }
    })
  }

  if (buttons.length) {
    buttons.forEach(b => {
      b.disabled = show
      b.setAttribute('aria-disabled', show.toString())
    })
  }
}

/* Exports */

export { setLoaders }
