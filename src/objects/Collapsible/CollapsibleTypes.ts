/**
 * Objects - Collapsible Types
 */

/**
 * @typedef {'single'|'accordion'} CollapsibleType
 */
export type CollapsibleType = 'single' | 'accordion'

/**
 * @typedef {object} CollapsibleActionArgs
 * @prop {boolean} [hoverable]
 * @prop {boolean} [expanded]
 * @prop {CollapsibleType} [type]
 */
export interface CollapsibleActionArgs {
  hoverable?: boolean
  expanded?: boolean
  type?: CollapsibleType
}

/**
 * @typedef {object} CollapsibleAccordionArgs
 * @prop {HTMLElement} element
 */
export interface CollapsibleAccordionArgs {
  element: HTMLElement
}
