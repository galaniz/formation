export default /* html */`
  <frm-slider
    id="sld-loop"
    class="slider slider-contain-full wd-full flex col m-auto"
    role="group"
    type="single"
    loop
    style="
      --sld-items-init: 1;
      --sld-items-s: 2;
      --sld-items-m: 3;
      --sld-items-l: 3;
      --sld-gap-init: var(--frm-4);
      --sld-gap-l: var(--frm-6);
    "
  >
    <div class="slider-main overflow-hidden relative">
      <div
        class="slider-track overflow-x-auto overflow-y-hidden"
        data-slider-track
      >
        <div
          class="flex gap-4 gap-6-l"
          data-slider-height
        >
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-1"
            role="tabpanel"
            aria-label="Panel 1"
          >
            <div
              class="flex align-center justify-center ar-16-9 bg-accent-cold-light wd-full"
              data-slider-offset
            >
              <a href="#">1</a>
            </div>
          </div>
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-2"
            role="tabpanel"
            aria-label="Panel 2"
          >
            <div class="flex align-center justify-center ar-16-9 bg-accent-hot-light wd-full">
              <a href="#">2</a>
            </div>
          </div>
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-3"
            role="tabpanel"
            aria-label="Panel 3"
          >
            <div class="flex align-center justify-center ar-16-9 bg-primary-light wd-full">
              <a href="#">3</a>
            </div>
          </div>
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-4"
            role="tabpanel"
            aria-label="Panel 4"
          >
            <div class="flex align-center justify-center ar-16-9 bg-accent-cool-light wd-full">
              <a href="#">4</a>
            </div>
          </div>
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-5"
            role="tabpanel"
            aria-label="Panel 5"
          >
            <div class="flex align-center justify-center ar-16-9 bg-accent-warm-light wd-full">
              <a href="#">5</a>
            </div>
          </div>
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-6"
            role="tabpanel"
            aria-label="Panel 6"
          >
            <div class="flex align-center justify-center ar-16-9 bg-accent-cold-light wd-full">
              <a href="#">6</a>
            </div>
          </div>
          <div
            class="slider-panel flex shrink-0"
            id="sld-loop-panel-7"
            role="tabpanel"
            aria-label="Panel 7"
          >
            <div class="flex align-center justify-center ar-16-9 bg-primary-light wd-full">
              <a href="#">7</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="slider-prev wd-8 ht-8 t-background-light b-radius-full absolute left-0"
      aria-label="Previous"
      data-slider-prev
    >
    </button>  
    <button
      class="slider-next wd-8 ht-8 t-background-light b-radius-full absolute right-0"
      aria-label="Next"
      data-slider-next
    >
    </button>
    <ul
      class="slider-tabs flex gap-1 justify-center pt-6"
      role="tablist"
      aria-label="Panel controls"
    >
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="-1"
          aria-selected="false"
          aria-label="Panel 1"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="-1"
          aria-selected="false"
          aria-label="Panel 2"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="0"
          aria-selected="true"
          aria-label="Panel 3"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="-1"
          aria-selected="false"
          aria-label="Panel 4"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="-1"
          aria-selected="false"
          aria-label="Panel 5"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="-1"
          aria-selected="false"
          aria-label="Panel 6"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
          tabindex="-1"
          aria-selected="false"
          aria-label="Panel 7"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
    </ul>
  </frm-slider>
`
