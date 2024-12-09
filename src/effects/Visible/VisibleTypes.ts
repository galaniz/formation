/**
 * Objects - Visible Types
 */

/**
 * @typedef {object} VisibleHashArgs
 * @prop {Element|null} link
 * @prop {Element|null|Element[]} item
 * @prop {number} [offset]
 */
export interface VisibleHashArgs {
  link: Element | null
  item: Element | null | Element[]
  offset?: number
}

/**
 * @typedef {object} VisibleHashRect
 * @prop {number} top
 * @prop {number} bottom
 */
export interface VisibleHashRect {
  top: number
  bottom: number
}
