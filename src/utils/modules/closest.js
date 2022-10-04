/**
 * Utils: traverse up DOM until find element with class
 *
 * @param {HTMLElement} item
 * @param {string} className
 */

/* Imports */

import { hasClass } from './has-class'

/* Module */

const closest = (item, className, max = 10) => {
  if (!item || !className) { return }

  let parent = item.parentElement
  let counter = 0

  while (hasClass(parent, className) === false) {
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
