/**
 * Utils - Actions
 */

/* Imports */

import { isString } from '../isString/isString'

/**
 * Store action callbacks by name
 *
 * @type {Object<string, Function[]>}
 */
const actions: { [key: string]: Function[] } = {
  resize: [],
  scroll: []
}

/**
 * Function - add function to action object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */
const addAction = (name: string, action: Function): boolean => {
  if (!isString(name)) {
    return false
  }

  if (typeof action !== 'function') {
    return false
  }

  if (actions?.[name] === undefined) {
    actions[name] = []
  }

  actions[name].push(action)

  return true
}

/**
 * Function - remove action from actions object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */

const removeAction = (name: string, action: Function): boolean => {
  if (!isString(name)) {
    return false
  }

  if (typeof action !== 'function') {
    return false
  }

  const callbacks = actions[name]

  if (Array.isArray(callbacks)) {
    const index = callbacks.indexOf(action)

    if (index > -1) {
      actions[name].splice(index, 1)

      return true
    }
  }

  return false
}

/**
 * Function - run callback functions from actions object
 *
 * @param {string} name
 * @param {...*} args
 * @return {void}
 */

const doActions = (name: string, ...args: any): void => {
  const callbacks = actions[name]

  if (Array.isArray(callbacks)) {
    for (let i = 0; i < callbacks.length; i += 1) {
      const callback = callbacks[i]

      if (typeof callback === 'function') {
        // eslint-disable-next-line n/no-callback-literal
        callback(...args)
      }
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
