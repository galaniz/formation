/**
 * Objects - Collapsible Types
 */

/**
 * @typedef {string|number|boolean} CollapsibleAction
 */
export type CollapsibleAction = string | number | boolean

/**
 * @typedef {object} CollapsibleArgs
 * @prop {HTMLElement} container
 * @prop {HTMLElement} collapsible
 * @prop {HTMLElement} trigger
 * @prop {boolean} [startOpen=false]
 * @prop {number} [duration=300]
 * @prop {CollapsibleAction} [doAccordion=false]
 * @prop {CollapsibleAction} [doHover=false]
 */
export interface CollapsibleArgs {
  container: HTMLElement
  collapsible: HTMLElement
  trigger: HTMLElement
  startOpen?: boolean
  duration?: number
  doAccordion?: string | number | boolean
  doHover?: string | number | boolean
}
