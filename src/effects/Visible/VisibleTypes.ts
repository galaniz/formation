/**
 * Effects - Visible Types
 */

/**
 * @typedef {object} VisibleItem
 * @prop {HTMLAnchorElement} link
 * @prop {HTMLElement} item
 * @prop {HTMLElement|null} next
 * @prop {number} top
 * @prop {number} bottom
 * @prop {boolean} visible
 */
export interface VisibleItem {
  link: HTMLAnchorElement
  item: HTMLElement
  next: HTMLElement | null
  top: number
  bottom: number
  visible: boolean
}
