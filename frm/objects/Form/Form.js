export default /* html */`
  <frm-form
    id="frm"
    error-inline="frm-error-inline"
    error-summary="frm-error-summary"
    error="frm-error"
    success="frm-success"
    loader="frm-loader"
  >
    <form novalidate>
      <div data-form-field="text">
        <label for="frm-name">
          <span data-form-label-text>Name</span>
        </label>
        <input
          id="frm-name"
          name="name"
          type="text"
          data-form-input="text"
          data-form-empty="Name is required"
          data-testid="frm-name"
          required
        >
      </div>
      <div data-form-field="email">
        <label for="frm-email">
          <span data-form-label-text>Email</span>
        </label>
        <input
          id="frm-email"
          name="email"
          type="email"
          data-form-input="email"
          data-form-empty="Email is required"
          data-form-invalid="Email is invalid"
          data-testid="frm-email"
          required
        >
      </div>
      <div data-form-field="fieldset">
        <fieldset
          data-form-empty="Privacy required"
          data-form-invalid="Privacy is invalid"
          data-form-required
        >
          <legend id="frm-privacy">
            <span data-form-legend-text>Privacy</span>
          </legend>
          <div>
            <input
              id="frm-public"
              name="privacy"
              type="radio"
              value="public"
              data-form-input="radio"
              data-testid="frm-public"
            >
            <label for="frm-public">
              <span data-form-label-text>Public</span>
            </label>
          </div>
          <div>
            <input
              id="frm-contacts"
              name="privacy"
              type="radio"
              value="contacts"
              data-form-input="radio"
              data-testid="frm-contacts"
            >
            <label for="frm-contacts">
              <span data-form-label-text>Contacts</span>
            </label>
          </div>
          <div>
            <input
              id="frm-private"
              name="privacy"
              type="radio"
              value="private"
              data-form-input="radio"
              data-testid="frm-private"
            >
            <label for="frm-private">
              <span data-form-label-text>Private</span>
            </label>
          </div>
        </fieldset>
      </div>
      <div data-form-field="fieldset">
        <fieldset>
          <legend id="frm-cookies">
            <span data-form-legend-text>Cookies</span>
          </legend>
          <div>
            <input
              id="frm-functional"
              name="cookies"
              type="checkbox"
              value="functional"
              data-form-input="checkbox"
              data-testid="frm-functional"
            >
            <label for="frm-functional">
              <span data-form-label-text>Functional</span>
            </label>
          </div>
          <div>
            <input
              id="frm-analytics"
              name="cookies"
              type="checkbox"
              value="analytics"
              data-form-input="checkbox"
              data-testid="frm-analytics"
            >
            <label for="frm-analytics">
              <span data-form-label-text>Analytics</span>
            </label>
          </div>
          <div>
            <input
              id="frm-performance"
              name="cookies"
              type="checkbox"
              value="performance"
              data-form-input="checkbox"
              data-testid="frm-performance"
            >
            <label for="frm-performance">
              <span data-form-label-text>Performance</span>
            </label>
          </div>
        </fieldset>
      </div>
      <div data-form-field="fieldset">
        <fieldset>
          <legend id="frm-dob">
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
              data-testid="frm-month"
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
              data-testid="frm-day"
              required
            >
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
              data-testid="frm-year"
              required
            >
          </div>
        </fieldset>
      </div>
      <div data-form-field="file">
        <label for="frm-profile">
          <span data-form-label-text>Profile</span>
        </label>
        <input
          id="frm-profile"
          name="profile"
          type="file"
          accept="image/png, image/jpeg"
          data-form-input="file"
          data-testid="frm-profile"
        >
      </div>
      <div data-form-field="checkbox">
        <input
          id="frm-notifications"
          type="checkbox"
          name="notifications"
          value="1"
          data-form-input="checkbox"
          data-testid="frm-notifications"
        >
        <label for="frm-notifications">
          <span data-form-label-text>Notifications</span>
        </label>
      </div>
      <input
        id="frm-hidden"
        type="hidden"
        name="hidden"
        value="hidden"
        data-form-input="hidden"
      >
      <div data-form-field="submit">
        <button type="submit" data-testid="frm-submit">Update</button>
      </div>
    </form>
  </frm-form>
`
