/**
 * Utils - Cascade Types
 */

/**
 * @method CascadeAction
 * @param {number} index
 * @param {number} repeatIndex
 * @param {function} doRecurse - Hold off recursion until function call
 * @return {void}
 */
export type CascadeAction = (index: number, repeatIndex: number, doRecurse: Function) => void

/**
 * @typedef {object} CascadeEvent
 * @prop {Action} action
 * @prop {number} [delay=0] - Value to delay action by in milliseconds
 * @prop {number} [increment=0] - Value to increase delay by
 */
export interface CascadeEvent {
  action: CascadeAction
  delay?: number
  increment?: number
}
