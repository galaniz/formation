export default /* html */`
  <frm-slider-group
    id="sld-group"
    class="slider slider-group slider-contain w-full flex col m-auto relative"
    role="group"
    breakpoints="0,600,900,1200"
    visible="1,2,3,4"
    style="
      --sld-items-init: 1;
      --sld-items-s: 2;
      --sld-items-m: 3;
      --sld-items-l: 4;
      --sld-gap-init: var(--frm-4);
      --sld-gap-l: var(--frm-6);
    "
  >
    <div class="overflow-hidden">
      <div
        class="slider-track flex gap-4 gap-6-l overflow-x-auto overflow-y-hidden"
        id="sld-group-track"
        data-testid="sld-group-track"
        data-slider-track
      >
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-1"
          data-testid="sld-group-panel-1"
          role="tabpanel"
          aria-label="Panel 1"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cold-light w-full"
            id="sld-group-item-1"
            data-slider-item
          >
            <a href="#">1</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-2"
          data-testid="sld-group-panel-2"
          role="tabpanel"
          aria-label="Panel 2"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-hot-light w-full"
            id="sld-group-item-2"
            data-slider-item
          >
            <a href="#">2</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-3"
          data-testid="sld-group-panel-3"
          role="tabpanel"
          aria-label="Panel 3"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-primary-light w-full"
            id="sld-group-item-3"
            data-slider-item
          >
            <a href="#">3</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-4"
          role="tabpanel"
          aria-label="Panel 4"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cool-light w-full"
            id="sld-group-item-4"
            data-slider-item
          >
            <a href="#">4</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-5"
          role="tabpanel"
          aria-label="Panel 5"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-warm-light w-full"
            id="sld-group-item-5"
            data-slider-item
          >
            <a href="#">5</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-6"
          role="tabpanel"
          aria-label="Panel 6"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cold-light w-full"
            id="sld-group-item-6"
            data-slider-item
          >
            <a href="#">6</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-7"
          role="tabpanel"
          aria-label="Panel 7"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-primary-light w-full"
            id="sld-group-item-7"
            data-slider-item
          >
            <a href="#">7</a>
          </div>
        </div>
        <div class="slider-spacer shrink-0"></div>
      </div>
    </div>
    <button
      id="sld-group-prev"
      class="slider-prev w-8 h-8 t-background-light b-radius-full absolute left-0"
      type="button"
      aria-label="Previous"
      data-slider-prev
      data-testid="sld-group-prev"
    >
    </button>
    <button
      id="sld-group-next"
      class="slider-next w-8 h-8 t-background-light b-radius-full absolute right-0"
      type="button"
      aria-label="Next"
      data-slider-next
      data-testid="sld-group-next"
    >
    </button>
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
          data-testid="sld-group-tab-1"
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
          data-testid="sld-group-tab-2"
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
          data-testid="sld-group-tab-3"
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
          data-testid="sld-group-tab-4"
          aria-label="Panel 4"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          data-testid="sld-group-tab-5"
          aria-label="Panel 5"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          data-testid="sld-group-tab-6"
          aria-label="Panel 6"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center w-6 h-6"
          type="button"
          role="tab"
          data-testid="sld-group-tab-7"
          aria-label="Panel 7"
        >
          <span class="slider-dot block b-radius-full b-all w-3 h-3"></span>
        </button>
      </li>
    </ul>
  </frm-slider-group>
`
