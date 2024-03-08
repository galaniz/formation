/**
 * Utils - Set Items Types
 */

/**
 * @typedef {Object.<string, string>} ItemsStr
 */

/**
 * @typedef {Object.<string|number|symbol, ItemElem|ItemsObj>} ItemsObj
 */
export type ItemsObj = Record<string | number | symbol, Element | null | object>

/**
 * @typedef {ItemsObj|ItemsObj[]} Items
 */
export type Items<T> = {
  [K in keyof T]: T[K] extends object ? Items<T[K]> : Element | null
}

/**
 * @typedef {string|object} Item
 */
export type Item<T> = string | T & { context?: string }
