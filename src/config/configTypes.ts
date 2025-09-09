/**
 * Config - Types
 */

/* Imports */

import type { Generic } from '../global/globalTypes.js'

/**
 * @typedef {object} Config
 * @prop {boolean} inert
 * @prop {boolean} reduceMotion
 * @prop {boolean} wellFormed
 * @prop {boolean} flexGap
 * @prop {number} defaultFontSize
 * @prop {number} fontSizeMultiplier
 * @prop {number} resizeDelay
 * @prop {number} scrollDelay
 * @prop {ConfigLabels} labels
 */
export interface Config {
  inert: boolean
  reduceMotion: boolean
  wellFormed: boolean
  flexGap: boolean
  defaultFontSize: number
  fontSizeMultiplier: number
  resizeDelay: number
  scrollDelay: number
  labels: ConfigLabels
}

/**
 * @typedef {object} ConfigLabels
 * @prop {string} [hours=hours]
 * @prop {string} [hour=hour]
 * @prop {string} [minutes=minutes]
 * @prop {string} [minute=minute]
 * @prop {string} [seconds=seconds]
 * @prop {string} [second=second]
 * @prop {string} [play=Play]
 * @prop {string} [pause=Pause]
 * @prop {string} [mute=Mute]
 * @prop {string} [unmute=Unmute]
 * @prop {string} [volume=Volume]
 * @prop {string} [fullscreen=Fullscreen]
 * @prop {string} [exitFullscreen=Exit Fullscreen]
 */
export interface ConfigLabels extends Generic {
  hours?: string
  hour?: string
  minutes?: string
  minute?: string
  seconds?: string
  second?: string
  play?: string
  pause?: string
  mute?: string
  unmute?: string
  volume?: string
  fullscreen?: string
  exitFullscreen?: string
}
