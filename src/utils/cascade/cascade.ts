/**
 * Utils - Cascade
 */

/* Imports */

import type { CascadeEvent } from './cascadeTypes.js'
import type { GenericFunction } from '../../global/globalTypes.js'
import { isObjectStrict } from '../object/object.js'
import { isFunction } from '../function/function.js'
import { isNumber } from '../number/number.js'

/**
 * More precise set timeout with requestAnimationFrame.
 *
 * @private
 * @param {GenericFunction} action
 * @param {number} delay
 * @return {void}
 */
const requestTimeout = (action: GenericFunction, delay: number): void => {
  /* Starting values */

  const start = performance.now()
  let requestId = 0

  /* Callback  */

  const loop = (timestamp: DOMHighResTimeStamp): void => {
    /* Clear previous request */

    cancelAnimationFrame(requestId)

    /* Check time passed */

    const elapsed = timestamp - start

    /* Run action after delay */

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
 * Sequentially and recursively call and delay functions.
 *
 * @param {CascadeEvent[]} events
 * @param {number} [repeat=0]
 * @return {void}
 */
const cascade = (events: CascadeEvent[], repeat = 0): void => {
  /* Number of events */

  const eventsLength = events.length - 1

  /* Increment */

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

    /* Delay and increment values */

    if (isNumber(eventIncrement)) {
      increment = eventIncrement
    }

    if (isNumber(eventDelay)) {
      delay = eventDelay
    }

    /* Run action */

    requestTimeout(() => {
      if (action.length === 3) { // Hold off on recursion if waitUntil param exists
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
