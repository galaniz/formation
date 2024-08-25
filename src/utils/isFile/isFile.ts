/**
 * Utils - Is File
 */

/**
 * Check if value is a file
 *
 * @param {*} value
 * @return {boolean}
 */
const isFile = (value: unknown): value is File => {
  return value instanceof File
}

/**
 * Check if value is a blob
 *
 * @param {*} value
 * @return {boolean}
 */
const isBlob = (value: unknown): value is Blob => {
  return value instanceof Blob
}

/* Exports */

export { isFile, isBlob }
