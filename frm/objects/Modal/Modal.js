export default /* html */`
  <button
    id="mod-open-1"
    type="button"
    aria-haspopup="dialog"
  >
    Open 1
  </button>
  <button
    id="mod-open-2"
    type="button"
    aria-haspopup="dialog"
  >
    Open 2
  </button>
  <frm-modal
    id="mod"
    role="dialog"
    aria-modal="true"
    opens="mod-open-1,mod-open-2"
  >
    <div>Content</div>
    <button type="button" data-modal-close>Close</button>
  </frm-modal>
`
