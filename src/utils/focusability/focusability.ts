/**
 * Utils - Focusability
 */

/* Imports */

import { isHtmlElement, isHtmlElementArray } from '../html/html.js'
import { getOuterItems } from '../item/itemOuter.js'

/**
 * Manage focusability of specified elements.
 *
 * @param {boolean} on
 * @param {Element[]} items
 * @return {boolean|undefined}
 */
const toggleFocusability = (on: boolean, items: Element[] = []): boolean | undefined => {
  if (!isHtmlElementArray(items)) {
    return
  }

  items.forEach(item => {
    item.inert = !on
  })

  return on
}

/**
 * Selector string to get focusable items.
 *
 * @type {string}
 */
const focusSelector =
  'a, area, input, select, textarea, button, details, iframe, audio, video, [contenteditable], [tabindex]'

/**
 * Check if element is focusable.
 *
 * @param {Element} item
 * @return {boolean}
 */
const isItemFocusable = (item: Element | null): boolean => {
  if (!isHtmlElement(item)) {
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
 * All focusable elements inside item.
 *
 * @param {Element} item
 * @return {Element[]}
 */
const getInnerFocusableItems = (item: Element | null): Element[] => {
  if (!isHtmlElement(item)) {
    return []
  }

  return Array.from(item.querySelectorAll(focusSelector))
}

/**
 * All focusable elements outside item.
 *
 * @param {Element|null} item
 * @return {Element[]}
 */
const getOuterFocusableItems = (item: Element | null): Element[] => {
  if (!isHtmlElement(item)) {
    return []
  }

  return getOuterItems(item)
}

/* Exports */

export {
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
}
