/**
 * Config - Types
 */

/**
 * @typedef {object} Config
 * @prop {boolean} inert
 * @prop {boolean} reduceMotion
 * @prop {boolean} intersectionObserver
 * @prop {boolean} wellFormed
 * @prop {boolean} flexGap
 * @prop {number} defaultFontSize
 * @prop {number} fontSizeMultiplier
 */
export interface Config {
  inert: boolean
  reduceMotion: boolean
  intersectionObserver: boolean
  wellFormed: boolean
  flexGap: boolean
  defaultFontSize: number
  fontSizeMultiplier: number
}
