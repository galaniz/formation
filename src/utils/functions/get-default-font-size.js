/**
 * Utils - get default font size
 */

/**
 * Function - get browser font size in pixels
 *
 * @return {number}
 */

const getDefaultFontSize = () => {
  let size = 16

  const element = document.createElement('div')
  element.style.width = '1rem'

  document.body.appendChild(element)

  const width = element.clientWidth

  if (width) {
    size = width
  }

  element.remove()

  return size
}

/* Exports */

export { getDefaultFontSize }
