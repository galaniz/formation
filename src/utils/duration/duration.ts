/**
 * Utils - Duration
 */

/* Imports */

import { isNumber } from '../number/number.js'
import { config } from '../../config/config.js'

/**
 * Convert seconds to text (time or words).
 *
 * @param {number} [seconds=0]
 * @param {boolean} [words=false]
 * @return {string}
 */
const getDuration = (seconds: number = 0, words: boolean = false): string => {
  /* Hours and min for formatting */

  if (!isNumber(seconds)) {
    seconds = 0
  }

  const hours = Math.floor(seconds / 3600)
  const min = Math.floor((seconds - (hours * 3600)) / 60)

  seconds = seconds - (hours * 3600) - (min * 60)

  /* Output */

  let t = ''

  /* Time format */

  if (!words) {
    if (hours > 0) {
      t += `${hours < 10 && hours > 0 ? '0' : ''}${hours}:`
    }

    t += `${hours > 0 && min < 10 ? '0' : ''}${min}:`
    t += `${seconds < 10 ? '0' : ''}${seconds}`

    return t
  }

  /* Words format */

  const {
    hours: hoursLabel = 'hours',
    hour: hourLabel = 'hour',
    minutes: minutesLabel = 'minutes',
    minute: minuteLabel = 'minute',
    seconds: secondsLabel = 'seconds',
    second: secondLabel = 'second'
  } = config.labels

  if (hours > 0) {
    t += `${hours} ${hours > 1 ? hoursLabel : hourLabel}${min > 0 ? ' ' : ''}`
  }

  if (min > 0) {
    t += `${min} ${min > 1 ? minutesLabel : minuteLabel}${seconds > 0 ? ' ' : ''}`
  }

  if (seconds > 0) {
    t += `${seconds} ${seconds > 1 ? secondsLabel : secondLabel}`
  }

  return t
}

/* Exports */

export { getDuration }
