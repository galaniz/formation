export default /* html */`
  <frm-navigation
    id="nav-slots-groups-breakpoints"
    class="nav"
    delay="400"
    breakpoints="620,900"
    role="navigation"
  >
    <ul data-nav-slot="one">
      <li data-nav-item="one" data-nav-group="one-1">Item One 1.1</li>
      <li data-nav-item="one" data-nav-group="one-1">Item Two 1.1</li>
      <li data-nav-item="one" data-nav-group="one-1">Item Three 1.1</li>
      <li data-nav-item="one" data-nav-group="one-2">Item Four 1.2</li>
      <li data-nav-item="one" data-nav-group="one-2">Item Five 1.2</li>
      <li data-nav-item="one" data-nav-group="one-2">Item Six 1.2</li>
    </ul>
    <ul data-nav-slot="two">
      <li data-nav-item="two" data-nav-group="two-1">Item One 2.1</li>
      <li data-nav-item="two" data-nav-group="two-1">Item Two 2.1</li>
      <li data-nav-item="two" data-nav-group="two-1">Item Three 2.1</li>
      <li data-nav-item="two" data-nav-group="two-2">Item Four 2.2</li>
      <li data-nav-item="two" data-nav-group="two-2">Item Five 2.2</li>
    </ul>
    <button
      class="nav-hide"
      type="button"
      aria-haspopup="true"
      data-nav-open
    >
      Open
    </button>
    <div
      class="nav-modal"
      role="dialog"
      aria-modal="true"
      data-nav-modal
    >
      <ul data-nav-modal-slot="one"></ul>
      <ul data-nav-modal-slot="two"></ul>
      <button type="button" data-nav-close>Close</button>
      <div class="nav-overlay" data-nav-close></div>
    </div>
  </frm-navigation>
`
