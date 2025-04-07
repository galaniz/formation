/**
 * Utils - Item Types
 */

/**
 * @typedef {Element|null|Element[]} Item
 */
export type Item<T> = T extends string[] ? Element[] : T extends string ? Element | null : null

/**
 * @typedef {Object<string, string>} ItemsStr
 */

/**
 * @typedef {Object<string|number|symbol, ItemElem|ItemsRes>} ItemsRes
 */
export type ItemsRes = Record<string | number | symbol, Element | null | object>

/**
 * @typedef {ItemsRes|ItemsRes[]} Items
 */
export type Items<T> =
  T extends object ? {
    [K in keyof T]: T extends string[] ? Element : T[K] extends object ? Items<T[K]> : Element | null
  } : object

/**
 * @typedef {string|object} Items0
 */
export type Items0<T> = string | T & { context?: string }

/**
 * @typedef {object} ItemsOuterFilterReturn
 * @prop {Element[]} store
 * @prop {boolean} stop
 */
export interface ItemsOuterFilterReturn {
  store: Element[]
  stop: boolean
}

/**
 * @typedef {function} ItemsOuterFilter
 * @param {Element[]} store
 * @return {ItemsOuterFilterReturn}
 */
export type ItemsOuterFilter = (store: Element[]) => ItemsOuterFilterReturn

/**
 * @typedef {'all'|'prev'|'next'} ItemsOuterType
 */
export type ItemsOuterType = 'all' | 'prev' | 'next'

/**
 * @typedef {function} ItemsOuter
 * @param {HTMLElement} item
 * @param {ItemsOuterType} [type]
 * @param {ItemsOuterFilter} [filter]
 * @param {Element[]} [_store]
 * @return {Element[]}
 */
export type ItemsOuter = (
  item: HTMLElement | null,
  type?: ItemsOuterType,
  filter?: ItemsOuterFilter,
  _store?: Element[]
) => Element[]
