/**
 * Utils - Closest
 */

/**
 * Function - check item is an HTML element and contains classes
 *
 * @private
 * @param {HTMLElement} item
 * @param {string} classes
 * @return {boolean}
 */

const _itemCheck = (item: HTMLElement | null, classes: string): boolean => {
  if (!(item instanceof HTMLElement) || typeof classes !== 'string' || classes === '') {
    return false
  }

  return !item.classList.contains(classes)
}

/**
 * Function - traverse up DOM until find element with class
 *
 * @param {HTMLElement} item
 * @param {string} classes
 * @param {number} [max=10]
 * @return {HTMLElement|undefined}
 */

const closest = (item: HTMLElement, classes: string, max: number = 10): HTMLElement | undefined => {
  if (!(item instanceof HTMLElement) || typeof classes !== 'string' || classes === '') {
    return
  }

  let parent = item.parentElement
  let counter = 0

  while (_itemCheck(parent, classes)) {
    if (parent !== null) {
      parent = parent.parentElement
    }

    counter += 1

    if (counter === max) {
      break
    }
  }

  if (parent === null) {
    return
  }

  return parent
}

/* Exports */

export { closest }
