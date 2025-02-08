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
 * @typedef {function} ConfigFallbackToggleFocusability
 * @param {boolean} on
 * @param {Element[]} items
 * @return {boolean|undefined}
 */
export type ConfigFallbackToggleFocusability = (on: boolean, items: Element[]) => boolean | undefined

/**
 * @typedef {function} ConfigFallbackGetOuterFocusableItems
 * @param {Element|null} item
 * @return {Element[]}
 */
export type ConfigFallbackGetOuterFocusableItems = (item: Element | null) => Element[]

/**
 * @typedef {object} ConfigFallback
 * @prop {ConfigFallbackToggleFocusability} [toggleFocusability]
 * @prop {ConfigFallbackGetOuterFocusableItems} [getOuterFocusableItems]
 */
export interface ConfigFallback {
  toggleFocusability?: ConfigFallbackToggleFocusability
  getOuterFocusableItems?: ConfigFallbackGetOuterFocusableItems
}
