export default /* html */`
  <frm-navigation
    id="nav-slot"
    class="nav nav-scrollable"
    role="navigation",
    breakpoints="NaN"
  >
    <ul data-nav-slot>
      <li data-nav-item>Item One</li>
      <li data-nav-item>Item Two</li>
      <li data-nav-item>Item Three</li>
      <li data-nav-item>Item Four</li>
      <li data-nav-item>Item Five</li>
      <li data-nav-item>Item Six</li>
    </ul>
    <button
      class="nav-hide"
      type="button"
      aria-haspopup="true"
      data-nav-open
      data-testid="nav-slot-open"
    >
      Open
    </button>
    <div
      class="nav-modal"
      role="dialog"
      aria-modal="true"
      data-nav-modal
    >
      <ul data-nav-modal-slot></ul>
      <button
        type="button"
        data-nav-close
        data-testid="nav-slot-close"
      >
        Close
      </button>
    </div>
  </frm-navigation>
`
