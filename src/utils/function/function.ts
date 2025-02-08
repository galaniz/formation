/**
 * Utils - Function
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'

/**
 * Check if value is a function
 *
 * @param {*} value
 * @return {boolean}
 */
const isFunction = <T>(value: T): value is GenericFunction & T => {
  return typeof value === 'function'
}

/* Exports */

export { isFunction }
