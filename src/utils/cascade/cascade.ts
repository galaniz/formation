/**
 * Utils - Cascade
 */

/* Imports */

import type { CascadeEvent } from './cascadeTypes'
import { isObjectStrict } from '../isObject/isObject'
import { isFunction } from '../isFunction/isFunction'
import { isNumber } from '../isNumber/isNumber'

/**
 * More precise set timeout with requestAnimationFrame
 *
 * @private
 * @param {function} action
 * @param {number} delay
 * @return {void}
 */
const _requestTimeout = (action: Function, delay: number): void => {
  /* Starting values */

  const start = performance.now()
  let requestId = 0

  /* Callback  */

  const loop = (timestamp: DOMHighResTimeStamp): void => {
    /* Clear previous request */

    cancelAnimationFrame(requestId)

    /* Check time passed */

    const elapsed = timestamp - start

    /* Run action when delay is up */

    if (elapsed >= delay) {
      action()
      return
    }

    /* Continue loop */

    requestId = requestAnimationFrame(loop)
  }

  /* Init */

  requestId = requestAnimationFrame(loop)
}

/**
 * Sequentially and recursively call and delay functions
 *
 * @param {import('./cascadeTypes').CascadeEvent[]} events
 * @param {number} [repeat=0]
 * @return {void}
 */
const cascade = (events: CascadeEvent[], repeat: number = 0): void => {
  /* Store number of events */

  const eventsLength = events.length - 1

  /* Store increment */

  let increment = 0

  /* Loop through events */

  const recurse = (i: number, j: number): void => {
    /* Repeat */

    if (i === eventsLength && j < repeat) {
      i = 0
      j += 1
    }

    /* No more events */

    if (i > eventsLength) {
      return
    }

    /* Default delay */

    let delay = 0

    /* Event object */

    const event = events[i]

    if (!isObjectStrict(event)) {
      recurse(i + 1, j) // Continue
      return
    }

    const {
      delay: eventDelay,
      increment: eventIncrement,
      action
    } = event

    /* Action required */

    if (!isFunction(action)) {
      recurse(i + 1, j) // Continue
      return
    }

    /* Set delay and increment values */

    if (isNumber(eventIncrement)) {
      increment = eventIncrement
    }

    if (isNumber(eventDelay)) {
      delay = eventDelay
    }

    /* Run action */

    _requestTimeout(() => {
      if (action.length === 3) { // Hold off on recursion if doRecurse param exists
        action(i, j, () => {
          recurse(i + 1, j)
        })
      } else {
        action(i, j, () => {})
        recurse(i + 1, j)
      }
    }, delay + increment)
  }

  /* Init */

  recurse(0, 0)
}

/* Exports */

export { cascade }
