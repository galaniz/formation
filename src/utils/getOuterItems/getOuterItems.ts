/**
 * Utils - Get Outer Items
 */

/* Imports */

import type { GetOuterItems } from './getOuterItemsTypes'
import { isHTMLElement } from '../isHTMLElement/isHTMLElement'
import { isFunction } from '../isFunction/isFunction'

/**
 * Tags to exclude from item siblings
 *
 * @private
 * @type {Set<string>}
 */
const _excludedTags: Set<string> = new Set(['SCRIPT', 'STYLE', 'HEAD'])

/**
 * Recursively get elements outside of specified element
 *
 * @type {import.('./getOuterItemsTypes').GetOuterItems}
 */
const getOuterItems: GetOuterItems = (item, type = 'all', filter, _store = []) => {
  /* Item must be html element */

  if (!isHTMLElement(item)) {
    return []
  }

  /* Parent and children must exist */

  const parent = item.parentElement

  if (parent === null) {
    return []
  }

  const children = Array.from(parent.children)

  if (children.length === 0) {
    return []
  }

  /* Index to compare with siblings */

  const itemIndex = children.indexOf(item)

  /* Exclude script, style and head elements */

  const siblings = children.filter((c, i) => {
    let condition = c !== item && !_excludedTags.has(c.tagName)

    if (type === 'next') {
      condition = condition && i > itemIndex
    }

    if (type === 'prev') {
      condition = condition && i < itemIndex
    }

    return condition
  })

  /* Append filtered siblings */

  if (siblings.length > 0) {
    _store = _store.concat(type === 'prev' ? siblings.reverse() : siblings)
  }

  /* Customize output */

  if (isFunction(filter)) {
    const res = filter(_store)
    const { store, stop } = res

    _store = store

    if (stop) {
      return _store
    }
  }

  /* Recurse if parent exists */

  if (parent.parentElement !== null) {
    return getOuterItems(parent, type, filter, _store)
  }

  /* Output */

  return _store
}

/* Exports */

export { getOuterItems }
