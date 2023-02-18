/**
 * Utils - set loaders
 */

/**
 * Function - toggle display of loaders/disable buttons
 *
 * @param {array<HTMLElement>} loaders
 * @param {array<HTMLElement>} buttons
 * @param {boolean} show
 * @return {void}
 */

const setLoaders = (loaders = [], buttons = [], show = true) => {
  if (loaders.length) {
    loaders.forEach(l => {
      if (show) {
        l.removeAttribute('data-hide')
      } else {
        l.setAttribute('data-hide', '')
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
