/**
 * Config - Default Font Size
 */

/* Imports */

import { config } from './config.js'

/**
 * Browser font size in pixels.
 *
 * @return {void}
 */
const configDefaultFontSize = (): void => {
  const element = document.createElement('div')

  element.style.width = '1rem'
  element.style.position = 'absolute'

  document.body.append(element)

  const width = element.clientWidth
  const size = width > 0 ? width : 16

  element.remove()

  config.defaultFontSize = size
  config.fontSizeMultiplier = size / 16
}

/* Exports */

export { configDefaultFontSize }
