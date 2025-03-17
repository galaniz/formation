/**
 * Objects - Media Types
 */

/* Imports */

import type { DurationLabels } from '../../utils/duration/durationTypes.js'

/**
 * @typedef {object} MediaLabels
 * @extends {DurationLabels}
 * @prop {string} [play=Play]
 * @prop {string} [pause=Pause]
 * @prop {string} [mute=Mute]
 * @prop {string} [unmute=Unmute]
 * @prop {string} [volume=Volume]
 * @prop {string} [of=of]
 */
export interface MediaLabels extends DurationLabels {
  play?: string
  pause?: string
  mute?: string
  unmute?: string
  volume?: string
  of?: string
}

/**
 * @typedef {'loader'|'error'|'source'} MediaTemplateKeys
 */
export type MediaTemplateKeys = 'loader' | 'error' | 'source'

/**
 * @typedef {Map<MediaTemplateKeys, HTMLElement>} MediaTemplates
 */
export type MediaTemplates = Map<MediaTemplateKeys, HTMLElement>
