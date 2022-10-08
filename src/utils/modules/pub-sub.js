/**
 * Utils: publish/subscribe to events
 *
 * publish
 *
 * @param {string} name
 * @param {array} args - pass to callback function
 *
 * subscribe
 *
 * @param {string} name - same as publish name
 * @param {function} callback
 */

/* Variables */

const subscriptions = {}

/* Modules */

const publish = (name, args = []) => {
  if (!Object.getOwnPropertyDescriptor(subscriptions, name)) { return }

  const callbacks = subscriptions[name]

  if (callbacks) {
    callbacks.forEach(callback => {
      callback(args)
    })
  }
}

const subscribe = (name, callback = () => {}) => {
  if (!Object.getOwnPropertyDescriptor(subscriptions, name)) { subscriptions[name] = [] }

  const index = subscriptions[name].push(callback) - 1

  return {
    remove: () => {
      delete subscriptions[name][index]
    }
  }
}

/* Exports */

export { publish, subscribe }
