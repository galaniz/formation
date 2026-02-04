export default /* html */`
  <frm-form
    id="frm-change"
    error-inline="frm-error-inline"
    error-on="change"
  >
    <form novalidate>
      <div data-form-field="text">
        <label for="frm-change-name">
          <span data-form-label-text>Name</span>
        </label>
        <input
          id="frm-change-name"
          name="name"
          type="text"
          data-form-input="text"
          data-form-empty="Name is required"
          data-testid="frm-change-name"
          required
        >
      </div>
      <div data-form-field="email">
        <label for="frm-change-email">
          <span data-form-label-text>Email</span>
        </label>
        <input
          id="frm-change-email"
          name="email"
          type="email"
          data-form-input="email"
          data-form-empty="Email is required"
          data-form-invalid="Email is invalid"
          data-testid="frm-change-email"
          required
        >
      </div>
      <div data-form-field="fieldset">
        <fieldset
          data-form-empty="Privacy required"
          data-form-invalid="Privacy is invalid"
          data-form-required
        >
          <legend id="frm-change-privacy">
            <span data-form-legend-text>Privacy</span>
          </legend>
          <div data-form-field="radio">
            <input
              id="frm-change-public"
              name="privacy"
              type="radio"
              value="public"
              data-form-input="radio"
              data-testid="frm-change-public"
            >
            <label for="frm-change-public">
              <span data-form-label-text>Public</span>
            </label>
          </div>
          <div data-form-field="radio">
            <input
              id="frm-change-contacts"
              name="privacy"
              type="radio"
              value="contacts"
              data-form-input="radio"
              data-testid="frm-change-contacts"
            >
            <label for="frm-change-contacts">
              <span data-form-label-text>Contacts</span>
            </label>
          </div>
          <div data-form-field="radio">
            <input
              id="frm-change-private"
              name="privacy"
              type="radio"
              value="private"
              data-form-input="radio"
              data-testid="frm-change-private"
            >
            <label for="frm-change-private">
              <span data-form-label-text>Private</span>
            </label>
          </div>
        </fieldset>
      </div>
      <div data-form-field="fieldset">
        <fieldset>
          <legend id="frm-change-dob">
            <span data-form-legend-text>Date of birth</span>
          </legend>
          <div data-form-field="select">
            <label for="frm-change-month">
              <span data-form-label-text>Month</span>
            </label>
            <select
              id="frm-change-month"
              name="month"
              data-form-input="select"
              data-form-empty="Month is required"
              data-testid="frm-change-month"
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
            <label for="frm-change-day">
              <span data-form-label-text>Day</span>
            </label>
            <input
              id="frm-change-day"
              name="day"
              type="text"
              maxlength="2"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Day is required"
              data-testid="frm-change-day"
              required
            >
          </div>
          <div data-form-field="text">
            <label for="frm-change-year">
              <span data-form-label-text>Year</span>
            </label>
            <input
              id="frm-change-year"
              name="year"
              type="text"
              minlength="4"
              maxlength="4"
              pattern="[0-9]*"
              inputmode="numeric"
              data-form-input="text"
              data-form-empty="Year is required"
              data-testid="frm-change-year"
              required
            >
          </div>
        </fieldset>
      </div>
      <div data-form-field="file">
        <label for="frm-change-profile">
          <span data-form-label-text>Profile</span>
        </label>
        <input
          id="frm-change-profile"
          name="profile"
          type="file"
          accept="image/png, image/jpeg"
          data-form-input="file"
          data-testid="frm-change-profile"
        >
      </div>
      <div data-form-field="checkbox">
        <input
          id="frm-change-notifications"
          type="checkbox"
          name="notifications"
          value="1"
          data-form-input="checkbox"
          data-testid="frm-change-notifications"
        >
        <label for="frm-change-notifications">
          <span data-form-label-text>Notifications</span>
        </label>
      </div>
      <input
        id="frm-change-hidden"
        type="hidden"
        name="hidden"
        value="hidden"
        data-form-input="hidden"
      >
      <div data-form-field="submit">
        <button type="submit">Update</button>
      </div>
    </form>
  </frm-form>
`
