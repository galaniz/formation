/**
 * Utils - Is Array
 */

/**
 * Function - check if value is not an empty array
 *
 * @param {*} value
 * @return {boolean}
 */

const isArray = (value: any): value is any[] => {
  return Array.isArray(value) && value.length > 0
}

/* Exports */

export { isArray }
