/**
 * Utils - stop scroll
 */

/**
 * Function - prevent body scroll
 *
 * @param {boolean} on
 * @return {void}
 */

const stopScroll = (on = true) => {
  const html = document.documentElement

  if (on) {
    html.setAttribute('data-stop-scroll', '')
  } else {
    html.removeAttribute('data-stop-scroll')
  }
}

/* Exports */

export { stopScroll }
