/**
 * Utils - Is HTML Element
 */

/* Imports */

import { isObject } from '../isObject/isObject'
import { isArrayStrict } from '../isArray/isArray'

/**
 * Function - check if value is an HTML element
 *
 * @param {*} value
 * @return {boolean}
 */
const isHTMLElement = (value: unknown): value is HTMLElement => {
  const v: { nodeType?: number } = isObject(value) ? value : {}

  return v.nodeType === Node.ELEMENT_NODE
}

/**
 * Function - check if all values in array are HTML elements
 *
 * @param {*} value
 * @return {boolean}
 */
const isHTMLElementArray = (value: unknown): value is HTMLElement[] => {
  if (!isArrayStrict(value)) {
    return false
  }

  return value.every((v) => isHTMLElement(v))
}

/* Exports */

export { isHTMLElement, isHTMLElementArray }
