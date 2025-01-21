/**
 * Objects - Collapsible Types
 */

/**
 * @typedef {string} CollapsibleTypes - single | accordion
 */
export type CollapsibleTypes = 'single' | 'accordion'

/**
 * @typedef {object} CollapsibleToggleDetail
 * @prop {boolean} open
 * @prop {CollapsibleTypes} type
 * @prop {string} group
 */
export interface CollapsibleToggleDetail {
  open: boolean
  type: CollapsibleTypes
  group: string
}

/**
 * @typedef {object} CollapsibleActiveArgs
 * @prop {boolean} active
 */
export interface CollapsibleActiveArgs {
  active: boolean
}

/**
 * @typedef {object} CollapsibleAccordionArgs
 * @prop {HTMLElement} element
 */
export interface CollapsibleAccordionArgs {
  element: HTMLElement
}
