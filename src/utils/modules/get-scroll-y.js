/**
 * Utils: get scroll y position in cross browser way
 *
 * @return {int} scroll y value
 */

/* Module */

const getScrollY = () => {
  const supportPageOffset = window.pageXOffset !== undefined
  const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')

  return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop
}

/* Exports */

export { getScrollY }
