/**
 * Utils - Object Recurse
 */

/* Imports */

import type { ObjectRecurse } from './objectTypes.js'
import { isFunction } from '../function/function.js'
import { getObjectKeys } from './objectKeys.js'
import { isObject } from './object.js'

/**
 * Recurse through object if condition met otherwise run callback.
 *
 * @type {ObjectRecurse}
 */
const recurseObject: ObjectRecurse = (value, condition, callback) => {
  if (!isObject(value) || !isFunction(condition)) {
    return
  }

  const keys = getObjectKeys(value)

  for (const prop of keys) {
    const val = value[prop]
    const res = condition(prop, val)

    if (!res) {
      break
    }

    if (isObject(val)) {
      recurseObject(val, condition, callback)
    }

    if (isFunction(callback)) {
      callback(prop, val)
    }
  }
}

/* Exports */

export { recurseObject }
