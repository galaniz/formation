/**
 * Utility modules: publish/subscribe to events
 *
 * publish
 *
 * @param name [string]
 * @param args [array] pass to callback function
 *
 * subscribe
 *
 * @param name [string] (same as publish name)
 * @param callback [function]
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
