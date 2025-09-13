/**
 * Objects - Collapsible Types
 */

/* Imports */

import type { Collapsible } from './Collapsible.js'

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
 * @prop {Collapsible} element
 */
export interface CollapsibleAccordionArgs {
  element: Collapsible
}
