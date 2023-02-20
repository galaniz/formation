/**
 * Utils - closest
 */

/**
 * Function - check item not null and contains classes
 *
 * @param {HTMLElement} item
 * @param {string} classes
 * @return {HTMLElement|null}
 */

const _itemCheck = (item, classes) => {
  if (!item || !classes) {
    return
  }

  return !item.classList.contains(classes)
}

/**
 * Function - traverse up DOM until find element with class
 *
 * @param {HTMLElement} item
 * @param {string} classes
 * @param {number} max
 * @return {HTMLElement|boolean}
 */

const closest = (item, classes, max = 10) => {
  if (!item || !classes) {
    return
  }

  let parent = item.parentElement
  let counter = 0

  while (_itemCheck(parent, classes)) {
    parent = parent.parentElement
    counter++

    if (counter === max) {
      parent = false
      break
    }
  }

  return parent
}

/* Exports */

export { closest }
