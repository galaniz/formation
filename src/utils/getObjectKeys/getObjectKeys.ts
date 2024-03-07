/**
 * Utils - Get Object Keys
 */

/**
 * Function - get object keys cast as keyof object
 *
 * Note: Workaround for index signature
 * Check if object with isObject or isObjectStrict beforehand
 *
 * @param {object} obj
 * @return {string[]}
 */
const getObjectKeys = <T>(obj: T): Array<keyof T> => {
  return Object.keys(obj as object) as Array<keyof T>
}

/* Exports */

export { getObjectKeys }
