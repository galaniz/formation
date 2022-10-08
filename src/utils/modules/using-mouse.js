/**
 * Utils: add attr to body if using mouse
 *
 * Source: https://bit.ly/2GpioBO
 */

/* Imports */

import { publish } from './pub-sub'

/* Module */

const usingMouse = () => {
  const body = document.body

  body.setAttribute('data-using-mouse', '')
  publish('tabState', [false])

  /* Mouse is being used */

  body.addEventListener('mousedown', () => {
    body.setAttribute('data-using-mouse', '')
    publish('tabState', [false])
  })

  const tab = [9, 'Tab']

  window.focus() // to prevent keydown delay

  /* Check for tabbing to remove attribute */

  body.addEventListener('keydown', (e) => {
    const key = e.key || e.keyCode || e.which || e.code

    if (tab.indexOf(key) !== -1) {
      body.removeAttribute('data-using-mouse')
      publish('tabState', [true])
    }
  })
}

/* Exports */

export { usingMouse }
