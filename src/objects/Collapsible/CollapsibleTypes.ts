/**
 * Objects - Collapsible Types
 */

/* Imports */

import type { Collapsible } from './Collapsible.js'

/**
 * @typedef {object} CollapsibleActionArgs
 * @prop {boolean} [hoverable]
 * @prop {boolean} [expanded]
 */
export interface CollapsibleActionArgs {
  hoverable?: boolean
  expanded?: boolean
}

/**
 * @typedef {object} CollapsibleAccordionArgs
 * @prop {Collapsible} element
 */
export interface CollapsibleAccordionArgs {
  element: Collapsible
}
