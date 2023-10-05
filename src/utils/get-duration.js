/**
 * Utils - get duration
 */

/**
 * Function - get duration from seconds in time or words
 *
 * @param {number} seconds
 * @param {boolean} words
 * @return {string}
 */

const getDuration = (seconds = 0, words = false) => {
  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds - (hours * 3600)) / 60)

  seconds = seconds - (hours * 3600) - (min * 60)

  let t = ''

  if (!words) {
    if (hours) {
      t += (hours < 10 && hours > 0 ? '0' : '') + hours + ':'
    }

    t += (hours && min < 10 ? '0' : '') + min + ':'

    t += (seconds < 10 ? '0' : '') + seconds
  } else {
    if (hours) {
      t += hours + (hours > 1 ? ' hours' : ' hour') + (min ? ' ' : '')
    }

    if (min) {
      t += min + (min > 1 ? ' minutes' : ' minute') + (seconds ? ' ' : '')
    }

    if (seconds) {
      t += seconds + (seconds > 1 ? ' seconds' : ' second')
    }
  }

  return t
}

/* Exports */

export { getDuration }
