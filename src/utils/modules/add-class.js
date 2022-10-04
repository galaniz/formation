/**
 * Utils: add class(es) to element
 *
 * @param {HTMLElement} item
 * @param {string} classes - classes separated by space
 */

/* Module */

const addClass = (item, classes) => {
  if (!item || !classes) { return }

  let currentClasses = item.className

  if (currentClasses) {
    classes = classes.split(' ')
    currentClasses = currentClasses.split(' ')

    classes.forEach((c) => {
      const classPos = currentClasses.indexOf(c)

      /* Only add if doesn't exist */

      if (classPos === -1) { currentClasses.splice(classPos, 0, c) }
    })

    item.className = currentClasses.join(' ')
  } else {
    item.setAttribute('class', classes)
  }
}

/* Exports */

export { addClass }
