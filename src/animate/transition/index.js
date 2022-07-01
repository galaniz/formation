/**
 * Animate: transition page on link click
 *
 * @param links [array] of [HTMLElement]
 * @param transitionElement [HTMLElement]
 * @param delay [int]
 * @param init [boolean] or [function]
 * @param beforeShow [boolean] or [function]
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

const transition = (args) => {
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

const setTransitionRun = (r) => {
  run = r
}

/* Exports */

export { transition, setTransitionRun }
