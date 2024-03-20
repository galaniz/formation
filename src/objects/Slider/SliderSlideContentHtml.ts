// @ts-nocheck

/**
 * Objects - Slider Slide Content Html
 */

/**
 * Output slider slide content
 *
 * @param {object} props
 * @param {object[]} props.parents
 * @return {object}
 */

const SliderSlideContentHtml = ({ parents = [] }) => {
  /* Parent required */

  if (parents.length < 2) {
    return {
      start: '',
      end: ''
    }
  }

  /* Props */

  const { type = 'single' } = parents[1]

  /* */

  let start = ''
  let end = ''

  if (type === 'flex') {
    start = `
      <div class="o-slider__item l-flex l-flex-column l-flex-shrink-0">
        <div class="o-slider__x l-flex l-flex-grow-1">
          <div class="l-width-full">
    `

    end = `
          </div>
        </div>
      </div>
    `
  }

  /* Output */

  return {
    start,
    end
  }
}

/* Exports */

export { SliderSlideContentHtml }
