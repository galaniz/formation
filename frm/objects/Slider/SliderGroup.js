export default /* html */`
  <frm-slider-group
    id="sld-group"
    class="slider slider-group slider-contain wd-full flex col m-auto relative"
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
    <div class="slider-body overflow-hidden pb-5">
      <div
        class="slider-track flex gap-4 gap-6-l overflow-x-auto overflow-y-hidden"
        data-slider-track
      >
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-1"
          role="tabpanel"
          aria-label="Panel 1"
          data-slider-offset
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cold-light wd-full"
            data-slider-item
          >
            <a href="#">1</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-2"
          role="tabpanel"
          aria-label="Panel 2"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-hot-light wd-full"
            data-slider-item
          >
            <a href="#">2</a>
          </div>
        </div>
        <div
          class="slider-panel flex shrink-0 gap-4 gap-6-l"
          id="sld-group-panel-3"
          role="tabpanel"
          aria-label="Panel 3"
        >
          <div
            class="slider-item flex align-center justify-center ar-16-9 bg-primary-light wd-full"
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
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cool-light wd-full"
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
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-warm-light wd-full"
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
            class="slider-item flex align-center justify-center ar-16-9 bg-accent-cold-light wd-full"
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
            class="slider-item flex align-center justify-center ar-16-9 bg-primary-light wd-full"
            data-slider-item
          >
            <a href="#">7</a>
          </div>
        </div>
        <div class="slider-spacer shrink-0"></div>
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
      class="slider-tabs flex gap-12 justify-center mt-8"
      role="tablist"
      aria-label="Panel controls"
    >
      <li class="flex" role="presentation">
        <button
          class="slider-tab flex align-center justify-center wd-6 ht-6"
          type="button"
          role="tab"
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
          aria-label="Panel 7"
        >
          <span class="slider-dot block b-radius-full b-all wd-3 ht-3"></span>
        </button>
      </li>
    </ul>      
  </frm-slider>
`
