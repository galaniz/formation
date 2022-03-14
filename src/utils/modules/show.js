/**
 * Utility modules: show/hide html element
 *
 * @param item [HTMLElement]
 * @param show [boolean]
 */

/* Module */

const show = (item, show = true) => {
  if (!item) { return }

  const display = show ? 'block' : 'none'

  item.style.display = display
}

/* Exports */

export { show }
