export default /* html */`
  <template id="frm-error-inline">
    <span class="flex">
      Error: 
      <span data-form-error-text></span>
    </span>
  </template>
  <template id="frm-error-summary">
    <div tabindex="-1" data-testid="frm-error-summary">
      <h2>Form error summary</h2>
      <ul></ul>
    </div>
  </template>
  <template id="frm-error">
    <div tabindex="-1" role="alert">
      <h2>Form error</h2>
    </div>
  </template>
  <template id="frm-success">
    <div tabindex="-1" role="alert">
      <h2>Form success</h2>
    </div>
  </template>
  <template id="frm-loader">
    <div tabindex="-1">Form loader</div>
  </template>
`