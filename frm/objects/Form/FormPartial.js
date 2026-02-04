export default /* html */`
  <frm-form
    id="frm-partial"
    error-inline="frm-error-inline"
  >
    <form novalidate>
      <div data-form-field="text">
        <label>
          <span data-form-label-text>Name</span>
        </label>
        <input
          type="text"
          data-form-input="text"
          data-form-empty="Name is required"
          data-testid="frm-partial-name"
          required
        >
      </div>
      <div>
        <input
          id="frm-partial-email"
          name="email"
          type="email"
          data-form-input="email"
          data-form-empty="Email is required"
          data-form-invalid="Email is invalid"
          data-testid="frm-partial-email"
          required
        >
      </div>
      <div data-form-field="fieldset">
        <fieldset
          data-form-empty="Privacy required"
          data-form-invalid="Privacy is invalid"
          data-form-required
        >
          <legend>
            <span data-form-legend-text>Privacy</span>
          </legend>
          <div data-form-field="radio">
            <input
              id="frm-partial-public"
              name="privacy"
              type="radio"
              value="public"
              data-form-input="radio"
              data-testid="frm-partial-public"
            >
          </div>
          <div data-form-field="radio">
            <input
              id="frm-partial-contacts"
              name="privacy"
              type="radio"
              value="contacts"
              data-form-input="radio"
              data-testid="frm-partial-contacts"
            >
          </div>
          <div data-form-field="radio">
            <input
              id="frm-partial-private"
              name="privacy"
              type="radio"
              value="private"
              data-form-input="radio"
              data-testid="frm-partial-private"
            >
          </div>
        </fieldset>
      </div>
      <div data-form-field="fieldset">
        <fieldset>
          <div data-form-field="select">
            <select
              id="frm-partial-month"
              name="month"
              data-form-input="select"
              data-form-empty="Month is required"
              data-testid="frm-partial-month"
              required
            >
              <option value="">Select a month</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div data-form-field="text">
            <input
              id="frm-partial-day"
              name="day"
              type="text"
              maxlength="2"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Day is required"
              data-testid="frm-partial-day"
              required
            >
          </div>
          <div data-form-field="text">
            <input
              id="frm-partial-year"
              name="year"
              type="text"
              minlength="4"
              maxlength="4"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Year is required"
              data-testid="frm-partial-year"
              required
            >
          </div>
        </fieldset>
      </div>
      <div data-form-field="submit">
        <button type="submit" data-testid="frm-partial-submit">Update</button>
      </div>
    </form>
  </frm-form>
`
