/**
 * Utils - Is Object
 */

/**
 * Function - check if value is an object
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = <T>(value: T): value is object & T => {
  return typeof value === 'object' && value !== null && value !== undefined
}

/**
 * Function - check if value is an object and not array
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = <T>(value: T): value is object & Exclude<T, string | number | boolean | Function | null | undefined | unknown[] | string[] | number[] | boolean[] | Function[]> => {
  if (value instanceof window.Element) {
    return false
  }

  if (Array.isArray(value)) {
    return false
  }

  return typeof value === 'object' && value !== null && value !== undefined
}

/* Exports */

export { isObject, isObjectStrict }
