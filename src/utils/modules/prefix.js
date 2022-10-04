/**
 * Utils: prefix transition or transform props on element
 *
 * @param {string} type - 'transition', 'transform', 'transformOrigin', 'transitionDelay'
 * @param {HTMLElement} item
 * @param {string} val - property value
 */

/* Module */

const prefix = (type, item, val) => {
  if (!type || !item || !val) { return }

  const typePrefixes = {
    transform () {
      item.style.webkitTransform = val
      item.style.MozTransform = val
      item.style.msTransform = val
      item.style.OTransform = val
      item.style.transform = val
    },
    transformOrigin () {
      item.style.webkitTransformOrigin = val
      item.style.MozTransformOrigin = val
      item.style.msTransformOrigin = val
      item.style.OTransformOrigin = val
      item.style.transformOrigin = val
    },
    transition () {
      item.style.webkitTransition = val
      item.style.MozTransition = val
      item.style.msTransition = val
      item.style.OTransition = val
      item.style.transition = val
    },
    transitionDelay () {
      item.style.webkitTransitionDelay = val
      item.style.MozTransitionDelay = val
      item.style.msTransitionDelay = val
      item.style.OTransitionDelay = val
      item.style.transitionDelay = val
    }
  }

  typePrefixes[type]()
}

/* Exports */

export { prefix }
