/**
 * Utils - Toggle Focusability
 */

/* Imports */

import { config } from '../../config/config'
import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isString } from '../isString/isString'
import { getOuterItems } from '../getOuterItems/getOuterItems'

/**
 * Function - manage focusability of specified elements
 *
 * Source - https://bit.ly/3paRHkt
 *
 * @param {boolean} on
 * @param {Element[]} items
 * @return {void}
 */
const toggleFocusability = (on: boolean = true, items: Element[] = []): void => {
  if (items.length === 0) {
    return
  }

  if (config.inert) {
    items.forEach(item => {
      if (on) {
        item.removeAttribute('inert')
      } else {
        item.setAttribute('inert', '')
      }
    })
  } else {
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
      } else {
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
      }
    })
  }
}

/**
 * Selector string to get focusable items
 *
 * @type {string}
 */
const focusSelector: string = 'a, area, input, select, textarea, button, [tabindex], [data-tf-tabindex], iframe'

/**
 * Function - check if element is focusable
 *
 * @param {Element} item
 * @return {boolean}
 */
const isItemFocusable = (item: Element | null): boolean => {
  if (!isHTMLElement(item)) {
    return false
  }

  const focusableTags = ['a', 'area', 'input', 'select', 'textarea', 'button', 'iframe']

  return (
    focusableTags.includes(item.tagName.toLowerCase()) ||
    item.hasAttribute('tabindex') ||
    item.hasAttribute('data-tf-tabindex')
  )
}

/**
 * Function - get all focusable elements inside item
 *
 * @param {Element} item
 * @return {Element[]}
 */
const getInnerFocusableItems = (item: Element | null): Element[] => {
  if (!isHTMLElement(item)) {
    return []
  }

  return Array.from(item.querySelectorAll(focusSelector))
}

/**
 * Function - get all focusable elements outside item
 *
 * @param {Element} item
 * @return {Element[]}
 */
const getOuterFocusableItems = (item: Element | null): Element[] => {
  if (!isHTMLElement(item)) {
    return []
  }

  let outerItems = getOuterItems(item)

  if (!config.inert) {
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

    outerItems = outerFocusableItems
  }

  return outerItems
}

/* Exports */

export {
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
}
