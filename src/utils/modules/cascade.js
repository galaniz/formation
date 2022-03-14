/**
 * Utility modules: call functions sequentially & with delay
 *
 * @param events [array] of objects {
 *  @prop action [function] with optional callback
 *  @prop delay [int]
 *  @prop increment [int]
 * }
 * @param repeat [int]
 */

/* Module */

const cascade = (events, repeat = 1) => {
  const eventsLength = events.length
  let increment = 0
  let delay = 0

  for (let j = 0; j < repeat; j++) {
    const recursive = (i) => {
      if (i < eventsLength) {
        const event = events[i]
        const eventDelay = Object.getOwnPropertyDescriptor(event, 'delay') ? event.delay : delay

        if (Object.getOwnPropertyDescriptor(event, 'increment')) {
          if (!increment && eventDelay) { delay = eventDelay }

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
