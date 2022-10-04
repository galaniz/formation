/**
 * Utils: show/hide html element
 *
 * @param {HTMLElement} item
 * @param {boolean} show
 */

/* Module */

const show = (item, show = true) => {
  if (!item) { return }

  const display = show ? 'block' : 'none'

  item.style.display = display
}

/* Exports */

export { show }
