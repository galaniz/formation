/**
 * Config - Types
 */

/**
 * @typedef {object} Config
 * @prop {boolean} inert
 * @prop {boolean} reduceMotion
 * @prop {boolean} intersectionObserver
 * @prop {number} defaultFontSize
 * @prop {number} fontSizeMultiplier
 */
export interface Config {
  inert: boolean
  reduceMotion: boolean
  intersectionObserver: boolean
  defaultFontSize: number
  fontSizeMultiplier: number
}
