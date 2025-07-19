/**
 * Utils - Scroll Stop
 */

/**
 * Prevent body scroll.
 *
 * @param {boolean} on
 * @return {boolean}
 */
const stopScroll = (on: boolean = true): boolean => {
  const html = document.documentElement

  if (on) {
    html.dataset.stopScroll = ''

    return true
  }

  delete html.dataset.stopScroll

  return false
}

/* Exports */

export { stopScroll }
