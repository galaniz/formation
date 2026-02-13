export default /* html */`
  <frm-form
    id="frm-partial-none"
    error-inline="frm-error-inline-none"
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
          data-testid="frm-partial-none-name"
          required
        >
      </div>
      <div>
        <input
          id="frm-partial-none-email"
          name="email"
          type="email"
          data-form-input="email"
          data-form-empty="Email is required"
          data-form-invalid="Email is invalid"
          data-testid="frm-partial-none-email"
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
          <div>
            <input
              id="frm-partial-none-public"
              name="privacy"
              type="radio"
              value="public"
              data-form-input="radio"
              data-testid="frm-partial-none-public"
            >
          </div>
          <div>
            <input
              id="frm-partial-none-contacts"
              name="privacy"
              type="radio"
              value="contacts"
              data-form-input="radio"
              data-testid="frm-partial-none-contacts"
            >
          </div>
          <div>
            <input
              id="frm-partial-none-private"
              name="privacy"
              type="radio"
              value="private"
              data-form-input="radio"
              data-testid="frm-partial-none-private"
            >
          </div>
        </fieldset>
      </div>
      <div data-form-field="fieldset">
        <fieldset>
          <div data-form-field="select">
            <select
              id="frm-partial-none-month"
              name="month"
              data-form-input="select"
              data-form-empty="Month is required"
              data-testid="frm-partial-none-month"
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
              id="frm-partial-none-day"
              name="day"
              type="text"
              maxlength="2"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Day is required"
              data-testid="frm-partial-none-day"
              required
            >
          </div>
          <div data-form-field="text">
            <input
              id="frm-partial-none-year"
              name="year"
              type="text"
              minlength="4"
              maxlength="4"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Year is required"
              data-testid="frm-partial-none-year"
              required
            >
          </div>
        </fieldset>
      </div>
      <div data-form-field="submit">
        <button type="submit" data-testid="frm-partial-none-submit">Update</button>
      </div>
    </form>
  </frm-form>
`
