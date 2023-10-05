/**
 * Utils - Get Default Font Size
 */

/**
 * Function - get browser font size in pixels
 *
 * @return {number}
 */

const getDefaultFontSize = (): number => {
  let size = 16

  const element = document.createElement('div')

  element.style.width = '1rem'

  document.body.appendChild(element)

  const width = element.clientWidth

  if (width > 0) {
    size = width
  }

  element.remove()

  return size
}

/* Exports */

export { getDefaultFontSize }
