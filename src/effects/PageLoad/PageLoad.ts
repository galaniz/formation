// @ts-nocheck

/**
 * Effects - Page Transition
 */

/**
 * Store transitionElement
 *
 * @private
 * @type {HTMLElement}
 */

let _t = null

/**
 * Store delay
 *
 * @private
 * @type {number}
 */

let _d = 150

/**
 * Allow transition to run on click callback
 *
 * @private
 * @type {boolean}
 */

let _run = true

/**
 * Call before show attribute set on transitionElement
 *
 * @private
 * @type {function}
 */

let _b = () => {}

/**
 * Link click prevent url change until delay done
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

  _t.setAttribute('data-page-transition-show', '')

  setTimeout(() => {
    window.location = url
  }, _d)
}

/**
 * Page transition on link click
 *
 * @param {object} args
 * @param {HTMLElement[]} args.links
 * @param {HTMLElement} args.transitionElement
 * @param {number} args.delay
 * @param {boolean|function} args.init
 * @param {boolean|function} args.beforeShow
 * @return {void}
 */

const pageTransition = (args) => {
  const {
    links = [],
    transitionElement = null,
    delay = 150,
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
 * Set run variable to allow/disallow transition
 *
 * @param {boolean} r
 * @return {void}
 */

const setPageTransitionRun = (r) => {
  _run = r
}

/* Exports */

export {
  pageTransition,
  setPageTransitionRun
}
