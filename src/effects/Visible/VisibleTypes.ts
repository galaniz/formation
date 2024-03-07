/**
 * Objects - Visible Types
 */

/**
 * @typedef {object} VisibleHashArgs
 * @prop {Element|null} link
 * @prop {Element|Element[]|null|null[]} item
 * @prop {number} [offset]
 */
export interface VisibleHashArgs {
  link: Element | null
  item: Element | Element[] | null | null[]
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
