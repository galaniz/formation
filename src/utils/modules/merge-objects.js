/**
 * Utils: merge objects only one nested level deep
 *
 * @dependency Object.assign()
 *
 * @param {object} x
 * @param {object} y - overwrite x values
 *
 * @return {object} x
 */

/* Module */

const mergeObjects = (x, y) => {
  for (const i in y) {
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
      if (Object.getOwnPropertyDescriptor(x, i)) { x[i] = y[i] }
    }
  }

  return x
}

/* Exports */

export { mergeObjects }
