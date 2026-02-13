/**
 * Actions
 */

/* Imports */

import type { GenericFunction } from '../global/globalTypes.js'
import { isStringStrict } from '../utils/string/string.js'
import { isFunction } from '../utils/function/function.js'
import { isSet } from '../utils/set/set.js'

/**
 * Action callbacks by name.
 *
 * @type {Map<string, Set<GenericFunction>>}
 */
const actions: Map<string, Set<GenericFunction>> = new Map([
  ['resize', new Set()],
  ['escape', new Set()],
  ['scroll', new Set()]
])

/**
 * Add function to actions map.
 *
 * @param {string} name
 * @param {GenericFunction} action
 * @return {boolean}
 */
const addAction = (name: string, action: GenericFunction): boolean => {
  if (!isStringStrict(name) || !isFunction(action)) {
    return false
  }

  if (!isSet(actions.get(name))) {
    actions.set(name, new Set())
  }

  actions.get(name)?.add(action)

  return true
}

/**
 * Remove action from actions map.
 *
 * @param {string} name
 * @param {GenericFunction} action
 * @return {boolean}
 */
const removeAction = (name: string, action: GenericFunction): boolean => {
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
 * Run callback functions from actions map.
 *
 * @param {string} name
 * @param {*} [args]
 * @return {void}
 */
const doActions = (name: string, args?: unknown): void => {
  const actionSet = actions.get(name)

  if (!isSet(actionSet)) {
    return
  }

  for (const callback of actionSet.values()) {
    if (isFunction(callback)) {
      callback(args)
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
