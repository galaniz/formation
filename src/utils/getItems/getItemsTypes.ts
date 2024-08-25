/**
 * Utils - Get Items Types
 */

/**
 * @typedef {Object<string, string>} ItemsStr
 */

/**
 * @typedef {Object<string|number|symbol, ItemElem|ItemsObj>} ItemsObj
 */
export type ItemsObj = Record<string | number | symbol, Element | null | object>

/**
 * @typedef {ItemsObj|ItemsObj[]} Items
 */
export type Items<T> =
  T extends object ? {
    [K in keyof T]: T extends string[] ? Element : T[K] extends object ? Items<T[K]> : Element | null
  } : object

/**
 * @typedef {string|object} Item
 */
export type Item<T> = string | T & { context?: string }
