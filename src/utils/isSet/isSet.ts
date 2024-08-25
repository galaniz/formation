/**
 * Utils - Is Set
 */

/**
 * Check if value is a set
 *
 * @param {*} value
 * @return {boolean}
 */
const isSet = <T>(value: unknown): value is Set<T> => {
  return value instanceof Set
}

/**
 * Check if value is a set and not empty
 *
 * @param {*} value
 * @return {boolean}
 */
const isSetStrict = <T>(value: unknown): value is Set<T> => {
  return isSet(value) && value.size > 0
}

/* Exports */

export { isSet, isSetStrict }
