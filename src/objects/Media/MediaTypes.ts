/**
 * Objects - Media Types
 */

/**
 * @typedef {'play'|'pause'|'toggle'} MediaControl
 */
export type MediaControl = 'play' | 'pause' | 'toggle'

/**
 * @typedef {'loader'|'error'} MediaTemplateKeys
 */
export type MediaTemplateKeys = 'loader' | 'error'

/**
 * @typedef {Map<MediaTemplateKeys, HTMLElement>} MediaTemplates
 */
export type MediaTemplates = Map<MediaTemplateKeys, HTMLElement>

/**
 * @typedef {object} MediaProgress
 * @prop {number} [width=0]
 * @prop {number} [offsetX=0]
 * @prop {boolean} [pointerDown=false]
 * @prop {number} [currentX=0]
 * @prop {number} [time=0]
 */
export interface MediaProgress {
  width: number
  offsetX: number
  pointerDown: boolean
  currentX: number
  time: number
}
