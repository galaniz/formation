export default /* html */`
  <frm-tabs id="tabs-vertical" direction="vertical">
    <div>
      <div
        id="tabs-vertical-panel-1"
        role="tabpanel"
        aria-labelledby="panel-vertical-1-title"
      >
        <h2 id="panel-vertical-1-title">Panel 1</h2>
        <p>Nunc euismod nisl nulla, id sodales felis dictum ac. Sed ac diam est. Aliquam at interdum ligula, suscipit posuere erat. Ut pellentesque vehicula posuere. Aliquam at accumsan dui. In faucibus aliquam urna, ut posuere purus fermentum et. Aenean placerat, nibh non dapibus mollis, sem leo imperdiet mauris, at finibus sapien risus sed mi.</p>
      </div>
      <div
        id="tabs-vertical-panel-2"
        role="tabpanel"
        aria-labelledby="panel-vertical-2-title"
        hidden
      >
        <h2 id="panel-vertical-2-title">Panel 2</h2>
        <p> Donec id purus viverra, placerat lacus vel, convallis libero. Sed convallis vel sapien sed laoreet. Nam quis mauris tellus. Nulla ut placerat nibh. Proin vestibulum vehicula est, et interdum velit facilisis ac.</p>
      </div>
      <div
        id="tabs-vertical-panel-3"
        role="tabpanel"
        aria-labelledby="panel-vertical-3-title"
        hidden
      >
        <h2 id="panel-vertical-3-title">Panel 3</h2>
        <p>Mauris venenatis, felis sit amet faucibus fermentum, lorem metus mollis purus, vitae tincidunt ligula sapien id enim. In ut fringilla nibh. Ut luctus dui venenatis, venenatis turpis in, hendrerit augue. Ut consequat nunc in nisi dapibus malesuada. Morbi mollis dui eros, pharetra porttitor felis sollicitudin id.</p>
      </div>
    </div>
    <ul role="tablist" aria-label="Panel controls" aria-orientation="vertical">
      <li class="flex" role="presentation">
        <button
          id="tabs-vertical-tab-1"
          type="button"
          role="tab"
          aria-selected="true"
          data-testid="tabs-vertical-tab-1"
        >
          Panel 1
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          id="tabs-vertical-tab-2"
          type="button"
          role="tab"
          aria-selected="false"
          data-testid="tabs-vertical-tab-2"
        >
          Panel 2
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          id="tabs-vertical-tab-3"
          type="button"
          role="tab"
          aria-selected="false"
          data-testid="tabs-vertical-tab-3"
        >
          Panel 3
        </button>
      </li>
    </ul>
  </frm-tabs>
`
