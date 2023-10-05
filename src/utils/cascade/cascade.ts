/**
 * Utils - Cascade
 */

/**
 * Function - sequentially and recursively call and delay functions
 *
 * @param {object[]} events
 * @param {function} events[].action - With optional callback
 * @param {number} [event[].delay]
 * @param {number} [events[].increment]
 * @param {number} [repeat=1]
 * @return {void}
 */

interface Event {
  action: Function
  delay?: number
  increment?: number
}

const cascade = (events: Event[], repeat: number = 1): void => {
  const eventsLength = events.length

  let increment = 0
  let delay = 0

  for (let j = 0; j < repeat; j += 1) {
    const recursive = (i: number): void => {
      if (i < eventsLength) {
        const event = events[i]
        const eventDelay = event.delay !== undefined ? event.delay : delay

        if (event.increment !== undefined) {
          if (increment === 0 && eventDelay > 0) {
            delay = eventDelay
          }

          increment = event.increment
        } else {
          delay = eventDelay
        }

        setTimeout(() => {
          const indexArg = repeat > 1 ? j : i

          /* Check if contains two args (second arg is done callback) */

          if (event.action.length === 2) {
            event.action(indexArg, () => {
              recursive(i + 1)
            })
          } else {
            event.action(indexArg)
            recursive(i + 1)
          }
        }, delay)

        delay += increment
      }
    }

    recursive(0)
  }
}

/* Exports */

export { cascade }
