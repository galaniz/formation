export default /* html */`
  <frm-tabs id="tabs-anchor">
    <div>
      <div
        id="panel-anchor-1"
        role="tabpanel"
        aria-labelledby="panel-anchor-1-title"
        hidden
      >
        <h2 id="panel-anchor-1-title">Panel 1</h2>
        <p>Phasellus eleifend nulla eget dui consequat, at hendrerit nunc consequat. Nam et tortor augue. Duis tincidunt vulputate mi nec molestie. Fusce nec semper ante. Donec aliquam cursus purus, nec tincidunt purus molestie quis. Mauris facilisis commodo nisl, aliquam aliquet est ullamcorper et. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam hendrerit massa nulla, iaculis eleifend nisl feugiat vitae. Praesent ac maximus libero, ut commodo lectus.</p>
      </div>
      <div
        id="panel-anchor-2"
        role="tabpanel"
        aria-labelledby="panel-anchor-2-title"
        hidden
      >
        <h2 id="panel-anchor-2-title">Panel 2</h2>
        <p>Aenean congue accumsan nunc sit amet rutrum. Aliquam erat volutpat. Pellentesque finibus commodo nisl, in venenatis felis sodales in. Fusce magna sapien, aliquet quis odio commodo, consequat commodo nulla. Vestibulum ac est non mi pulvinar pharetra. Pellentesque in urna finibus, elementum ex et, sodales risus. Vestibulum tristique euismod erat semper dignissim.</p>
      </div>
      <div
        id="panel-anchor-3"
        role="tabpanel"
        aria-labelledby="panel-anchor-3-title"
        hidden
      >
        <h2 id="panel-anchor-3-title">Panel 3</h2>
        <p>Fusce et felis volutpat, faucibus augue ac, porta nibh. Duis convallis vel mauris at tempor. Nulla scelerisque ipsum ac purus ultrices condimentum. Duis quis sagittis nibh. Aliquam erat volutpat. Aenean diam mi, congue vel ante ac, cursus scelerisque nibh. Donec felis tortor, maximus eget lacus a, congue rutrum dui. Cras sit amet nulla consequat, aliquet ipsum quis, tristique tortor. Integer pharetra rhoncus luctus.</p>
      </div>
    </div>
    <ul role="tablist" aria-label="Panel controls">
      <li class="flex" role="presentation">
        <a
          id="tabs-anchor-tab-1"
          href="#panel-anchor-1"
          role="tab"
          aria-selected="false"
          data-testid="tabs-anchor-tab-1"
        >
          Panel 1
        </a>
      </li>
      <li class="flex" role="presentation">
        <a
          id="tabs-anchor-tab-2"
          href="#panel-anchor-2"
          role="tab"
          aria-selected="false"
          data-testid="tabs-anchor-tab-2"
        >
          Panel 2
        </a>
      </li>
      <li class="flex" role="presentation">
        <a
          id="tabs-anchor-tab-3"
          href="#panel-anchor-3"
          role="tab"
          aria-selected="false"
          data-testid="tabs-anchor-tab-3"
        >
          Panel 3
        </a>
      </li>
    </ul>
  </frm-tabs>
`
