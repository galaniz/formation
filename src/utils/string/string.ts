/**
 * Utils - String
 */

/**
 * Check if value is a string.
 *
 * @param {*} value
 * @return {boolean}
 */
const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

/**
 * Check if value is a string and not empty.
 *
 * @param {*} value
 * @return {boolean}
 */
const isStringStrict = (value: unknown): value is string => {
  return isString(value) && value !== ''
}

/**
 * Check if value is string and not a prototype key.
 *
 * @param {*} value
 * @return {boolean}
 */
const isStringSafe = (value: unknown): value is string => {
  return isStringStrict(value) && value !== '__proto__' && value !== 'constructor' && value !== 'prototype'
}

/* Exports */

export {
  isString,
  isStringStrict,
  isStringSafe
}
