/**
 * Utils - actions
 */

/**
 * Store action callbacks by name
 *
 * @type {object}
 */

let actions: { [key: string]: Function[] } = {}

/**
 * Function - add action to action object
 *
 * @param {string} name
 * @param {function} action
 * @return {boolean}
 */

const addAction = (name: string, action: Function): boolean => {
  if (name === undefined || name === '' || action === undefined) {
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
  if (name === undefined || name === '' || action === undefined) {
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
 * @param {*[]} args
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

/**
 * Function - empty actions object
 *
 * @return {void}
 */

const resetActions = (): void => {
  actions = {}
}

/**
 * Function - fill actions object
 *
 * @param {object} args
 * @return {boolean}
 */

const setActions = (args: { [key: string]: Function }): boolean => {
  if (typeof args !== 'object' || args === undefined || args === null) {
    return false
  }

  if (Object.keys(args).length === 0) {
    return false
  }

  resetActions()

  Object.keys(args).forEach((a) => {
    addAction(a, args[a])
  })

  return true
}

/* Exports */

export {
  addAction,
  removeAction,
  doActions,
  resetActions,
  setActions
}
