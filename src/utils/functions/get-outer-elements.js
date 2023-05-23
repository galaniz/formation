/**
 * Utils - get outer elements
 */

/**
 * Function - recursively get elements outside of specified element
 *
 * @param {HTMLElement} item
 * @param {string} type - all || prev || next
 * @param {function} filter
 * @param {array<HTMLElement>} _store
 * @return {array<HTMLElement>}
 */

const getOuterElements = (item = null, type = 'all', filter, _store = []) => {
  if (!item) {
    return
  }

  const parent = item.parentElement

  if (!parent) {
    return
  }

  const children = Array.from(parent.children)

  if (!children.length) {
    return
  }

  const itemIndex = children.indexOf(item)

  const siblings = children.filter((c, i) => {
    let condition = c !== item && c.tagName !== 'SCRIPT' && c.tagName !== 'HEAD'

    if (type === 'next') {
      condition = condition && i > itemIndex
    }

    if (type === 'prev') {
      condition = condition && i < itemIndex
    }

    return condition
  })

  if (siblings.length) {
    _store = _store.concat(type === 'prev' ? siblings.reverse() : siblings)
  }

  if (typeof filter === 'function') {
    const res = filter(_store)
    const { store, stop } = res

    if (store) {
      _store = store
    }

    if (stop === true) {
      return _store
    }
  }

  if (parent.parentElement) {
    return getOuterElements(parent, type, filter, _store)
  }

  return _store
}

/* Exports */

export { getOuterElements }
