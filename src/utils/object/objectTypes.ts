/**
 * Utils - Object Recurse Types
 */

/**
 * @typedef {function} ObjectRecurseCondition
 * @param {string|number|symbol} prop
 * @param {*} value
 * @return {boolean}
 */
export type ObjectRecurseCondition = (prop: string | number | symbol, value: unknown) => boolean

/**
 * @typedef {function} ObjectRecurseCallback
 * @param {string|number|symbol} prop
 * @param {*} value
 * @return {*}
 */
export type ObjectRecurseCallback = (prop: string | number | symbol, value: unknown) => unknown

/**
 * @typedef {function} ObjectRecurse
 * @param {object} obj
 * @param {function} condition - Return boolean
 * @param {function} [callback]
 * @return {void}
 */
export type ObjectRecurse = <T>(
  obj: T,
  condition: ObjectRecurseCondition,
  callback?: ObjectRecurseCallback
) => void
