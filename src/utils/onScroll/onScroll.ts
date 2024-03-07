/**
 * Utils - On Scroll
 */

/* Imports */

import { actions, addAction, doActions } from '../actions/actions'

/**
 * Function - run actions on scroll event
 *
 * @param {function} action
 * @param {number} [delay=10]
 * @return {void}
 */
const onScroll = (action: Function, delay: number = 10): void => {
  /* Add to scroll action */

  addAction('scroll', action)

  /* Throttle scroll with timeout */

  let scrollTimeoutId = 0

  /* Scroll callback if actions */

  const scroll = (): void => {
    if (actions.scroll.length === 0) {
      window.removeEventListener('scroll', scroll)
    }

    clearTimeout(scrollTimeoutId)

    scrollTimeoutId = window.setTimeout(() => {
      doActions('scroll')
    }, delay)
  }

  /* Scroll listener */

  window.addEventListener('scroll', scroll)
}

/* Exports */

export { onScroll }
