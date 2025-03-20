/**
 * Objects - Slider Utils
 */

/* Imports */

import type { SliderAnimRef } from './SliderTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { config } from '../../config/config.js'

/**
 * Sine ease in out
 *
 * @private
 * @param {number} elapsed
 * @param {number} from
 * @param {number} change
 * @param {number} duration
 * @return {number}
 */
const sliderEase = (elapsed: number, from: number, change: number, duration: number): number => {
  return -change / 2 * (Math.cos(Math.PI * elapsed / duration) - 1) + from
}

/**
 * Move track immediately or smoothly
 *
 * @param {number} to
 * @param {string} source
 * @param {SliderAnimRef} animRef
 * @param {HTMLElement|null} track
 * @param {number} duration
 * @return {void}
 */
const sliderScrollTo = (
  to: number,
  source: string,
  animRef: SliderAnimRef,
  track: HTMLElement | null,
  duration: number
): void => {
  /* Cancel any ongoing animation */

  cancelAnimationFrame(animRef.id)

  /* Track required */

  if (!isHtmlElement(track)) {
    return
  }

  /* Move immediately if reduce motion, init or resize */

  if (config.reduceMotion || source !== 'click') {
    track.scrollLeft = to
    return
  }

  /* Initial animation values */

  let start: DOMHighResTimeStamp | undefined
  let done = false

  track.style.scrollSnapType = 'none'
  track.style.overscrollBehavior = 'none'

  const from = track.scrollLeft
  const dir = to > from ? 'right' : 'left'
  const change = to - from

  /* Move smoothly to new position */

  const animate = (timestamp: DOMHighResTimeStamp): void => {
    if (!isHtmlElement(track)) {
      cancelAnimationFrame(animRef.id)
      return
    }

    if (!isNumber(start)) {
      start = timestamp
    }

    const elapsed = timestamp - start

    if (elapsed < duration) {
      const v = sliderEase(elapsed, from, change, duration)

      track.scrollLeft = v

      if ((dir === 'right' && v >= to) || (dir === 'left' && v <= to)) {
        done = true
      }
    } else {
      done = true
    }

    if (done) {
      track.style.scrollSnapType = ''
      track.style.overscrollBehavior = ''
    } else {
      animRef.id = requestAnimationFrame(animate)
    }
  }

  animRef.id = requestAnimationFrame(animate)
}

/* Exports */

export {
  sliderEase,
  sliderScrollTo
}
