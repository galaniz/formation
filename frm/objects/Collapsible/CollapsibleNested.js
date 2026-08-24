export default /* html */`
  <frm-collapsible
    id="clp-nested"
    class="collapsible"
  >
    <button
      type="button"
      data-collapsible-toggle
      data-testid="clp-nested-toggle"
    >
      Nested
    </button>
    <div class="collapsible-panel grid e-trans" data-testid="clp-nested-panel">
      <div class="collapsible-content overflow-hidden e-trans">
        <p>
          Mauris ut sem vitae ligula blandit interdum quis ut nibh. Suspendisse potenti. Nulla efficitur hendrerit enim, vitae efficitur dui aliquam quis. Vivamus cursus dignissim felis, eget faucibus tellus blandit vitae.
        </p>
        <frm-collapsible
          id="clp-nested-inner"
          class="collapsible"
          expanded="true"
        >
          <button
            type="button"
            aria-expanded="true"
            data-collapsible-toggle
            data-testid="clp-nested-inner-toggle"
          >
            Inner
          </button>
          <div class="collapsible-panel grid e-trans" data-testid="clp-nested-inner-panel">
            <div class="collapsible-content overflow-hidden e-trans">
              <p>
                <a id="clp-nested-inner-link" href="#clp-nested-inner">Inner link</a>
              </p>
            </div>
          </div>
        </frm-collapsible>
      </div>
    </div>
  </frm-collapsible>
`
