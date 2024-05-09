/**
 * Config - Default Font Size
 */

/* Imports */

import { config } from './config'

/**
 * Function - browser font size in pixels
 *
 * @return {void}
 */
const configDefaultFontSize = (): void => {
  let size = 16
  let element: HTMLDivElement | null = document.createElement('div')

  element.style.width = '1rem'

  document.body.appendChild(element)

  const width = element.clientWidth

  if (width > 0) {
    size = width
  }

  element.remove()
  element = null

  config.defaultFontSize = size
  config.fontSizeMultiplier = size / 16
}

/* Exports */

export { configDefaultFontSize }
