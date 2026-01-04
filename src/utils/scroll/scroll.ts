/**
 * Utils - Scroll
 */

/**
 * Prevent body scroll.
 *
 * @param {boolean} [on=false]
 * @return {boolean}
 */
const scroll = (on: boolean = false): boolean => {
  const html = document.documentElement

  if (!on) {
    html.dataset.scroll = 'off'

    return true
  }

  delete html.dataset.scroll

  return false
}

/* Exports */

export { scroll }
