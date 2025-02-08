/**
 * Utils - Html
 */

/* Imports */

import { isArrayStrict } from '../array/array.js'

/**
 * Check if value is an HTMLElement
 *
 * @param {*} value
 * @param {HTMLElement} [instance]
 * @return {boolean}
 */
const isHtmlElement = <T extends HTMLElement>(
  value: unknown,
  instance: new () => T = HTMLElement as unknown as new () => T
): value is T => {
  return value instanceof instance
}

/**
 * Check if first value in array is HTMLElement
 *
 * @param {*} value
 * @param {HTMLElement} [instance]
 * @return {boolean}
 */
const isHtmlElementArray = <T extends HTMLElement>(
  value: unknown,
  instance: new () => T = HTMLElement as unknown as new () => T
): value is T[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  return isHtmlElement(value[0], instance)
}

/**
 * Check if all values in array are HTMLElement
 *
 * @param {*} value
 * @param {HTMLElement} [instance]
 * @return {boolean}
 */
const isHtmlElementArrayStrict = <T extends HTMLElement>(
  value: unknown,
  instance: new () => T = HTMLElement as unknown as new () => T
): value is T[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  return value.every((v) => isHtmlElement(v, instance))
}

/* Exports */

export {
  isHtmlElement,
  isHtmlElementArray,
  isHtmlElementArrayStrict
}
