/**
 * Utils - Is Object
 */

/* Imports */

import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isArray } from '../isArray/isArray'
import { isFile, isBlob } from '../isFile/isFile'

/**
 * Check if value is an object
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = <T>(value: T): value is object & T => {
  return typeof value === 'object' && value !== null && value !== undefined
}

/**
 * Non-object types
 */
type NotObject<T, K> = Exclude<T, string | number | boolean | Function | Map<T, K> | Set<T> | HTMLElement | Element | FormData | null | undefined | unknown[] | string[] | number[] | boolean[] | Function[]>

/**
 * Check if value is an object and not an array or HTML element
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = <T, K>(value: T): value is object & NotObject<T, K> => {
  if (isHTMLElement(value) || isArray(value) || isBlob(value) || isFile(value)) {
    return false
  }

  return isObject(value)
}

/* Exports */

export { isObject, isObjectStrict }
