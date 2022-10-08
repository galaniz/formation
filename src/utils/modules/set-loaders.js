/**
 * Utils: toggle display of loaders/disable buttons
 *
 * @param {array} loaders
 * @param {array} buttons
 * @param {boolean} show
 */

/* Module */

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
