/**
 * Effects: page transition on link click
 *
 * @param {array} links
 * @param {HTMLElement} transitionElement
 * @param {int} delay
 * @param {boolean/function} init
 * @param {boolean/function} beforeShow
 */

/* Variables */

let t = null
let d = 800
let run = true
let b = () => {}

/* Event handlers */

const clickHandler = (e) => {
  e.preventDefault()

  if (!run) { return }

  const url = e.currentTarget.href

  b()

  t.setAttribute('data-show', 'true')

  setTimeout(() => {
    window.location = url
  }, d)
}

/* Modules */

const pageTransition = (args) => {
  const {
    links = [],
    transitionElement = null,
    delay = 800,
    init = false,
    beforeShow = false
  } = args

  if (!links || !transitionElement) { return }

  t = transitionElement
  d = delay

  if (beforeShow) { b = beforeShow }

  links.forEach((link) => {
    if (link.href.indexOf('#') === -1) { link.addEventListener('click', clickHandler) }
  })

  if (init) { init() }
}

const setPageTransitionRun = (r) => {
  run = r
}

/* Exports */

export { pageTransition, setPageTransitionRun }
