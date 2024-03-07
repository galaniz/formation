/**
 * Utils - Is Array
 */

/**
 * Function - check if value is an array
 *
 * @param {*} value
 * @return {boolean}
 */
const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value)
}

/**
 * Function - check if value is an array with items
 *
 * @param {*} value
 * @return {boolean}
 */
const isArrayStrict = (value: unknown): value is unknown[] => {
  return Array.isArray(value) && value.length > 0
}

/* Exports */

export { isArray, isArrayStrict }
