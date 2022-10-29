/**
 * Utils: prevent body scroll
 *
 * @param {boolean} on
 */

/* Module */

const stopScroll = (on = true) => {
  const html = document.documentElement

  if (on) {
    html.setAttribute('data-no-scroll', '')
  } else {
    html.removeAttribute('data-no-scroll', '')
  }
}

/* Exports */

export { stopScroll }
