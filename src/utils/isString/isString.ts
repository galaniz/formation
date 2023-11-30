/**
 * Utils - Is String
 */

/**
 * Function - check if value is not an empty string
 *
 * @param {*} value
 * @return {boolean}
 */

const isString = (value: any): value is string => {
  return typeof value === 'string' && value.trim() !== ''
}

/* Exports */

export { isString }
