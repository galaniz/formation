/**
 * Utils - closest
 */

/**
 * Function - traverse up DOM until find element with class
 *
 * @param {HTMLElement} item
 * @param {string} className
 * @param {number} max
 * @return {HTMLElement}
 */

const closest = (item, className, max = 10) => {
  if (!item || !className) {
    return
  }

  let parent = item.parentElement
  let counter = 0

  while (!parent.classList.contains(className)) {
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
