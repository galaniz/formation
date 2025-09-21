/**
 * Components - Pagination Types
 */

/**
 * @typedef {Map<'nav'|'entry', number>} PaginationDisplay
 */
export type PaginationDisplay = Map<'nav' | 'entry', number>

/**
 * @typedef {Map<'nav'|'entry', HTMLElement>} PaginationSlots
 */
export type PaginationSlots = Map<'nav' | 'entry', HTMLElement>

/**
 * @typedef {'error'|'loader'|'none'} PaginationTemplateKeys
 */
export type PaginationTemplateKeys = 'error' | 'loader' | 'none'

/**
 * @typedef {Map<PaginationTemplateKeys, HTMLElement>} PaginationTemplates
 */
export type PaginationTemplates = Map<PaginationTemplateKeys, HTMLElement>

/**
 * @typedef {'nav'|'pop'|'form'} PaginationSource
 */
export type PaginationSource = 'nav' | 'pop' | 'form'

/**
 * @typedef {object} PaginationState
 * @prop {number} total
 * @prop {number} page
 * @prop {Object<string, string>} params
 */
export interface PaginationState {
  total: number
  page: number
  params: Record<string, string>
}

/**
 * @typedef {HTMLInputElement|HTMLSelectElement} PaginationFilterInput
 */
export type PaginationFilterInput = HTMLInputElement | HTMLSelectElement

/**
 * @typedef {object} PaginationFilterGroup
 * @prop {PaginationFilterInput[]} inputs
 * @prop {string} type
 * @prop {string[]} values
 */
export interface PaginationFilterGroup {
  inputs: PaginationFilterInput[]
  type: string
  values: string[]
}

/**
 * @typedef {Map<string, PaginationFilterGroup>} PaginationFilterGroups
 */
export type PaginationFilterGroups = Map<string, PaginationFilterGroup>

/**
 * @typedef {'change'|'submit'} PaginationFilterLoadOn
 */
export type PaginationFilterLoadOn = 'change' | 'submit'
