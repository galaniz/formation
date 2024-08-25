/**
 * Utils - Toggle Focusability
 */

/* Imports */

import { config, configFallback } from '../../config/config'
import { isHTMLElement, isHTMLElementArray } from '../isHTMLElement/isHTMLElement'
import { isFunction } from '../isFunction/isFunction'
import { getOuterItems } from '../getOuterItems/getOuterItems'

/**
 * Manage focusability of specified elements
 *
 * @param {boolean} on
 * @param {Element[]} items
 * @return {boolean|undefined}
 */
const toggleFocusability = (on: boolean, items: Element[] = []): boolean | undefined => {
  if (!isHTMLElementArray(items)) {
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

    return on
  }

  if (isFunction(configFallback.toggleFocusability)) {
    return configFallback.toggleFocusability(on, items)
  }
}

/**
 * Selector string to get focusable items
 *
 * @type {string}
 */
const focusSelector: string =
  'a, area, input, select, textarea, button, details, iframe, audio, video, [contenteditable], [tabindex]'

/**
 * Check if element is focusable
 *
 * @param {Element} item
 * @return {boolean}
 */
const isItemFocusable = (item: Element | null): boolean => {
  if (!isHTMLElement(item)) {
    return false
  }

  const focusableTags = new Set([
    'a',
    'area',
    'input',
    'select',
    'textarea',
    'button',
    'details',
    'iframe',
    'audio',
    'video'
  ])

  return (
    focusableTags.has(item.tagName.toLowerCase()) ||
    item.hasAttribute('contenteditable') ||
    item.hasAttribute('tabindex')
  )
}

/**
 * Get all focusable elements inside item
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
 * Get all focusable elements outside item
 *
 * @param {Element} item
 * @return {Element[]}
 */
const getOuterFocusableItems = (item: Element | null): Element[] => {
  if (!isHTMLElement(item)) {
    return []
  }

  if (config.inert) {
    return getOuterItems(item)
  }

  if (isFunction(configFallback.getOuterFocusableItems)) {
    return configFallback.getOuterFocusableItems(item)
  }

  return []
}

/* Exports */

export {
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
}
