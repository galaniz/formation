export default /* html */`
  <frm-collapsible
    id="clp-hover"
    class="collapsible relative"
    hoverable
    data-testid="clp-hover"
  >
    <button
      type="button"
      data-collapsible-toggle
      data-testid="clp-hover-toggle"
    >
      Hover
    </button>
    <div class="collapsible-panel absolute left-0 mt-5 e-trans" data-collapsible-panel>
      <ul>
        <li>Nunc cursus eu nibh ac pellentesque.</li>
        <li>Phasellus semper vitae tellus sit amet mattis.</li>
        <li>Morbi finibus orci vitae nulla condimentum accumsan.</li>
        <li>Nullam arcu tellus hendrerit ac erat in ultrices rutrum nisi.</li>
        <li>Vivamus tincidunt felis vel tellus gravida.</li>
        <li>Phasellus ornare dapibus lectus ut varius.</li>
      </ul>
    </div>
  </frm-collapsible>
`
