/**
 * Utils - Object Recurse
 */

/* Imports */

import type { ObjectRecurse } from './objectTypes.js'
import { isFunction } from '../function/function.js'
import { getObjectKeys } from './objectKeys.js'
import { isObject } from './object.js'

/**
 * Recurse through object if condition met otherwise run callback
 *
 * @type {ObjectRecurse}
 */
const recurseObject: ObjectRecurse = (obj, condition, callback) => {
  if (!isObject(obj) || !isFunction(condition)) {
    return
  }

  const keys = getObjectKeys(obj)

  for (const prop of keys) {
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
