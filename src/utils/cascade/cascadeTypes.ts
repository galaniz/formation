/**
 * Utils - Cascade Types
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'

/**
 * @method CascadeAction
 * @param {number} index
 * @param {number} repeatIndex
 * @param {GenericFunction} waitUntil - Hold off recursion until function call.
 * @return {void}
 */
export type CascadeAction = (index: number, repeatIndex: number, waitUntil: GenericFunction) => void

/**
 * @typedef {object} CascadeEvent
 * @prop {Action} action
 * @prop {number} [delay=0] - Value to delay action by in milliseconds.
 * @prop {number} [increment=0] - Value to increase delay by.
 */
export interface CascadeEvent {
  action: CascadeAction
  delay?: number
  increment?: number
}
