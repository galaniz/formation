export default /* html */`
  <frm-form id="frm" error-inline="frm-error-inline">
    <form novalidate>
      <div data-form-field="fieldset">
        <fieldset>
          <legend id="frm-legend">
            <span data-form-legend-text>Date of birth</span>
          </legend>
          <div data-form-field="select">
            <label for="frm-month">
              <span data-form-label-text>Month</span>
            </label>
            <select
              id="frm-month"
              name="month"
              data-form-input="select"
              data-form-empty="Month is required"
              data-form-required
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
            <label for="frm-day">
              <span data-form-label-text>Day</span>
            </label>
            <input
              id="frm-day"
              name="day"
              type="text"
              maxlength="2"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Day is required"
              data-form-required
            />
          </div>
          <div data-form-field="text">
            <label for="frm-year">
              <span data-form-label-text>Year</span>
            </label>
            <input
              id="frm-year"
              name="year"
              type="text"
              minlength="4"
              maxlength="4"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Year is required"
              data-form-required
            />
          </div>
        </fieldset>
      </div>
      <div data-form-field="submit">
        <button type="submit">Submit</button>
      </div>
    </form>
    <template id="frm-error-inline">
      <span class="flex">
        Error: 
        <span data-form-error-text></span>
      </span>
    </template>
  </frm-form>
`
