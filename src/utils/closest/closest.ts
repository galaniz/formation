/**
 * Utils - Closest
 */

/* Imports */

import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isString } from '../isString/isString'

/**
 * Function - check item is an HTML element and contains classes
 *
 * @private
 * @param {HTMLElement|null} item
 * @param {string} classes
 * @return {boolean}
 */

const _itemCheck = (item: HTMLElement | null, classes: string): boolean => {
  if (!isHTMLElement(item) || !isString(classes)) {
    return false
  }

  return !item.classList.contains(classes)
}

/**
 * Function - traverse up DOM until find element with class
 *
 * @param {HTMLElement|null} item
 * @param {string} classes
 * @param {number} [max=10]
 * @return {HTMLElement|null}
 */

const closest = (item: HTMLElement | null, classes: string, max: number = 10): HTMLElement | null => {
  if (!isHTMLElement(item) || !isString(classes)) {
    return null
  }

  let parent = item.parentElement
  let counter = 0

  while (_itemCheck(parent, classes)) {
    if (parent !== null) {
      parent = parent.parentElement
    }

    counter += 1

    if (counter === max) {
      if (_itemCheck(parent, classes)) {
        parent = null
      }

      break
    }
  }

  return parent
}

/* Exports */

export { closest }
