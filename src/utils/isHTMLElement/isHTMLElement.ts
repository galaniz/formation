/**
 * Utils - Is HTML Element
 */

/**
 * Function - check if value is an HTML element
 *
 * @param {*} value
 * @return {boolean}
 */

const isHTMLElement = (value: any): value is HTMLElement => {
  if (value === null || value === undefined) {
    return false
  }

  return value.nodeType === Node.ELEMENT_NODE
}

/* Exports */

export { isHTMLElement }
