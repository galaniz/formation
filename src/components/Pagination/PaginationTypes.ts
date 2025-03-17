/**
 * Objects - Pagination Types
 */

/**
 * @typedef {'loader'|'ellipsis'|'prev-link'|'prev-text'|'next-link'|'next-text'|'current'|'item'} PaginationTemplate
 */
export type PaginationTemplate =
  'loader' |
  'ellipsis' |
  'prev-link' |
  'prev-text' |
  'next-link' |
  'next-text' |
  'current' |
  'item'

/**
 * @typedef {HTMLInputElement|HTMLSelectElement} PaginationFilterInput
 */
export type PaginationFilterInput = HTMLInputElement | HTMLSelectElement
