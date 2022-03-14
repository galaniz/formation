/**
 * Utility modules: remove class(es) from element
 *
 * @param item [HTMLElement]
 * @param classes [string] of classes separated by space
 */

/* Module */

const removeClass = (item, classes) => {
  if (!item || !classes) { return }

  const currentClasses = item.className.split(' ')
  classes = classes.split(' ')

  classes.forEach((c) => {
    const classPos = currentClasses.indexOf(c)

    if (classPos !== -1) { currentClasses.splice(classPos, 1) }
  })

  item.className = currentClasses.join(' ')
}

/* Exports */

export { removeClass }
