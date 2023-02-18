/**
 * Utils - prefix
 */

/**
 * Function - prefix transition or transform props on element
 *
 * @param {string} type - transition || transform || transformOrigin || transitionDelay
 * @param {HTMLElement} item
 * @param {string} value - property value
 * @return {void}
 */

const prefix = (type, item, value) => {
  if (!type || !item || !value) {
    return
  }

  const typePrefixes = {
    transform () {
      item.style.webkitTransform = value
      item.style.MozTransform = value
      item.style.msTransform = value
      item.style.OTransform = value
      item.style.transform = value
    },
    transformOrigin () {
      item.style.webkitTransformOrigin = value
      item.style.MozTransformOrigin = value
      item.style.msTransformOrigin = value
      item.style.OTransformOrigin = value
      item.style.transformOrigin = value
    },
    transition () {
      item.style.webkitTransition = value
      item.style.MozTransition = value
      item.style.msTransition = value
      item.style.OTransition = value
      item.style.transition = value
    },
    transitionDelay () {
      item.style.webkitTransitionDelay = value
      item.style.MozTransitionDelay = value
      item.style.msTransitionDelay = value
      item.style.OTransitionDelay = value
      item.style.transitionDelay = value
    }
  }

  typePrefixes[type]()
}

/* Exports */

export { prefix }
