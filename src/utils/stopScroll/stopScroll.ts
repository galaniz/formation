/**
 * Utils - Stop Scroll
 */

/**
 * Function - prevent body scroll
 *
 * @param {boolean} on
 * @return {void}
 */
const stopScroll = (on: boolean = true): void => {
  const html = document.documentElement

  if (on) {
    html.setAttribute('data-stop-scroll', '')
  } else {
    html.removeAttribute('data-stop-scroll')
  }
}

/* Exports */

export { stopScroll }
