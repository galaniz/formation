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
 * @prop {number} resizeDelay
 * @prop {number} scrollDelay
 */
export interface Config {
  inert: boolean
  reduceMotion: boolean
  intersectionObserver: boolean
  wellFormed: boolean
  flexGap: boolean
  defaultFontSize: number
  fontSizeMultiplier: number
  resizeDelay: number
  scrollDelay: number
}

/**
 * @typedef {object} ConfigFallback
 * @prop {function} [toggleFocusability]
 * @prop {function} [getOuterFocusableItems]
 */
export interface ConfigFallback {
  toggleFocusability?: Function
  getOuterFocusableItems?: Function
}
