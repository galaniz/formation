/**
 * Utils - Is HTML Element
 */

/* Imports */

import { isArrayStrict } from '../isArray/isArray'

/**
 * Check if value is an HTML element
 *
 * @param {*} value
 * @return {boolean}
 */
const isHTMLElement = (value: unknown): value is HTMLElement => {
  return value instanceof HTMLElement
}

/**
 * Check if first value in array is HTML element
 *
 * @param {*} value
 * @return {boolean}
 */
const isHTMLElementArray = (value: unknown): value is HTMLElement[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  return isHTMLElement(value[0])
}

/**
 * Check if all values in array are HTML elements
 *
 * @param {*} value
 * @return {boolean}
 */
const isHTMLElementArrayStrict = (value: unknown): value is HTMLElement[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  return value.every((v) => isHTMLElement(v))
}

/* Exports */

export { isHTMLElement, isHTMLElementArray, isHTMLElementArrayStrict }
