/**
 * Utility modules: fetch and set elements by selector
 *
 * @param meta [array] of objects {
 *  @prop prop [string]
 *  @prop selector [string]
 *  @prop all [boolean]
 *  @prop array [boolean]
 * }
 * @param e [object]
 * @param done [function] callback when done recursing through meta and setting e object
 */

/* Module */

const setElements = (meta, e, done = () => {}) => {
  const recursive = (i, array, arrayLength, context = document) => {
    if (i < arrayLength) {
      const m = array[i]
      let all = false
      let convertToArray = false
      let el = null

      if (Object.getOwnPropertyDescriptor(m, 'all')) { all = true }

      if (Object.getOwnPropertyDescriptor(m, 'array')) { convertToArray = true }

      if (all) {
        if (context) { el = context.querySelectorAll(m.selector) }
      } else {
        if (context) { el = context.querySelector(m.selector) }
      }

      if (convertToArray) { el = Array.from(el) }

      e[m.prop] = el

      if (Object.getOwnPropertyDescriptor(m, 'descendants')) {
        recursive(0, m.descendants, m.descendants.length, el)
      }

      recursive(i + 1, array, arrayLength)
    }

    if (i === meta.length - 1) { done() }
  }

  recursive(0, meta, meta.length)
}

/* Exports */

export { setElements }
