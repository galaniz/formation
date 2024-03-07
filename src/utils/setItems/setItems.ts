/**
 * Utils - Set Items
 */

/* Imports */

import type { Items, ItemsObj, Item } from './setItemsTypes'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'
import { isObject, isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isArray } from '../isArray/isArray'

/**
 * Function - map selectors to their DOM elements recursively
 *
 * @param {import('./setItemsTypes').ItemsStr|import('./setItemsTypes').ItemsStr[]|string[]} items
 * @param {Document|Element} [context=document]
 * @return {import('./setItemsTypes').Items}
 */
const setItems = <T>(
  items: T,
  context: Document | Element = document,
  _changeContext = true
): Items<T> => {
  const isArr = isArray(items)

  if (isArr) {
    const item = items[0] as Item<T>

    if (isStringStrict(item)) {
      return Array.from(context.querySelectorAll(item)) as Items<T>
    }

    if (isObjectStrict(item)) {
      const newItems: Array<Items<T>> = []
      const contextSelector = item.context

      if (isStringStrict(contextSelector)) {
        const newContext = Array.from(context.querySelectorAll(contextSelector))

        newContext.forEach((newContextItem) => {
          const itemCopy = { ...item }

          const newItemProps = setItems(itemCopy, newContextItem, false)

          newItems.push(newItemProps)
        })
      }

      return newItems as Items<T>
    }
  }

  if (isObject(items)) {
    const newItems: ItemsObj = {}

    getObjectKeys(items).forEach((prop) => {
      const item = items[prop]

      if (prop === 'context') {
        if (_changeContext) {
          let newContext = null

          if (isStringStrict(item)) {
            newContext = context.querySelector(item)
          }

          if (newContext !== null) {
            context = newContext
          }
        }

        newItems[prop] = context

        return
      }

      if (isStringStrict(item)) {
        newItems[prop] = context.querySelector(item)
      }

      if (isObject(item)) {
        newItems[prop] = setItems(item, context, true)
      }
    })

    return newItems as Items<T>
  }

  return (isArr ? [] : {}) as Items<T>
}

/* Exports */

export { setItems }
