/**
 * Objects - Collapsible Types
 */

/**
 * @typedef {string|number|boolean} CollapsibleAction
 */
export type CollapsibleAction = string | number | boolean

/**
 * @typedef {object} CollapsibleArgs
 * @prop {Element|null} container
 * @prop {Element|null} collapsible
 * @prop {Element|null} trigger
 * @prop {boolean} [startOpen=false]
 * @prop {number} [duration=300]
 * @prop {CollapsibleAction} [doAccordion=false]
 * @prop {CollapsibleAction} [doHover=false]
 */
export interface CollapsibleArgs {
  container: Element | null
  collapsible: Element | null
  trigger: Element | null
  startOpen?: boolean
  duration?: number
  doAccordion?: string | number | boolean
  doHover?: string | number | boolean
}
