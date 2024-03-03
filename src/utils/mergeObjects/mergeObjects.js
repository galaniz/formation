/**
 * Utils - Merge Objects
 */

/**
 * Function - merge two objects up to one nested level deep
 *
 * @param {object} x
 * @param {object} y - overwrite x values
 * @return {object} x
 */

const mergeObjects = (x, y) => {
  Object.keys(y || {}).forEach((i) => {
    /* If not null or an html element and an object run again */

    if (y[i] !== undefined &&
      y[i] !== false &&
      y[i] !== null &&
      !Array.isArray(y[i]) &&
      typeof (y[i]) === 'object' &&
      !(y[i] instanceof window.HTMLElement) &&
      !(y[i] instanceof window.HTMLCollection) &&
      !(y[i] instanceof window.NodeList) &&
      !(y[i] instanceof window.SVGElement)) {
      if (Object.getOwnPropertyDescriptor(x, i)) {
        x[i] = Object.assign(x[i], y[i])
      }
    } else {
      if (Object.getOwnPropertyDescriptor(x, i)) {
        x[i] = y[i]
      }
    }
  })

  return x
}

/* Exports */

export { mergeObjects }
