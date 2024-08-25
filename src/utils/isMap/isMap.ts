/**
 * Utils - Is Map
 */

/**
 * Check if value is a map
 *
 * @param {*} value
 * @return {boolean}
 */
const isMap = <T, U>(value: unknown): value is Map<T, U> => {
  return value instanceof Map
}

/* Exports */

export { isMap }
