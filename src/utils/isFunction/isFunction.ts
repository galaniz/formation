/**
 * Utils - Is Function
 */

/**
 * Check if value is a function
 *
 * @param {*} value
 * @return {boolean}
 */
const isFunction = <T>(value: T): value is Function & T => {
  return typeof value === 'function'
}

/* Exports */

export { isFunction }
