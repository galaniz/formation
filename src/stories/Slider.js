export const createSlider = ({
  label = ''
}) => {
  const div = document.createElement('div')

  div.insertAdjacentHTML(
    'beforeend',
    `
      <div class="o-slider l-flex l-flex-column l-margin-auto l-relative" role="group">
        <div class="o-slider__main l-overflow-hidden">
          <div class="o-slider__track l-overflow-x-auto l-padding-bottom-s l-relative" tabindex="-1">
            <div class="l-flex l-gap-margin-xs">
            </div>
          </div>
        </div>
        <div class="o-slider__nav">
          <ul class="o-slider__tabs l-flex l-justify-center l-padding-top-s l-padding-top-m-l l-margin-0 t-list-style-none" role="tablist" aria-label="${label} controls">
          </ul>
          <button type="button" class="o-slider__prev t-current l-width-s l-height-s l-svg l-absolute l-left-0 l-none outline-tight" aria-label="Previous ${label} group" data-prev disabled>
            &#8592;
          </button>
          <button type="button" class="o-slider__next t-current l-width-s l-height-s l-svg l-absolute l-right-0 l-none outline-tight" aria-label="Next ${label} group" data-next>
            &#8594;
          </button>
        </div>
      </div>
    `
  )

  return div
}
