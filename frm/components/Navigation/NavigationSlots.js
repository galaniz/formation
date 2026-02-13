export default /* html */`
  <frm-navigation
    id="nav-slots"
    class="nav nav-scrollable"
    role="navigation"
  >
    <ul data-nav-slot="one">
      <li data-nav-item="one">Item One 1.0</li>
      <li data-nav-item="one">Item Two 1.0</li>
      <li data-nav-item="one">Item Three 1.0</li>
      <li data-nav-item="one">Item Four 1.0</li>
      <li data-nav-item="one">Item Five 1.0</li>
      <li data-nav-item="one">Item Six 1.0</li>
    </ul>
    <ul data-nav-slot="two">
      <li data-nav-item="two">Item One 2.0</li>
      <li data-nav-item="two">Item Two 2.0</li>
      <li data-nav-item="two">Item Three 2.0</li>
      <li data-nav-item="two">Item Four 2.0</li>
    </ul>
    <button
      class="nav-hide"
      type="button"
      aria-haspopup="true"
      data-nav-open
      data-testid="nav-slots-open"
    >
      Open
    </button>
    <div
      class="nav-modal"
      role="dialog"
      aria-modal="true"
      data-nav-modal
      data-testid="nav-slots-close"
    >
      <ul data-nav-modal-slot="one"></ul>
      <ul data-nav-modal-slot="two"></ul>
      <button type="button" data-nav-close>Close</button>
      <div class="nav-overlay" data-nav-close></div>
    </div>
  </frm-navigation>
`
