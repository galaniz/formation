/**
 * Utils: loop through object recursively
 *
 * @param {object} obj
 * @param {boolean/function} callback - if function pass property and value
 * @param {function} condition - returns boolean
 */

/* Module */

const recurseObject = (obj, callback = false, condition = () => true) => {
  for (const o in obj) {
    if (condition(o, obj[o]) &&
      obj[o] !== null &&
      typeof (obj[o]) === 'object' &&
      !(obj[o] instanceof window.HTMLElement) &&
      !(obj[o] instanceof window.HTMLCollection) &&
      !(obj[o] instanceof window.NodeList) &&
      !(obj[o] instanceof window.SVGElement)) {
      recurseObject(obj[o], callback, condition)
    } else {
      if (condition(o, obj[o]) && callback) { callback(o, obj[o]) }
    }
  }
}

/* Exports */

export { recurseObject }
