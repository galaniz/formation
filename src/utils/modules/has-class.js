/**
 * Utils: check if element contains class(es)
 *
 * @param {HTMLElement} item
 * @param {string} classes - separated by space
 * @param {boolean} all - contains all classes
 */

/* Module */

const hasClass = (item, classes, all = true) => {
  if (!item || !classes) { return }

  const currentClasses = item.className.split(' ')
  let hasClasses = all
  classes = classes.split(' ')

  classes.forEach((c) => {
    const classPos = currentClasses.indexOf(c)

    if (all) {
      if (classPos === -1) {
        hasClasses = false
      }
    } else {
      if (classPos !== -1) {
        hasClasses = true
      }
    }
  })

  return hasClasses
}

/* Exports */

export { hasClass }
