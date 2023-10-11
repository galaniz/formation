/**
 * Utils - Cascade
 */

/**
 * @method Action
 * @param {number} index
 * @param {function} [resume] - Hold off recursion
 * @return {void}
 */

type Action = (index: number, resume?: Function) => void

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
 * @param {number} [repeat=1]
 * @return {void}
 */

const cascade = (events: Event[], repeat: number = 1): void => {
  const eventsLength = events.length

  let increment = 0
  let delay = 0

  for (let j = 0; j < repeat; j += 1) {
    const recurse = (i: number): void => {
      if (i < eventsLength) {
        const event = events[i]

        /* Set delay and increment values */

        const {
          delay: eventDelay = 0,
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

        setTimeout(() => {
          const index = repeat > 1 ? j : i

          /* Check action is a function */

          if (typeof action !== 'function') {
            return
          }

          /* Wait to recurse if resume param */

          if (action.length === 2) {
            action(index, () => {
              recurse(i + 1)
            })
          } else {
            action(index)
            recurse(i + 1)
          }
        }, delay)

        delay += increment
      }
    }

    recurse(0)
  }
}

/* Exports */

export { cascade }
