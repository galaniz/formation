/**
 * Objects - Slider Stories
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
  tags: ['autodocs'],
  render: ({
    label,
    contain,
    type,
    width,
    widthSmall,
    widthMedium,
    widthLarge,
    gap,
    gapLarge
  }) => {
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

    div.insertAdjacentHTML(
      'beforeend',
      renderHtmlString(
        {
          Slider: SliderHtml,
          SliderSlide: SliderSlideHtml
        },
        {
          renderType: 'Slider',
          label,
          contain,
          type,
          width,
          widthSmall,
          widthMedium,
          widthLarge,
          gap,
          gapLarge,
          prev: '<',
          next: '>',
          content: [
            {
              renderType: 'SliderSlide',
              selected: true,
              content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-warm-light">1</div>'
            },
            {
              renderType: 'SliderSlide',
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
    )

    return div
  },
  argTypes: {
    label: {
      control: 'text'
    },
    contain: {
      control: 'boolean'
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
      options: widthOptions,
      description: 'Description',
      table: {
        defaultValue: {
          summary: 100
        }
      }
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
    contain: false,
    type: 'single',
    width: 100,
    widthSmall: 50,
    widthMedium: 33,
    widthLarge: 25,
    gap: 5,
    gapLarge: 5
  }
}

Single.parameters = {
  docs: {
    source: {
      type: 'code',
      language: 'html',
      code: `
import { renderHtmlString } from '../../../utils'
import { SliderHtml } from '../Slider/SliderHtml'
import { SliderSlideHtml } from '../SliderSlide/SliderSlideHtml'
import { SliderInit } from '../Slider/SliderInit'

renderHtmlString(
  {
    Slider: SliderHtml,
    SliderSlide: SliderSlideHtml
  },
  {
    renderType: 'Slider',
    label: ${Single.args.label},
    contain: ${Single.args.contain},
    type: ${Single.args.type},
    width: ${Single.args.width},
    widthSmall: ${Single.args.widthSmall},
    widthMedium: ${Single.args.widthMedium},
    widthLarge: ${Single.args.widthLarge},
    gap: '${Single.args.gap}',
    gapLarge: '${Single.args.gapLarge}',
    prev: '<',
    next: '>',
    content: [
      {
        renderType: 'SliderSlide',
        selected: true,
        content: '<div class="l-aspect-ratio-56 l-width-100-pc bg-accent-warm-light">1</div>'
      },
      {
        renderType: 'SliderSlide',
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

SliderInit(div)
      `
    }
  }
}

/* */

export const Group = {
  args: {
    label: 'Example',
    contain: false,
    type: 'group',
    width: 100,
    widthSmall: 50,
    widthMedium: 33,
    widthLarge: 25,
    gap: 5,
    gapLarge: 5
  }
}

Group.parameters = {
  docs: {
    source: {
      type: 'code',
      language: 'html',
      code: '<div>YOOOOO</div>'
    }
  }
}

/* */

export const Flex = {
  args: {
    label: 'Example',
    contain: false,
    type: 'flex',
    width: 100,
    widthSmall: 50,
    widthMedium: 33,
    widthLarge: 25,
    gap: 5,
    gapLarge: 5
  }
}

Flex.parameters = {
  docs: {
    source: {
      type: 'code',
      language: 'html',
      code: '<div>YOOOOO</div>'
    }
  }
}
