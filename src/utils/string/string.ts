/**
 * Utils - String
 */

/**
 * Check if value is string
 *
 * @param {*} value
 * @return {boolean}
 */
const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

/**
 * Check if value is string and not empty
 *
 * @param {*} value
 * @return {boolean}
 */
const isStringStrict = (value: unknown): value is string => {
  return isString(value) && value !== ''
}

/* Exports */

export {
  isString,
  isStringStrict
}
