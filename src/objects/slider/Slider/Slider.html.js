/**
 * Objects - slider html
 */

/**
 * Output slider container
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.label
 * @param {string} props.args.type - item || group || group-flex
 * @param {boolean} props.args.loop - Only applies to item
 * @param {number} props.args.slideWidth - 100 || 50 || 33 || 25
 * @param {object[]} props.children
 * @return {object}
 */

const SliderHtml = ({ args = {}, children = [] }) => {
  const {
    label = '',
    type = 'group'
  } = args

  let {
    loop = false
  } = args

  /* Label and children required */

  if (label === '' || children.length === 0) {
    return {
      start: '',
      end: ''
    }
  }

  /* Loop false if group */

  if (type === 'group' || type === 'group-flex') {
    loop = false
  }

  /* Tablist nav output */

  const tablist = []
  const length = children.length
  const lengthPercentage = Math.round(100 / length)

  children.forEach((slide, i) => {
    const {
      id = '',
      label: slideLabel = '',
      selected = false
    } = slide

    /* Slide id required */

    if (id === '') {
      return
    }

    /* Tab attributes */

    let buttonLabel = `${label} group ${i + 1}`

    if (slideLabel !== '') {
      buttonLabel = slideLabel
    }

    const buttonMaxWidth = ` style="max-width:calc(${lengthPercentage}vw - ${lengthPercentage / 16}rem)"`

    /* Tab output */

    tablist.push(`
      <li class="l-flex" role="presentation">
        <button class="o-slider__tab t-current l-flex l-flex-column l-align-center l-padding-left-5xs l-padding-right-5xs l-padding-top-5xs l-padding-bottom-5xs" type="button" role="tab" tabindex="${selected ? 0 : -1}" aria-selected="${selected}" aria-label="${buttonLabel}"${buttonMaxWidth}>
          <span class="l-block b-radius-100-pc b-all"></span>
        </button>
      </li>
    `)
  })

  let tabListOutput = ''

  if (tablist.length > 0) {
    tabListOutput = `
      <ul class="o-slider__tabs l-flex l-justify-center l-padding-top-s l-padding-top-m-l l-margin-0 t-list-style-none" role="tablist" aria-label="${label} controls">
        ${tablist.join('')}
      </ul>
    `
  }

  /* Offset output */

  let offset = ''

  if (!loop) {
    offset = '<div class="o-slider__offset l-flex-shrink-0"></div>'
  }

  /* Output */

  return {
    start: `
      <div class="o-slider l-flex l-flex-column l-margin-auto l-relative" role="group">
        <div class="o-slider__main l-overflow-hidden">
          <div class="o-slider__track l-overflow-x-auto l-padding-bottom-s l-relative" tabindex="-1">
            <div class="l-flex l-gap-margin-xs">
    `,
    end: `
              ${offset}
            </div>
          </div>
        </div>
        <div class="o-slider__nav">
          ${tabListOutput}
          <button type="button" class="o-slider__prev t-current l-width-s l-height-s l-svg l-absolute l-left-0 l-none outline-tight" aria-label="Previous ${label} group" data-prev disabled>
            &#8592;
          </button>
          <button type="button" class="o-slider__next t-current l-width-s l-height-s l-svg l-absolute l-right-0 l-none outline-tight" aria-label="Next ${label} group" data-next>
            &#8594;
          </button>
        </div>
      </div>
    `
  }
}

/* Exports */

export default SliderHtml
