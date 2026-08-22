export default /* html */`
  <button
    id="mod-open-1"
    type="button"
    data-testid="mod-open-1"
  >
    Open 1
  </button>
  <button
    id="mod-open-2"
    type="button"
    data-testid="mod-open-2"
  >
    Open 2
  </button>
  <frm-modal
    id="mod"
    class="modal"
    role="dialog"
    aria-modal="true"
    opens="mod-open-1,mod-open-2"
  >
    <div
      id="mod-overlay"
      class="modal-overlay fixed inset-0"
      data-modal-close
      data-testid="mod-overlay-close"
    ></div>
    <div class="relative">
      <a id="mod-link" href="#mod" data-testid="mod-link">Content link</a>
      <button
        id="mod-close"
        type="button"
        data-modal-close
        data-testid="mod-close"
      >
        Close
      </button>
    </div>
  </frm-modal>
`
