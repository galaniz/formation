/**
 * Utils - Object
 */

/* Imports */

import { isHtmlElement } from '../html/html.js'
import { isArray } from '../array/array.js'
import { isFile, isBlob } from '../file/file.js'

/**
 * Check if value is an object.
 *
 * @param {*} value
 * @return {boolean}
 */
const isObject = <T>(value: T): value is object & T => {
  return typeof value === 'object' && value != null
}

/**
 * Non-object types.
 */
type NotObject<T, K> = Exclude<T, string | number | boolean | Map<T, K> | Set<T> | HTMLElement | Element | FormData | Blob | null | undefined | unknown[] | string[] | number[] | boolean[]>

/**
 * Check if value is an object and not an array or HTML element.
 *
 * @param {*} value
 * @return {boolean}
 */
const isObjectStrict = <T, K>(value: T): value is object & NotObject<T, K> => {
  if (isHtmlElement(value) || isArray(value) || isBlob(value) || isFile(value)) {
    return false
  }

  return isObject(value)
}

/* Exports */

export {
  isObject,
  isObjectStrict
}
