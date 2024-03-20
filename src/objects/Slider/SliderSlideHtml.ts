// @ts-nocheck

/**
 * Objects - Slider Slide Html
 */

/**
 * Output slider slide panel
 *
 * @param {object} props
 * @param {object} props.args
 * @param {string} props.args.label
 * @param {boolean} props.args.selected
 * @param {number} props.args.index
 * @param {object[]} props.parents
 * @param {object[]} props.children
 * @return {object}
 */

const SliderSlideHtml = ({ args = {}, parents = [], children = [] }) => {
  /* Parent required */

  if (parents.length === 0) {
    return {
      start: '',
      end: ''
    }
  }

  /* Props */

  const {
    type = 'single',
    label: parentLabel = '',
    gap = '5',
    gapLarge = '10'
  } = parents[0].args

  const {
    label = '',
    selected = false,
    content = '',
    index = 0
  } = args

  /* Label */

  let panelLabel = label

  if (panelLabel === '' && parentLabel !== '') {
    panelLabel = `${label} group ${index + 1}`
  }

  /* Classes */

  let classes = `o-slider__${type === 'single' ? 'single' : 'group'} l-flex-shrink-0 l-relative outline-none`

  const gapClasses = `l-gap-margin-${gap} l-gap-margin-${gapLarge}-l`

  /* Attributes */

  let attrs = `role="tabpanel" tabindex="${selected ? 0 : -1}" aria-hidden="${!selected}" aria-label="${panelLabel}" data-selected="${selected}"`

  /* Containers */

  const start = []
  const end = []

  if (type === 'group') {
    start.push(`
      <div class="o-slider__items o-slider__x o-slider__focus l-flex l-before l-relative ${gapClasses}">
        <div class="o-slider__item l-flex l-flex-shrink-0 l-flex-column">
    `)

    end.push(`
        </div>
      </div>
    `)
  } else if (type === 'flex') {
    classes += ' l-flex l-flex-column'
    attrs += ` style="--length:${children.length}"`

    start.push(`
      <div class="o-slider__focus l-before l-flex l-flex-grow-1 l-flex-column">
        <div class="l-flex l-flex-grow-1 ${gapClasses}">
    `)

    end.push(`
        </div>
      </div>
    `)
  } else { // single
    start.push(`
      <div class="o-slider__x o-slider__focus l-before l-relative l-flex l-flex-column">
    `)

    end.push(`
      </div>
    `)
  }

  start.unshift(`<div class="${classes}" ${attrs}>`)

  end.push('</div>')

  /* Output */

  return {
    start: start.join('') + content,
    end: end.join('')
  }
}

/* Exports */

export { SliderSlideHtml }
