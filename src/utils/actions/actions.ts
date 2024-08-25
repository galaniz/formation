/**
 * Utils - Actions
 */

/* Imports */

import { isStringStrict } from '../isString/isString'
import { isFunction } from '../isFunction/isFunction'
import { isSet } from '../isSet/isSet'

/**
 * Store action callbacks by name
 *
 * @type {Map<string, Set<Function>>}
 */
const actions: Map<string, Set<Function>> = new Map([
  ['resize', new Set()],
  ['escape', new Set()],
  ['scroll', new Set()]
])

/**
 * Add function to actions map
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const addAction = (name: string, action: Function): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  if (actions.get(name) === undefined) {
    actions.set(name, new Set())
  }

  const actionSet = actions.get(name)

  if (isSet(actionSet)) {
    actionSet.add(action)
  }

  return true
}

/**
 * Remove action from actions map
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const removeAction = (name: string, action: Function): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  const actionSet = actions.get(name)

  if (!isSet(actionSet)) {
    return false
  }

  return actionSet.delete(action)
}

/**
 * Run callback functions from actions map
 *
 * @param {string} name
 * @param {*} [args]
 * @return {Promise<void>}
 */
const doActions = async <T>(name: string, args?: T): Promise<void> => {
  const actionSet = actions.get(name)

  if (!isSet(actionSet)) {
    return
  }

  for (const callback of actionSet.values()) {
    if (isFunction(callback)) {
      await callback(args)
    }
  }
}

/* Exports */

export {
  actions,
  addAction,
  removeAction,
  doActions
}
