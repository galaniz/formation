/**
 * Utils - Stop Scroll
 */

/**
 * Prevent body scroll
 *
 * @param {boolean} on
 * @return {boolean}
 */
const stopScroll = (on: boolean = true): boolean => {
  const html = document.documentElement

  if (on) {
    html.setAttribute('data-stop-scroll', '')

    return true
  }

  html.removeAttribute('data-stop-scroll')

  return false
}

/* Exports */

export { stopScroll }
