export default /* html */`
  <frm-tabs id="tabs">
    <div>
      <div
        id="tabs-panel-1"
        role="tabpanel"
        aria-labelledby="panel-1-title"
      >
        <h2 id="panel-1-title">Panel 1</h2>
        <p>Aliquam erat volutpat. Fusce pellentesque nibh at leo euismod varius. Vivamus accumsan purus dictum diam maximus, sit amet porta tortor finibus. Nam semper tempor nunc nec vehicula. Phasellus imperdiet libero nisl, et vehicula velit tempor vitae. Sed volutpat tristique magna id tempus. In eu lacinia turpis. Aenean feugiat luctus mi sed lacinia.</p>
      </div>
      <div
        id="tabs-panel-2"
        role="tabpanel"
        aria-labelledby="panel-2-title"
        hidden
      >
        <h2 id="panel-2-title">Panel 2</h2>
        <p>Integer hendrerit, velit vel accumsan malesuada, quam felis efficitur tellus, eu tincidunt libero urna vel elit. Suspendisse erat leo, pretium id hendrerit quis, aliquet scelerisque erat. Vivamus quis tempor leo. Etiam vulputate posuere condimentum. Donec lobortis ut nulla sed ultrices. Praesent porta est nec euismod tincidunt. Curabitur at risus dolor. Vivamus vel ligula sit amet nunc vehicula dignissim non consectetur urna. Cras massa ante, faucibus eu orci eget, iaculis feugiat odio. Nullam et sollicitudin tortor.</p>
      </div>
      <div
        id="tabs-panel-3"
        role="tabpanel"
        aria-labelledby="panel-3-title"
        hidden
      >
        <h2 id="panel-3-title">Panel 3</h2>
        <p>Fusce augue tellus, laoreet a felis vitae, hendrerit maximus quam. Vivamus in condimentum neque. Mauris porttitor lorem augue. Vivamus scelerisque nunc sed magna dictum eleifend. Nunc finibus odio turpis, ac tempus nulla finibus at. Ut porttitor sed libero vitae auctor. Suspendisse elementum velit laoreet, efficitur nisi in, euismod nisi. Nam non fringilla purus, non maximus leo.</p>
      </div>
    </div>
    <ul role="tablist" aria-label="Panel controls">
      <li class="flex" role="presentation">
        <button
          id="tabs-tab-1"
          type="button"
          role="tab"
          aria-selected="true"
          data-testid="tabs-tab-1"
        >
          Panel 1
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          id="tabs-tab-2"
          type="button"
          role="tab"
          aria-selected="false"
          data-testid="tabs-tab-2"
        >
          Panel 2
        </button>
      </li>
      <li class="flex" role="presentation">
        <button
          id="tabs-tab-3"
          type="button"
          role="tab"
          aria-selected="false"
          data-testid="tabs-tab-3"
        >
          Panel 3
        </button>
      </li>
    </ul>
  </frm-tabs>
`
