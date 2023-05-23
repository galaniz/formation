/**
 * Utils - toggle focusability
 */

/* Imports */

import { settings } from './set-settings'
import { getOuterElements } from './get-outer-elements'

/**
 * Function - manage focusability of specified elements
 *
 * Source - https://bit.ly/3paRHkt
 *
 * @param {boolean} on
 * @param {array<HTMLElement>} items
 * @return {void}
 */

const toggleFocusability = (on = true, items = []) => {
  if (!items.length) {
    return
  }

  if (settings.inert) {
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

          if (initAriaHidden !== 'null') {
            item.setAttribute('aria-hidden', initAriaHidden)
          } else {
            item.removeAttribute('aria-hidden')
          }

          item.removeAttribute('data-tf-aria-hidden')
        }

        if (item.hasAttribute('data-tf-tabindex')) {
          const initTabIndex = item.getAttribute('data-tf-tabindex')

          if (initTabIndex !== 'null') {
            item.setAttribute('tabindex', initTabIndex)
          } else {
            item.removeAttribute('tabindex')
          }

          item.removeAttribute('data-tf-tabindex')
        }
      } else {
        if (!item.hasAttribute('data-tf-aria-hidden')) {
          let ariaHiddenValue = 'null'

          if (item.hasAttribute('aria-hidden')) {
            ariaHiddenValue = item.getAttribute('aria-hidden')
          }

          item.setAttribute('data-tf-aria-hidden', ariaHiddenValue)
          item.setAttribute('aria-hidden', true)
        }

        if (!item.hasAttribute('data-tf-tabindex')) {
          item.setAttribute('data-tf-tabindex', item.getAttribute('tabindex'))
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

const focusSelector = 'a, area, input, select, textarea, button, [tabindex], [data-tf-tabindex], iframe'

/**
 * Function - check if element is focusable
 *
 * @param {HTMLElement} item
 * @return {boolean}
 */

const isItemFocusable = (item) => {
  if (!item) {
    return false
  }

  const focusableTags = ['a', 'area', 'input', 'select', 'textarea', 'button', 'iframe']

  return focusableTags.includes(item.tagName.toLowerCase()) || item.hasAttribute('tabindex') || item.hasAttribute('data-tf-tabindex')
}

/**
 * Function - get all focusable elements inside item
 *
 * @param {HTMLElement} item
 * @return {array<HTMLElement>}
 */

const getInnerFocusableItems = (item) => {
  if (!item) {
    return []
  }

  return Array.from(item.querySelectorAll(focusSelector))
}

/**
 * Function - get all focusable elements outside item
 *
 * @param {HTMLElement} item
 * @return {array<HTMLElement>}
 */

const getOuterFocusableItems = (item) => {
  if (!item) {
    return []
  }

  let outerItems = getOuterElements(item)

  if (!settings.inert) {
    let outerFocusableItems = []

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
