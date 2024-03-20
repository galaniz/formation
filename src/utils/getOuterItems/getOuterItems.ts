/**
 * Utils - Get Outer Items
 */

/* Imports */

import type { GetOuterItems } from './getOuterItemsTypes'
import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isFunction } from '../isFunction/isFunction'

/**
 * Function - recursively get elements outside of specified element
 *
 * @type {GetOuterItems}
 */
const getOuterItems: GetOuterItems = (item, type = 'all', filter, _store = []) => {
  if (!isHTMLElement(item)) {
    return []
  }

  const parent = item.parentElement

  if (parent === null) {
    return []
  }

  const children = Array.from(parent.children)

  if (children.length === 0) {
    return []
  }

  const itemIndex = children.indexOf(item)

  const siblings = children.filter((c, i) => {
    let condition = c !== item && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.tagName !== 'HEAD'

    if (type === 'next') {
      condition = condition && i > itemIndex
    }

    if (type === 'prev') {
      condition = condition && i < itemIndex
    }

    return condition
  })

  if (siblings.length > 0) {
    _store = _store.concat(type === 'prev' ? siblings.reverse() : siblings)
  }

  if (isFunction(filter)) {
    const res = filter(_store)
    const { store, stop } = res

    _store = store

    if (stop) {
      return _store
    }
  }

  if (parent.parentElement !== null) {
    return getOuterItems(parent, type, filter, _store)
  }

  return _store
}

/* Exports */

export { getOuterItems }
