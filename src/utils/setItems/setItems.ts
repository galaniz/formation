/**
 * Utils - Set Items
 */

/* Imports */

import { isObject } from '../isObject/isObject'

/**
 * Function - map selectors to their DOM elements recursively
 *
 * @param {object|object[]|string[]} items - array expect length of 1
 * @param {Document|Element} [context=document]
 * @return {object|object[]|Element[]}
 */

interface ItemsObject {
  [key: string]: string | Items
}

interface ItemsObjectReturn {
  [key: string]: Document | null | Element | ItemsReturn
}

type Items = string[] | ItemsObject | ItemsObject[]
type ItemsReturn = Element[] | ItemsObjectReturn | ItemsObjectReturn[] | ItemsReturn[]

const setItems = (
  items: Items,
  context: Document | Element = document,
  _items: ItemsReturn = {},
  _changeContext = true
): ItemsReturn => {
  if (Array.isArray(items)) {
    _items = []

    const item = items[0]

    if (typeof item === 'string') {
      return Array.from(context.querySelectorAll(item))
    }

    if (isObject(item)) {
      const newItems: ItemsReturn[] = []

      if (item.context !== undefined) {
        const contextSelector = typeof item.context === 'string' ? item.context : ''
        const newContext = Array.from(context.querySelectorAll(contextSelector))

        newContext.forEach((newContextItem) => {
          const itemCopy = { ...item }

          const newItemProps = setItems(itemCopy, newContextItem, _items, false)

          newItems.push(newItemProps)
        })
      }

      return newItems
    }
  }

  if (typeof items === 'object' && items !== null) {
    const newItems: ItemsReturn = {}

    Object.entries(items).forEach(([prop, value]) => {
      if (prop === 'context') {
        if (_changeContext) {
          let newContext = null

          if (typeof value === 'string') {
            newContext = context.querySelector(value)
          }

          if (newContext !== null) {
            context = newContext
          }
        }

        newItems[prop] = context

        return
      }

      if (typeof value === 'string') {
        newItems[prop] = context.querySelector(value)
      } else if (Array.isArray(value) || isObject(value)) {
        newItems[prop] = setItems(value, context, _items, true)
      }
    })

    return newItems
  }

  return _items
}

/* Exports */

export { setItems }
