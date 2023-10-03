/**
 * Objects - Slider Init
 */

/* Imports */

import { setItems } from '../../../utils'
import Slider from './Slider'

/**
 * Function - initialize Slider class
 *
 * @param {HTMLElement} context
 * @return {void}
 */

const SliderInit = (context = document) => {
  /**
   * Store DOM elements
   */

  const sliders = setItems([
    {
      context: '.o-slider',
      main: '.o-slider__main',
      track: '.o-slider__track',
      panels: [
        '[role="tabpanel"]'
      ],
      items: [
        '.o-slider__item'
      ],
      nav: [
        '[role="tab"]'
      ],
      prev: '.o-slider__prev',
      next: '.o-slider__next'
    }
  ], context)

  /* */

  const slider = (args) => {
    return new Slider(args)
  }

  /* */

  if (sliders.length > 0) {
    sliders.forEach((s) => {
      const container = s.context
      const args = {
        tabs: s.nav,
        panels: s.panels,
        container,
        slider: s.main,
        track: s.track,
        targetHeight: s.track,
        prev: s.prev,
        next: s.next,
        duration: 500
        // reduceMotion: settings.reduceMotion
      }

      const loop = container.getAttribute('data-slider-loop') === 'true'
      const type = container.getAttribute('data-slider-type')

      if (loop) {
        args.loop = true
      }

      if (type === 'group') {
        args.groupItems = s.items
        args.groupSelector = '.o-slider__items'

        const breakpoints = container.getAttribute('data-slider-items')

        if (typeof breakpoints === 'string') {
          const breakpointsArray = breakpoints.split(',')

          if (breakpointsArray.length) {
            const bk = [0, 600, 900, 1200]

            args.breakpoints = breakpointsArray.map((items, i) => {
              return {
                breakpoint: bk[i],
                items: parseInt(items)
              }
            })
          }
        }
      }

      if (type === 'flex') {
        args.variableWidths = true
      }

      slider(args)
    })
  }
}

/* Exports */

export { SliderInit }
