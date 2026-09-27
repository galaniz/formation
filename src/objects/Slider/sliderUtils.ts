/**
 * Objects - Slider Utils
 */

import type { SliderScrollToArgs, SliderScrolledEventDetail } from './SliderTypes.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { config } from '../../config/config.js'

/**
 * Custom event details.
 */
declare global {
  interface ElementEventMap {
    'slider:scrolled': CustomEvent<SliderScrolledEventDetail>
  }
}

/**
 * Sine ease in out.
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
 * Dispatch scrolled event.
 *
 * @private
 * @param {string} source
 * @param {HTMLElement} slider
 * @param {number} currentIndex
 * @param {number} panelIndex
 * @return {number}
 */
const sliderScrolled = (
  source: string,
  slider: HTMLElement,
  currentIndex: number,
  panelIndex: number
): void => {
  const detail: SliderScrolledEventDetail = {
    currentIndex,
    panelIndex,
    source
  }

  slider.dispatchEvent(new CustomEvent('slider:scrolled', { detail }))
}

/**
 * Left offsets of panels, assuming all are the width of the first.
 *
 * @param {HTMLElement|null} track
 * @param {number} count
 * @return {number[]|undefined}
 */
const sliderPanelOffsets = (
  track: HTMLElement | null,
  count: number
): number[] | undefined => {
  const panel = track?.firstElementChild

  if (!track || !isHtmlElement(panel)) {
    return
  }

  const style = getComputedStyle(track)
  const gap = parseFloat(style.columnGap)
  const padding = parseFloat(style.scrollPaddingLeft)

  const panelWidth = panel.getBoundingClientRect().width // Subpixel width, offsetWidth drift accumulates
  const panelLeft = panel.offsetLeft
  const trackGap = !isNumber(gap) ? 0 : gap
  const trackPadding = !isNumber(padding) ? 0 : padding

  return Array.from({ length: count }, (_, i) => {
    return panelLeft - trackPadding + i * (panelWidth + trackGap)
  })
}

/**
 * Index of offset closest to scroll position, or -1 if no offsets.
 *
 * @param {number[]} offsets
 * @param {number} target
 * @return {number}
 */
const sliderClosestIndex = (offsets: number[], target: number): number => {
  let index = -1
  let closest = 0

  offsets.forEach((offset, i) => {
    const distance = Math.abs(offset - target)

    if (index === -1 || distance < closest) {
      index = i
      closest = distance
    }
  })

  return index
}

/**
 * Move track immediately or smoothly.
 *
 * @param {SliderScrollToArgs} args
 * @return {void}
 */
const sliderScrollTo = (args: SliderScrollToArgs): void => {
  /* Args */

  const {
    to,
    source,
    animRef,
    track,
    slider,
    duration,
    currentIndex,
    panelIndex
  } = args

  /* Cancel any ongoing animation */

  cancelAnimationFrame(animRef.id)

  /* Track required */

  if (!isHtmlElement(track)) {
    return
  }

  /* Move immediately if reduce motion, init or resize */

  if (config.reduceMotion || source !== 'click') {
    track.scrollLeft = to
    sliderScrolled(source, slider, currentIndex, panelIndex)
    return
  }

  /* Initial animation values */

  let start: DOMHighResTimeStamp | undefined
  let done = false

  track.style.setProperty('scroll-snap-type', 'none')
  track.style.setProperty('overscroll-behavior', 'none')

  const from = track.scrollLeft
  const dir = to > from ? 'right' : 'left'
  const change = to - from

  /* Move smoothly to new position */

  const animate = (timestamp: DOMHighResTimeStamp): void => {
    if (!track.isConnected) {
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
      track.scrollLeft = to // Exact target before snap is restored

      track.style.removeProperty('scroll-snap-type')
      track.style.removeProperty('overscroll-behavior')

      sliderScrolled(source, slider, currentIndex, panelIndex)
    } else {
      animRef.id = requestAnimationFrame(animate)
    }
  }

  animRef.id = requestAnimationFrame(animate)
}

export {
  sliderEase,
  sliderPanelOffsets,
  sliderClosestIndex,
  sliderScrollTo
}
