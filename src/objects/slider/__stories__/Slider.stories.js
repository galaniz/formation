/**
 * Objects - slider stories
 */

/* Imports */

import { SliderHtml } from '../Slider/SliderHtml'
import { SliderSlideHtml } from '../SliderSlide/SliderSlideHtml'
import { SliderSlideContentHtml } from '../SliderSlideContent/SliderSlideContentHtml'
import { SliderInit } from '../Slider/SliderInit'
import '../../../formation/Formation.scss'
import '../Slider/Slider.scss'

/* */

const widthLabels = {
  100: '100%',
  50: '50%',
  33: '33%',
  25: '25%'
}

const widthOptions = [
  100,
  50,
  33,
  25
]

const gapLabels = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px'
}

const gapOptions = [
  1,
  2,
  3,
  4,
  5,
  6,
  8,
  10
]

/* */

export default {
  title: 'Formation/Slider',
  render: ({
    label,
    type,
    width,
    widthSmall,
    widthMedium,
    widthLarge,
    gap,
    gapLarge
  }) => {
    const div = document.createElement('div')

    const args = {
      label,
      type,
      width,
      widthSmall,
      widthMedium,
      widthLarge,
      gap,
      gapLarge,
      prev: '<',
      next: '>'
    }

    const data = [
      {
        selected: true,
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-warm-light">1</div>'
      },
      {
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-hot-light">2</div>'
      },
      {
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-cool-light">3</div>'
      },
      {
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-cold-light">4</div>'
      },
      {
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-primary-light">5</div>'
      },
      {
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-warm-light">6</div>'
      },
      {
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-hot-light">7</div>'
      }
    ]

    const slides = []

    data.forEach((d, i) => {
      const slide = SliderSlideHtml({
        args: {
          index: i,
          ...d
        },
        parents: [
          {
            args
          }
        ]
      })

      slides.push(
        slide.start +
        d.content +
        slide.end
      )
    })

    const container = SliderHtml({
      args,
      children: data
    })

    div.insertAdjacentHTML(
      'beforeend',
      container.start +
      slides.join('') +
      container.end
    )

    setTimeout(() => {
      SliderInit(div)
    }, 100)

    return div
  },
  argTypes: {
    label: {
      control: 'text'
    },
    type: {
      control: {
        type: 'select',
        labels: {
          single: 'Single',
          group: 'Group',
          flex: 'Flex'
        }
      },
      options: [
        'single',
        'group',
        'flex'
      ]
    },
    width: {
      control: {
        type: 'select',
        labels: widthLabels
      },
      options: widthOptions
    },
    widthSmall: {
      control: {
        type: 'select',
        labels: widthLabels
      },
      options: widthOptions
    },
    widthMedium: {
      control: {
        type: 'select',
        labels: widthLabels
      },
      options: widthOptions
    },
    widthLarge: {
      control: {
        type: 'select',
        labels: widthLabels
      },
      options: widthOptions
    },
    gap: {
      control: {
        type: 'select',
        labels: gapLabels
      },
      options: gapOptions
    },
    gapLarge: {
      control: {
        type: 'select',
        labels: gapLabels
      },
      options: gapOptions
    }
  }
}

/* */

export const Single = {
  args: {
    label: 'Example',
    type: 'single',
    width: 100,
    widthSmall: 100,
    widthMedium: 100,
    widthLarge: 100,
    gap: 5,
    gapLarge: 5
  }
}

/* */

export const Group = {
  args: {
    label: 'Example',
    type: 'group',
    width: 100,
    widthSmall: 100,
    widthMedium: 100,
    widthLarge: 100,
    gap: 5,
    gapLarge: 5
  }
}

/* */

export const Flex = {
  args: {
    label: 'Example',
    type: 'flex',
    width: 100,
    widthSmall: 100,
    widthMedium: 100,
    widthLarge: 100,
    gap: 5,
    gapLarge: 5
  }
}
