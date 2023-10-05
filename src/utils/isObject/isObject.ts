/**
 * Utils - Is Object
 */

/**
 * Function - check if value is an object
 *
 * @param {*} value
 * @return {boolean}
 */

const isObject = (value: any): boolean => {
  if (value instanceof window.Element) {
    return false
  }

  return typeof value === 'object' && value !== null && value !== undefined
}

/* Exports */

export { isObject }
