/**
 * Utils - pub sub
 */

/**
 * Store subscription callbacks
 *
 * @type {object}
 */

const subscriptions = {}

/**
 * Function - publish events
 *
 * @param {string} name
 * @param {array} args - pass to callback function
 * @return {void}
 */

const publish = (name, args = []) => {
  if (!Object.getOwnPropertyDescriptor(subscriptions, name)) {
    return
  }

  const callbacks = subscriptions[name]

  if (callbacks) {
    callbacks.forEach(callback => {
      callback(args)
    })
  }
}

/**
 * Function - subscribe to events
 *
 * @param {string} name - same as publish name
 * @param {function} callback
 * @return {void}
 */

const subscribe = (name, callback = () => {}) => {
  if (!Object.getOwnPropertyDescriptor(subscriptions, name)) {
    subscriptions[name] = []
  }

  const index = subscriptions[name].push(callback) - 1

  return {
    remove: () => {
      delete subscriptions[name][index]
    }
  }
}

/* Exports */

export { publish, subscribe }
