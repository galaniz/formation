/**
 * Utility modules: add class(es) to element
 *
 * @param item [HTMLElement]
 * @param classes [string] of classes separated by space
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
