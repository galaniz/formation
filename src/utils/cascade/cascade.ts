/**
 * Utils - Cascade
 */

/**
 * @method Action
 * @param {number} index
 * @param {number} repeatIndex
 * @param {function} [recur] - Hold off recursion until function call
 * @return {void}
 */

type Action = (index: number, repeatIndex: number, recur: Function) => void

/**
 * @typedef {object} Event
 * @prop {Action} action
 * @prop {number} [delay=0] - Value to delay action by in milliseconds
 * @prop {number} [increment=0] - Value to increase delay by
 */

interface Event {
  action: Action
  delay?: number
  increment?: number
}

/**
 * Function - sequentially and recursively call and delay functions
 *
 * @param {Event[]} events
 * @param {number} [repeat=0]
 * @return {void}
 */

const cascade = (events: Event[], repeat: number = 0): void => {
  const eventsLength = events.length - 1

  let increment = 0
  let delay = 0
  let timeoutId = 0

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

    /* Event object */

    const event = events[i]

    /* Set delay and increment values */

    const {
      delay: eventDelay = delay,
      increment: eventIncrement,
      action
    } = event

    if (eventIncrement !== undefined) {
      if (increment === 0 && eventDelay > 0) {
        delay = eventDelay
      }

      increment = eventIncrement
    } else {
      delay = eventDelay
    }

    /* Run action */

    const run = (tId: number): void => {
      /* Check action is a function */

      if (typeof action !== 'function') {
        return
      }

      /* Wait to recurse if recur param */

      if (action.length === 3) {
        action(i, j, () => {
          recurse(i + 1, j)
        })
      } else {
        action(i, j, () => {})

        recurse(i + 1, j)
      }

      /* Clear */

      clearTimeout(tId)
    }

    timeoutId = window.setTimeout(() => {
      run(timeoutId)
    }, delay)

    /* Augment delay */

    delay += increment
  }

  /* Init */

  recurse(0, 0)
}

/* Exports */

export { cascade }
