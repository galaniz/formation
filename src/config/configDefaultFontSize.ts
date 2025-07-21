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
  const rootStyle = getComputedStyle(document.documentElement)
  const fontSize = rootStyle.fontSize
  const size = parseFloat(fontSize)

  config.defaultFontSize = size
  config.fontSizeMultiplier = size / 16
}

/* Exports */

export { configDefaultFontSize }
