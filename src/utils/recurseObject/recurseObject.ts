// @ts-nocheck

/**
 * Utils - Recurse Object
 */

/**
 * Function - recurse through object if condition met otherwise run callback
 *
 * @param {object} obj
 * @param {boolean|function} callback - if function pass property and value
 * @param {function} condition - returns boolean
 * @return {void}
 */

const recurseObject = (obj, callback = false, condition = () => true) => {
  Object.keys(obj || {}).forEach((o) => {
    if (condition(o, obj[o]) &&
      obj[o] !== null &&
      typeof (obj[o]) === 'object' &&
      !(obj[o] instanceof window.HTMLElement) &&
      !(obj[o] instanceof window.HTMLCollection) &&
      !(obj[o] instanceof window.NodeList) &&
      !(obj[o] instanceof window.SVGElement)) {
      recurseObject(obj[o], callback, condition)
    } else {
      if (condition(o, obj[o]) && callback) {
        callback(o, obj[o])
      }
    }
  })
}

/* Exports */

export { recurseObject }
