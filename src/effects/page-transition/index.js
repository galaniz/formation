/**
 * Effects - page transition
 */

/**
 * Store transitionElement
 *
 * @type {HTMLElement}
 * @private
 */

let _t = null

/**
 * Store delay
 *
 * @type {number}
 * @private
 */

let _d = 800

/**
 * Allow transition to run on click callback
 *
 * @type {boolean}
 * @private
 */

let _run = true

/**
 * Call before show attribute set on transitionElement
 *
 * @type {function}
 * @private
 */

let _b = () => {}

/**
 * Function - link click prevent url change until delay done
 *
 * @private
 * @param {object} e
 * @return {void}
 */

const _clickHandler = (e) => {
  e.preventDefault()

  if (!_run) {
    return
  }

  const url = e.currentTarget.href

  _b()

  _t.setAttribute('data-show', 'true')

  setTimeout(() => {
    window.location = url
  }, _d)
}

/**
 * Function - page transition on link click
 *
 * @param {object} args {
 *  @prop {array<HTMLElement>} links
 *  @prop {HTMLElement} transitionElement
 *  @prop {number} delay
 *  @prop {boolean|function} init
 *  @prop {boolean|function} beforeShow
 * }
 * @return {void}
 */

const pageTransition = (args) => {
  const {
    links = [],
    transitionElement = null,
    delay = 800,
    init = false,
    beforeShow = false
  } = args

  if (!links || !transitionElement) {
    return
  }

  _t = transitionElement
  _d = delay

  if (beforeShow) {
    _b = beforeShow
  }

  links.forEach((link) => {
    if (link.href.indexOf('#') === -1) {
      link.addEventListener('click', _clickHandler)
    }
  })

  if (init) {
    init()
  }
}

/**
 * Function - set run variable to allow/disallow transition
 *
 * @param {boolean} r
 * @return {void}
 */

const setPageTransitionRun = (r) => {
  _run = r
}

/* Exports */

export { pageTransition, setPageTransitionRun }
