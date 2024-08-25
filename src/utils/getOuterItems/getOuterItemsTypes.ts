/**
 * Utils - Get Outer Items Types
 */

/**
 * @typedef {object} GetOuterItemsFilterReturn
 * @prop {Element[]} store
 * @prop {boolean} stop
 */
export interface GetOuterItemsFilterReturn {
  store: Element[]
  stop: boolean
}

/**
 * @typedef {function} GetOuterItemsFilter
 * @param {Element[]} store
 * @return {GetOuterItemsFilterReturn}
 */
export type GetOuterItemsFilter = (store: Element[]) => GetOuterItemsFilterReturn

/**
 * @typedef {function} GetOuterItems
 * @param {HTMLElement} item
 * @param {string} [type] - all || prev || next
 * @param {GetOuterItemsFilter} [filter]
 * @param {Element[]} [_store]
 * @return {Element[]}
 */
export type GetOuterItems = (item: HTMLElement | null, type?: 'all' | 'prev' | 'next', filter?: GetOuterItemsFilter, _store?: Element[]) => Element[]
