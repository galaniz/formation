/**
 * Objects - Slider Html
 */

/**
 * Output slider container
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.label
 * @param {string} props.args.type - single || group || flex
 * @param {boolean} props.args.loop - Only applies to single
 * @param {boolean} props.args.contain
 * @param {number} props.args.width - 100 || 50 || 33 || 25
 * @param {number} props.args.widthSmall - 100 || 50 || 33 || 25
 * @param {number} props.args.widthMedium - 100 || 50 || 33 || 25
 * @param {number} props.args.widthLarge - 100 || 50 || 33 || 25
 * @param {string} props.args.gap
 * @param {string} props.args.gapLarge
 * @param {string} props.args.prev
 * @param {string} props.args.next
 * @param {object[]} props.children
 * @return {object}
 */

const SliderHtml = ({ args = {}, children = [] }) => {
  const {
    label = '',
    type = 'single',
    contain = false,
    width = 100,
    widthSmall = 100,
    widthMedium = 100,
    widthLarge = 100,
    gap = '5',
    gapLarge = '10',
    prev = '',
    next = ''
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

  if (type === 'group' || type === 'flex') {
    loop = false
  }

  /* Gap classes */

  const gapClasses = []

  /* Slider attributes */

  const items = Math.round(100 / width)
  const itemsSmall = Math.round(100 / widthSmall)
  const itemsMedium = Math.round(100 / widthMedium)
  const itemsLarge = Math.round(100 / widthLarge)
  const length = children.length
  const lengthPercentage = Math.round(100 / length)

  const data = {
    role: 'group',
    'data-slider-type': type
  }

  if (type === 'group') {
    data['data-slider-items'] = `${items},${itemsSmall},${itemsMedium},${itemsLarge}`
  }

  const styles = {
    '--items-0': items,
    '--items-s': itemsSmall,
    '--items-m': itemsMedium,
    '--items-l': itemsLarge,
    '--tab': `${lengthPercentage}vw - ${lengthPercentage / 16}rem`
  }

  if (gap !== '') {
    styles['--gap'] = `var(--${gap})`

    gapClasses.push(`l-gap-margin-${gap}`)
  }

  if (gapLarge !== '') {
    styles['--gap-l'] = `var(--${gap})`

    gapClasses.push(`l-gap-margin-${gap}-l`)
  }

  let attrs = ''

  Object.keys(data).forEach((d) => {
    attrs += `${d}="${data[d]}"`
  })

  attrs += ' style="'

  Object.keys(styles).forEach((s) => {
    attrs += `${s}:${styles[s]};`
  })

  attrs += '"'

  /* Tablist nav output */

  const tablist = []

  children.forEach((slide, i) => {
    const {
      label: slideLabel = '',
      selected = false
    } = slide

    /* Tab attributes */

    let buttonLabel = `${label} group ${i + 1}`

    if (slideLabel !== '') {
      buttonLabel = slideLabel
    }

    /* Tab output */

    tablist.push(`
      <li class="l-flex" role="presentation">
        <button class="o-slider__tab t-current l-flex l-align-center l-justify-center l-width-6 l-height-6" type="button" role="tab" tabindex="${selected ? 0 : -1}" aria-selected="${selected}" aria-label="${buttonLabel}">
          <span class="o-slider__dot l-block b-radius-100-pc b-all l-width-3 l-height-3"></span>
        </button>
      </li>
    `)
  })

  let tabListOutput = ''

  if (tablist.length > 0) {
    tabListOutput = `
      <ul class="l-flex l-justify-center l-padding-top-10 l-padding-top-16-l l-gap-margin-1 l-gap-margin-2-l t-list-style-none" role="tablist" aria-label="${label} controls">
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
      <div class="o-slider${contain ? ' o-slider--contain' : ''} l-flex l-flex-column l-margin-auto l-relative" ${attrs}>
        <div class="o-slider__main l-overflow-hidden">
          <div class="o-slider__track l-overflow-x-auto l-padding-bottom-10 l-relative" tabindex="-1">
            <div class="l-flex${gapClasses.length > 0 ? ` ${gapClasses.join(' ')}` : ''}">
    `,
    end: `
              ${offset}
            </div>
          </div>
        </div>
        ${tabListOutput}
        <button type="button" class="o-slider__prev t-current l-width-5 l-height-5 l-absolute l-left-0 outline-tight" aria-label="Previous ${label} group" data-prev disabled>
          ${prev}
        </button>
        <button type="button" class="o-slider__next t-current l-width-s l-height-s l-absolute l-right-0 outline-tight" aria-label="Next ${label} group" data-next>
          ${next}
        </button>
      </div>
    `
  }
}

/* Exports */

export { SliderHtml }
