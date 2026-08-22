export default /* html */`
  <frm-tabs id="tabs-mismatch">
    <div>
      <div
        id="tabs-mismatch-panel-1"
        role="tabpanel"
        aria-labelledby="mismatch-panel-1-title"
      >
        <h2 id="mismatch-panel-1-title">Panel 1</h2>
        <p>Aliquam erat volutpat. Fusce pellentesque nibh at leo euismod varius.</p>
      </div>
      <div
        id="tabs-mismatch-panel-2"
        role="tabpanel"
        aria-labelledby="mismatch-panel-2-title"
        hidden
      >
        <h2 id="mismatch-panel-2-title">Panel 2</h2>
        <p>Integer hendrerit, velit vel accumsan malesuada, quam felis efficitur tellus.</p>
      </div>
    </div>
    <ul role="tablist" aria-label="Panel controls">
      <li class="flex" role="presentation">
        <button
          id="tabs-mismatch-tab-1"
          type="button"
          role="tab"
          aria-selected="true"
          data-testid="tabs-mismatch-tab-1"
        >
          Panel 1
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          id="tabs-mismatch-tab-2"
          type="button"
          role="tab"
          aria-selected="false"
          data-testid="tabs-mismatch-tab-2"
        >
          Panel 2
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          id="tabs-mismatch-tab-3"
          type="button"
          role="tab"
          aria-selected="false"
          data-testid="tabs-mismatch-tab-3"
        >
          Panel 3
        </button>
      </li>
    </ul>
  </frm-tabs>
`
