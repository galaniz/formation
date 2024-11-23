/**
 * Utils - Item Outer
 */

/* Imports */

import type { ItemsOuter } from './itemTypes.js'
import { isHtmlElement } from '../html/html.js'
import { isFunction } from '../function/function.js'

/**
 * Tags to exclude from item siblings
 *
 * @private
 * @type {Set<string>}
 */
const excludedTags: Set<string> = new Set(['SCRIPT', 'STYLE', 'HEAD'])

/**
 * Recursively get elements outside of specified element
 *
 * @type {ItemsOuter}
 */
const getOuterItems: ItemsOuter = (item, type = 'all', filter, _store = []) => {
  /* Item must be html element */

  if (!isHtmlElement(item)) {
    return []
  }

  /* Parent must exist */

  const parent = item.parentElement

  if (!isHtmlElement(parent)) {
    return []
  }

  /* Index to compare with siblings */

  const children = Array.from(parent.children)
  const itemIndex = children.indexOf(item)

  /* Exclude script, style and head elements */

  const siblings = children.filter((c, i) => {
    let condition = c !== item && !excludedTags.has(c.tagName)

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

  if (isHtmlElement(parent.parentElement)) {
    return getOuterItems(parent, type, filter, _store)
  }

  /* Output */

  return _store
}

/* Exports */

export { getOuterItems }
