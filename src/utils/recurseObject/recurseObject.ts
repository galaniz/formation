/**
 * Utils - Recurse Object
 */

/* Imports */

import type { RecurseObject } from './recurseObjectTypes'
import { isFunction } from '../isFunction/isFunction'
import { getObjectKeys } from '../getObjectKeys/getObjectKeys'
import { isObject } from '../isObject/isObject'

/**
 * Recurse through object if condition met otherwise run callback
 *
 * @type {import('./recurseObjectTypes').RecurseObject}
 */
const recurseObject: RecurseObject = (obj, condition, callback) => {
  if (!isObject(obj) || !isFunction(condition)) {
    return
  }

  const keys = getObjectKeys(obj)

  for (let i = 0; i < keys.length; i += 1) {
    const prop = keys[i]

    if (prop === undefined) {
      continue
    }

    const value = obj[prop]
    const res = condition(prop, value)

    if (!res) {
      break
    }

    if (isObject(value)) {
      recurseObject(value, condition, callback)
    }

    if (isFunction(callback)) {
      callback(prop, value)
    }
  }
}

/* Exports */

export { recurseObject }
