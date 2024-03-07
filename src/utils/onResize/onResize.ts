/**
 * Utils - On Resize
 */

/* Imports */

import { actions, addAction, doActions } from '../actions/actions'

/**
 * Function - run actions on resize event
 *
 * @param {function} action
 * @param {number} [delay=100]
 * @return {void}
 */
const onResize = (action: Function, delay: number = 100): void => {
  /* Add to resize action */

  addAction('resize', action)

  /* Throttle resize with timeout */

  let resizeTimeoutId = 0

  /* Resize callback if actions */

  const resize = (): void => {
    if (actions.resize.length === 0) {
      window.removeEventListener('resize', resize)
    }

    clearTimeout(resizeTimeoutId)

    resizeTimeoutId = window.setTimeout(() => {
      doActions('resize')
    }, delay)
  }

  /* Resize listener */

  window.addEventListener('resize', resize)
}

/* Exports */

export { onResize }
