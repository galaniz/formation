/**
 * Utils - Object Keys
 */

/**
 * Object keys cast as keyof object (workaround for index signature)
 *
 * @param {object} obj
 * @return {string[]}
 */
const getObjectKeys = <T>(obj: T): Array<keyof T> => {
  return Object.keys(obj as object) as Array<keyof T>
}

/* Exports */

export { getObjectKeys }
