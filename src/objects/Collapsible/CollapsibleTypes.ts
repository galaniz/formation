/**
 * Objects - Collapsible Types
 */

/**
 * @typedef {string} CollapsibleTypes - single | accordion
 */
export type CollapsibleTypes = 'single' | 'accordion'

/**
 * @typedef {object} CollapsibleActionArgs
 * @prop {boolean} [hoverable]
 * @prop {boolean} [expanded]
 * @prop {CollapsibleTypes} [type]
 */
export interface CollapsibleActionArgs {
  hoverable?: boolean
  expanded?: boolean
  type?: CollapsibleTypes
}

/**
 * @typedef {object} CollapsibleAccordionArgs
 * @prop {HTMLElement} element
 */
export interface CollapsibleAccordionArgs {
  element: HTMLElement
}
