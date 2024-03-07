/**
 * Objects - Slider Single Example
 */

/* Imports */

import { renderHtmlString } from '../../../utils'
import { SliderHtml } from '../Slider/SliderHtml'
import { SliderSlideHtml } from '../SliderSlide/SliderSlideHtml'
// import { SliderSlideContentHtml } from '../SliderSlideContent/SliderSlideContentHtml'
import { SliderInit } from '../Slider/SliderInit'
import '../../../formation/Formation.scss'
import '../Slider/Slider.scss'

/* */

const SliderSingleExample = () => {
  const div = document.createElement('div')

  /* Wait until inserted into DOM to initialize */

  const observer = new window.MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        SliderInit(div)
      }
    }
  })

  observer.observe(div, { childList: true })

  /* Html output */

  div.innerHTML = renderHtmlString(
    {
      Slider: SliderHtml,
      SliderSlide: SliderSlideHtml
    },
    {
      renderType: 'Slider',
      label: '',
      contain: true,
      type: 'single',
      width: 100,
      widthSmall: 50,
      widthMedium: 33,
      widthLarge: 25,
      gap: '5',
      gapLarge: '10',
      prev: '<',
      next: '>',
      content: [
        {
          renderType: 'SliderSlide',
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-warm-light">1</div>'
        },
        {
          renderType: 'SliderSlide',
          selected: true,
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-hot-light">2</div>'
        },
        {
          renderType: 'SliderSlide',
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-cool-light">3</div>'
        },
        {
          renderType: 'SliderSlide',
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-cold-light">4</div>'
        },
        {
          renderType: 'SliderSlide',
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-primary-light">5</div>'
        },
        {
          renderType: 'SliderSlide',
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-warm-light">6</div>'
        },
        {
          renderType: 'SliderSlide',
          content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-hot-light">7</div>'
        }
      ]
    }
  )

  document.body.appendChild(div)
}

/* Exports */

export { SliderSingleExample }
