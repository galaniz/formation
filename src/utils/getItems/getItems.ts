/**
 * Utils - Get Items
 */

/* Imports */

import type { Items, ItemsObj, Item } from './getItemsTypes'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'
import { isObject, isObjectStrict } from '../isObject/isObject'
import { isStringStrict } from '../isString/isString'
import { isArray } from '../isArray/isArray'

/**
 * Map selectors to DOM elements recursively
 *
 * @param {import('./getItemsTypes').ItemsStr|import('./getItemsTypes').ItemsStr[]|string[]} items
 * @param {Document|Element} [context=document]
 * @return {import('./getItemsTypes').Items}
 */
const getItems = <T>(
  items: T,
  context: Document | Element = document,
  _changeContext = true
): Items<T> => {
  /* Check if array */

  const isArr = isArray(items)

  /* Array entry */

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

          const newItemProps = getItems(itemCopy, newContextItem, false)

          newItems.push(newItemProps)
        })
      }

      return newItems as Items<T>
    }
  }

  /* Object entry */

  if (isObject(items)) {
    const newItems: ItemsObj = {}

    getObjectKeys(items).forEach((prop) => {
      const item = items[prop]

      if (prop === 'context') {
        if (_changeContext) {
          const newContext = isStringStrict(item) ? context.querySelector(item) : null

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
        newItems[prop] = getItems(item, context, true)
      }
    })

    return newItems as Items<T>
  }

  /* Fallback output */

  return (isArr ? [] : {}) as Items<T>
}

/* Exports */

export { getItems }
