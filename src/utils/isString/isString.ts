/**
 * Utils - Is String
 */

/**
 * Function - check if value is string
 *
 * @param {*} value
 * @return {boolean}
 */
const isString = (value: unknown): value is string => {
  return typeof value === 'string'
}

/**
 * Function - check if value is string and not empty
 *
 * @param {*} value
 * @return {boolean}
 */
const isStringStrict = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim() !== ''
}

/* Exports */

export { isString, isStringStrict }
