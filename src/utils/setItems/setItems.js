/**
 * Utils - set items
 */

/* Imports */

import { isObject } from '../isObject/isObject'

/**
 * Recursively map selectors to their DOM elements
 *
 * @param {object|object[]|string[]} items - array expect length of 1
 * @param {Document|Element} context
 * @return {object|object[]|Element[]}
 */

const setItems = (
  items,
  context = document,
  _items = {}
) => {
  if (Array.isArray(items)) {
    _items = []

    const item = items[0]

    if (typeof item === 'string') {
      return Array.from(context.querySelectorAll(item))
    }

    if (isObject(item)) {
      const newItems = []

      if (item.context !== undefined) {
        const contextSelector = typeof item.context === 'string' ? item.context : ''
        const newContext = Array.from(context.querySelectorAll(contextSelector))

        newContext.forEach((newContextItem) => {
          const itemCopy = { ...item }

          const newItemProps = setItems(itemCopy, newContextItem, _items)

          newItems.push(newItemProps)
        })
      }

      return newItems
    }
  }

  if (typeof items === 'object' && items !== null) {
    const newItems = {}

    Object.entries(items).forEach(([prop, value]) => {
      if (prop === 'context') {
        let newContext = null

        if (typeof value === 'string') {
          newContext = context.querySelector(value)
        }

        if (newContext !== null) {
          context = newContext
        }

        newItems[prop] = context

        return
      }

      if (typeof value === 'string') {
        newItems[prop] = context.querySelector(value)
      } else if (Array.isArray(value) || isObject(value)) {
        newItems[prop] = setItems(value, context, _items)
      }
    })

    return newItems
  }

  return _items
}

/* Exports */

export { setItems }
