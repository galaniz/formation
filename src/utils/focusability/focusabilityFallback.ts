/**
 * Utils - Focusability Fallback
 */

/* Imports */

import { isHtmlElement, isHtmlElementArray } from '../html/html.js'
import { isString } from '../string/string.js'
import { getOuterItems } from '../item/itemOuter.js'
import { isItemFocusable, focusSelector } from './focusability.js'

/**
 * Inert fallback for managing focusability of specified elements
 *
 * @param {boolean} on
 * @param {Element[]} items
 * @return {boolean|undefined}
 */
const toggleFocusabilityFallback = (on: boolean, items: Element[] = []): boolean | undefined => {
  if (!isHtmlElementArray(items)) {
    return
  }

  items.forEach(item => {
    const dataAttrs = item.dataset

    if (on) {
      if ('tfAriaHidden' in dataAttrs) {
        const initAriaHidden = dataAttrs.tfAriaHidden

        if (isString(initAriaHidden) && initAriaHidden !== 'null') {
          item.ariaHidden = initAriaHidden
        } else {
          item.ariaHidden = null
        }

        delete item.dataset.tfAriaHidden
      }

      if ('tfTabindex' in dataAttrs) {
        const initTabIndex = dataAttrs.tfTabindex

        if (isString(initTabIndex) && initTabIndex !== 'null') {
          item.tabIndex = +initTabIndex
        } else {
          item.removeAttribute('tabindex')
        }

        delete item.dataset.tfTabindex
      }

      if ('tfEditable' in dataAttrs) {
        const initContentEditable = dataAttrs.tfEditable

        if (isString(initContentEditable) && initContentEditable !== 'null') {
          item.contentEditable = initContentEditable
        } else {
          item.removeAttribute('contenteditable')
        }

        delete item.dataset.tfEditable
      }

      return
    }

    if (!('tfAriaHidden' in dataAttrs)) {
      const ariaHiddenValue = item.ariaHidden

      item.dataset.tfAriaHidden = isString(ariaHiddenValue) ? ariaHiddenValue : 'null'
      item.ariaHidden = 'true'
    }

    if (!('tfTabindex' in dataAttrs)) {
      const tabIndexValue = item.getAttribute('tabindex')

      item.dataset.tfTabindex = isString(tabIndexValue) ? tabIndexValue : 'null'
      item.tabIndex = -1
    }

    if (!('tfEditable' in dataAttrs)) {
      const contentEditableValue = item.getAttribute('contenteditable')

      item.dataset.tfEditable = isString(contentEditableValue) ? contentEditableValue : 'null'
      item.contentEditable = 'false'
    }
  })

  return on
}

/**
 * Inert fallback for getting all focusable elements outside item
 *
 * @param {Element} item
 * @return {Element[]}
 */
const getOuterFocusableItemsFallback = (item: Element | null): Element[] => {
  if (!isHtmlElement(item)) {
    return []
  }

  const outerItems = getOuterItems(item)

  let outerFocusableItems: Element[] = []

  outerItems.forEach(o => {
    if (isItemFocusable(o)) {
      outerFocusableItems.push(o)
    } else {
      outerFocusableItems = [
        ...outerFocusableItems,
        ...o.querySelectorAll(focusSelector)
      ]
    }
  })

  return outerFocusableItems
}

/* Exports */

export {
  toggleFocusabilityFallback,
  getOuterFocusableItemsFallback
}
