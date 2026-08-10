/**
 * Objects - Slider Types
 */

/**
 * @typedef {object} SliderAnimRef
 * @prop {number} id
 */
export interface SliderAnimRef {
  id: number
}

/**
 * @typedef {object} SliderScrollToArgs
 * @prop {number} to
 * @prop {string} source
 * @prop {SliderAnimRef} animRef
 * @prop {HTMLElement|null} track
 * @prop {HTMLElement} slider
 * @prop {number} duration
 * @prop {number} currentIndex
 * @prop {number} panelIndex
 */
export interface SliderScrollToArgs {
  to: number
  source: string
  animRef: SliderAnimRef
  track: HTMLElement | null
  slider: HTMLElement
  duration: number
  currentIndex: number
  panelIndex: number
}

/**
 * @typedef {object} SliderScrolledEventDetail
 * @prop {number} currentIndex
 * @prop {number} panelIndex
 * @prop {string} source
 */
export interface SliderScrolledEventDetail {
  currentIndex: number
  panelIndex: number
  source: string
}
