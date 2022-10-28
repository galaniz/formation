/**
 * Utils: add attr to body if using mouse
 *
 * Source: https://bit.ly/2GpioBO
 */

/* Imports */

import { publish } from './pub-sub'
import { getKey } from './get-key'

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

  /* Prevent keydown delay */

  window.focus()

  /* Check for tabbing to remove attribute */

  body.addEventListener('keydown', (e) => {
    if (getKey(e) === 'TAB') {
      body.removeAttribute('data-using-mouse')
      publish('tabState', [true])
    }
  })
}

/* Exports */

export { usingMouse }
