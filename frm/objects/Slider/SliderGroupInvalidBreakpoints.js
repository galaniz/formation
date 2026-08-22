export default /* html */`
  <frm-slider-group
    id="sld-group-invalid-breakpoints"
    class="slider slider-group slider-contain w-full flex col m-auto relative"
    role="group"
    breakpoints="1200,x,y,600,0"
    visible="4,,2,0,3"
    style="
      --sld-items-init: 3;
      --sld-gap-init: var(--frm-4);
    "
  >
    <div class="overflow-hidden">
      <div
        class="slider-track flex gap-4 overflow-x-auto overflow-y-hidden"
        id="sld-group-invalid-breakpoints-track"
        data-slider-track
      >
        <div
          class="slider-panel flex shrink-0 gap-4"
          id="sld-group-invalid-breakpoints-panel-1"
          role="tabpanel"
          aria-label="Panel 1"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cold-light w-full"
            id="sld-group-invalid-breakpoints-item-1"
            data-slider-item
          >
            <a href="#">1</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4"
          id="sld-group-invalid-breakpoints-panel-2"
          role="tabpanel"
          aria-label="Panel 2"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-hot-light w-full"
            id="sld-group-invalid-breakpoints-item-2"
            data-slider-item
          >
            <a href="#">2</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4"
          id="sld-group-invalid-breakpoints-panel-3"
          role="tabpanel"
          aria-label="Panel 3"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-primary-light w-full"
            id="sld-group-invalid-breakpoints-item-3"
            data-slider-item
          >
            <a href="#">3</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4"
          id="sld-group-invalid-breakpoints-panel-4"
          role="tabpanel"
          aria-label="Panel 4"
        >
        </div>
        <div class="slider-spacer shrink-0"></div>
      </div>
    </div>
    <ul
      class="slider-tabs flex gap-12 justify-center mt-8"
      role="tablist"
      aria-label="Panel controls"
    >
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          aria-label="Panel 1"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          aria-label="Panel 2"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          aria-label="Panel 3"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          aria-label="Panel 4"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
    </ul>
  </frm-slider-group>
`
