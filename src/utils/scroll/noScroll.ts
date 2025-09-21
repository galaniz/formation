/**
 * Utils - No Scroll
 */

/**
 * Prevent body scroll.
 *
 * @param {boolean} [on=true]
 * @return {boolean}
 */
const noScroll = (on: boolean = true): boolean => {
  const html = document.documentElement

  if (on) {
    html.dataset.noScroll = ''

    return true
  }

  delete html.dataset.noScroll

  return false
}

/* Exports */

export { noScroll }
