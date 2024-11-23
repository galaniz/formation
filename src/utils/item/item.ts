/**
 * Utils - Item
 */

/* Imports */

import type { Items, ItemsObj, Items0, Item } from './itemTypes.js'
import { getObjectKeys } from '../object/objectKeys.js'
import { isObject, isObjectStrict } from '../object/object.js'
import { isArray, isArrayStrict } from '../array/array.js'
import { isStringStrict } from '../string/string.js'
import { isHtmlElement } from '../html/html.js'

/**
 * Map selector to DOM element(s)
 *
 * @param {string|string[]} item
 * @param {Document|Element} [context=document]
 * @return {Item}
 */
const getItem = <T extends string | string[]>(
  item: T,
  context: Document | DocumentFragment | Element = document
): Item<T> => {
  /* Check types */

  const isStr = isStringStrict(item)
  const isArr = isArrayStrict(item)

  /* Array entry */

  if (isArr) {
    const [selector] = item

    if (!isStringStrict(selector)) {
      return [] as unknown as Item<T>
    }

    return Array.from(context.querySelectorAll(selector)) as Item<T>
  }

  /* Single entry */

  if (isStr) {
    return context.querySelector(item) as Item<T>
  }

  /* Fallback */

  return null as Item<T>
}

/**
 * Map selectors to DOM elements recursively
 *
 * @param {ItemsStr|ItemsStr[]|string[]} items
 * @param {Document|Element} [context=document]
 * @return {Items}
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
    const item = items[0] as Items0<T>

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

  if (isObjectStrict(items)) {
    const newItems: ItemsObj = {}

    getObjectKeys(items).forEach((prop) => {
      const item = items[prop]

      if (prop === 'context') {
        if (_changeContext) {
          const newContext = isStringStrict(item) ? context.querySelector(item) : null

          if (isHtmlElement(newContext)) {
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

export {
  getItem,
  getItems
}
