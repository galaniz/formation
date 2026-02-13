/**
 * Utils - Display
 */

/* Imports */

import { isHtmlElement } from '../html/html.js'

/**
 * Toggle display and focus of element.
 *
 * @param {Element|null} item
 * @param {'show'|'hide'|'focus'} type
 * @param {string|undefined} [attr]
 * @return {number}
 */
const setDisplay = (
  item: Element | null,
  type: 'show' | 'hide' | 'focus',
  attr?: string
): number => {
  if (!isHtmlElement(item)) {
    return -1
  }

  if (type === 'hide') {
    if (attr) {
      delete item.dataset[attr] // eslint-disable-line @typescript-eslint/no-dynamic-delete
    } else {
      item.style.setProperty('display', 'none')
    }

    return 0
  }

  return window.setTimeout(() => {
    if (attr) {
      item.dataset[attr] = 'show'
    } else {
      item.style.removeProperty('display')
    }

    if (type === 'focus') {
      item.focus()
    }
  }, 0)
}

/* Exports */

export { setDisplay }
