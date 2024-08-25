/**
 * Utils - Recurse Object Types
 */

/**
 * @typedef {function} RecurseObjectCondition
 * @param {string|number|symbol} prop
 * @param {*} value
 * @return {boolean}
 */
export type RecurseObjectCondition = (prop: string | number | symbol, value: unknown) => boolean

/**
 * @typedef {function} RecurseObjectCallback
 * @param {string|number|symbol} prop
 * @param {*} value
 * @return {*}
 */
export type RecurseObjectCallback = (prop: string | number | symbol, value: unknown) => unknown

/**
 * @typedef {function} RecurseObject
 * @param {object} obj
 * @param {function} condition - Return boolean
 * @param {function} [callback]
 * @return {void}
 */
export type RecurseObject = <T>(obj: T, condition: RecurseObjectCondition, callback?: RecurseObjectCallback) => void
