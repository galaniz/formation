/**
 * Utils - Toggle Focusability Fallback
 */

/* Imports */

import { isHTMLElement, isHTMLElementArray } from '../isHTMLElement/isHTMLElement'
import { isString } from '../isString/isString'
import { getOuterItems } from '../getOuterItems/getOuterItems'
import { isItemFocusable, focusSelector } from './toggleFocusability'

/**
 * Inert fallback for managing focusability of specified elements
 *
 * @param {boolean} on
 * @param {Element[]} items
 * @return {boolean|undefined}
 */
const toggleFocusabilityFallback = (on: boolean, items: Element[] = []): boolean | undefined => {
  if (!isHTMLElementArray(items)) {
    return
  }

  items.forEach(item => {
    if (on) {
      if (item.hasAttribute('data-tf-aria-hidden')) {
        const initAriaHidden = item.getAttribute('data-tf-aria-hidden')

        if (isString(initAriaHidden) && initAriaHidden !== 'null') {
          item.setAttribute('aria-hidden', initAriaHidden)
        } else {
          item.removeAttribute('aria-hidden')
        }

        item.removeAttribute('data-tf-aria-hidden')
      }

      if (item.hasAttribute('data-tf-tabindex')) {
        const initTabIndex = item.getAttribute('data-tf-tabindex')

        if (isString(initTabIndex) && initTabIndex !== 'null') {
          item.setAttribute('tabindex', initTabIndex)
        } else {
          item.removeAttribute('tabindex')
        }

        item.removeAttribute('data-tf-tabindex')
      }

      if (item.hasAttribute('data-tf-editable')) {
        const initContentEditable = item.getAttribute('data-tf-editable')

        if (isString(initContentEditable) && initContentEditable !== 'null') {
          item.setAttribute('contenteditable', initContentEditable)
        } else {
          item.removeAttribute('contenteditable')
        }

        item.removeAttribute('data-tf-editable')
      }

      return
    }

    if (!item.hasAttribute('data-tf-aria-hidden')) {
      const ariaHiddenValue = item.getAttribute('aria-hidden')

      item.setAttribute('data-tf-aria-hidden', ariaHiddenValue === null ? 'null' : ariaHiddenValue)
      item.setAttribute('aria-hidden', 'true')
    }

    if (!item.hasAttribute('data-tf-tabindex')) {
      const tabIndexValue = item.getAttribute('tabindex')

      item.setAttribute('data-tf-tabindex', tabIndexValue === null ? 'null' : tabIndexValue)
      item.setAttribute('tabindex', '-1')
    }

    if (!item.hasAttribute('data-tf-editable')) {
      const contentEditableValue = item.getAttribute('contenteditable')

      item.setAttribute('data-tf-editable', contentEditableValue === null ? 'null' : contentEditableValue)
      item.setAttribute('contenteditable', 'false')
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
  if (!isHTMLElement(item)) {
    return []
  }

  const outerItems = getOuterItems(item)

  let outerFocusableItems: Element[] = []

  outerItems.forEach((o) => {
    if (isItemFocusable(o)) {
      outerFocusableItems.push(o)
    } else {
      outerFocusableItems = outerFocusableItems.concat(
        Array.from(o.querySelectorAll(focusSelector))
      )
    }
  })

  return outerFocusableItems
}

/* Exports */

export {
  toggleFocusabilityFallback,
  getOuterFocusableItemsFallback
}
