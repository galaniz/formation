/**
 * Utils: fetch and set elements by selector
 *
 * @param {HTMLElement} context
 * @param {array} meta {
 *  @prop {string} prop
 *  @prop {string} selector
 *  @prop {boolean} all
 *  @prop {boolean} array
 *  @prop {array} items
 *  @prop {HTMLElement} context
 * }
 * @param {object} obj
 * @param {function} done - callback when done recursing through meta and setting object
 */

/* Module */

const setElements = (context = document, meta, obj, done = () => {}) => {
  const recursive = (i, array, arrayLength, context) => {
    if (i < arrayLength) {
      const m = array[i]
      let all = false
      let convertToArray = false
      let el = null

      if (Object.getOwnPropertyDescriptor(m, 'all')) { all = true }

      if (Object.getOwnPropertyDescriptor(m, 'array')) { convertToArray = true }

      if (all) {
        if (context) {
          el = context.querySelectorAll(m.selector)
        } else {
          el = null
        }
      } else {
        if (context) {
          el = context.querySelector(m.selector)
        } else {
          el = null
        }
      }

      if (convertToArray) {
        if (context && el) {
          el = Array.from(el)
        } else {
          el = []
        }
      }

      obj[m.prop] = el

      if (Object.getOwnPropertyDescriptor(m, 'items')) {
        let newContext = el

        if (el && Object.getOwnPropertyDescriptor(m, 'context')) {
          newContext = m.context
        }

        recursive(0, m.items, m.items.length, newContext)
      }

      recursive(i + 1, array, arrayLength, context)
    }

    if (i === meta.length - 1) { done() }
  }

  recursive(0, meta, meta.length, context)
}

/* Exports */

export { setElements }
