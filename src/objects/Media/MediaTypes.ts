/**
 * Objects - Media Types
 */

/**
 * @typedef {'loader'|'error'|'source'} MediaTemplateKeys
 */
export type MediaTemplateKeys = 'loader' | 'error' | 'source'

/**
 * @typedef {Map<MediaTemplateKeys, HTMLElement>} MediaTemplates
 */
export type MediaTemplates = Map<MediaTemplateKeys, HTMLElement>
