/**
 * Utils - Array
 */

/**
 * Check if value is an array
 *
 * @param {*} value
 * @return {boolean}
 */
const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value)
}

/**
 * Check if value is an array with items
 *
 * @param {*} value
 * @return {boolean}
 */
const isArrayStrict = (value: unknown): value is unknown[] => {
  return isArray(value) && value.length > 0
}

/* Exports */

export {
  isArray,
  isArrayStrict
}
