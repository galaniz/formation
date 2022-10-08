/**
 * Objects: form validation and get values
 *
 * @param {object} args {
 *  @param {nodelist} inputs
 *  @param {string} fieldClass
 *  @param {string} groupClass
 *  @param {string} labelClass
 *  @param {boolean} submitted
 *  @param {boolean} errorShake
 *  @param {string} errorClass
 *  @param {string} errorShakeClass
 *  @param {function} onValidate
 */

/* Imports */

import {
  addClass,
  removeClass,
  closest,
  urlEncode
} from '../../utils'

/* Class */

class Form {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      inputs = null,
      fieldClass = '',
      groupClass = '',
      labelClass = '',
      submitted = false,
      errorShake = false,
      errorClass = '',
      errorShakeClass = 'a-shake',
      onValidate = () => {}
    } = args

    this.inputs = inputs
    this.fieldClass = fieldClass
    this.groupClass = groupClass
    this.labelClass = labelClass
    this.submitted = submitted
    this.errorShake = errorShake
    this.errorClass = errorClass
    this.errorShakeClass = errorShakeClass
    this.onValidate = onValidate

    /**
     * Internal variables
     */

    /* Regex for url, email inputs */

    this._exp = {
      url: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
      email: /^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    }

    /* Input data goes here */

    this._inputGroups = {}

    /* Input types by name */

    this._inputTypes = {}

    /* Input labels by name */

    this._inputLabels = {}

    /* Input email labels by name */

    this._inputEmailLabels = {}

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) { return false }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.inputs || !this.fieldClass) { return false }

    this.inputs = Array.from(this.inputs)

    if (this.errorClass) { this.errorClass = ' ' + this.errorClass }

    /* Check if already got field group */

    const fieldGroupSet = []

    /* Loop through inputs to insert input data into inputGroups */

    this.inputs.forEach((input) => {
      const name = input.name

      /* Already exists in inputGroups so just push input into inputs array */

      if (Object.getOwnPropertyDescriptor(this._inputGroups, name)) {
        this._inputGroups[name].inputs.push(input)

        if (fieldGroupSet.indexOf(name) === -1) {
          const fieldGroup = closest(input, this.groupClass, 10)

          if (fieldGroup) { this._inputGroups[name].field = fieldGroup }

          fieldGroupSet.push(name)
        }
      } else {
        /* Doesn't exist so create new object of input data */

        const reqAttr = input.getAttribute('aria-required')
        const required = (reqAttr === 'true' || reqAttr === '1')
        let type = input.tagName.toLowerCase()

        if (type === 'input') { type = input.type }

        this._inputTypes[name] = type

        const emailLabel = input.getAttribute('data-email-label')

        if (emailLabel) { this._inputEmailLabels[name] = emailLabel }

        const field = closest(input, this.fieldClass)
        const label = field.querySelector('.' + this.labelClass)

        let labelText = ''

        if (label) { labelText = label.textContent }

        this._inputLabels[name] = labelText

        this._inputGroups[name] = {
          inputs: [input], // array for checkboxes and radio buttons
          label,
          field,
          required,
          type,
          values: [],
          valid: false
        }
      }

      /* Listen on change so can validate then rather than submit */

      input.addEventListener('change', this._onChange.bind(this))
    })

    return true
  }

  /**
   * Internal helper methods
   */

  _validateInputs (inputs, type, required) {
    const values = []
    let message = ''
    let valid = false

    /* Get values from inputGroup */

    inputs.forEach((input) => {
      let value = ''

      switch (type) {
        case 'checkbox':
        case 'radio':
          value = (input.checked ? input.value.trim() : '')
          break
        case 'select':
          value = input.options[input.selectedIndex].value.trim()
          break
        default:
          value = input.value.trim()
      }

      if (value !== '') { values.push(value) }
    })

    /* Check if has values */

    if (values.length === 0) {
      if (required) {
        valid = false
        message = 'This field is required'
      } else {
        valid = true
      }
    } else {
      /* Check if inputs like email, url... are valid */

      switch (type) {
        case 'email':
          if (values[0].match(this._exp.email)) {
            valid = true
          } else {
            valid = false
            message = 'Please enter a valid email'
          }
          break
        case 'url':
          if (values[0].match(this._exp.url)) {
            valid = true
          } else {
            valid = false
            message = 'Please enter a valid URL'
          }
          break
        default:
          valid = true
      }
    }

    return {
      values,
      message,
      valid
    }
  }

  _validateGroup (inputGroup, name) {
    /* Get inputGroup data */

    let validGroup = true
    const inputs = inputGroup.inputs
    const field = inputGroup.field
    const label = inputGroup.label
    const type = inputGroup.type
    const required = inputGroup.required

    /* Validate inputGroup */

    const validate = this._validateInputs(inputs, type, required)
    const values = validate.values
    const valid = validate.valid
    const message = validate.message

    if (!valid) {
      this._setErrorMessage(inputs, name, label, field, message)
      validGroup = false
    } else {
      this._removeErrorMessage(inputs, name, label, field)
    }

    /* Save valid state and values in inputGroup */

    inputGroup.values = values
    inputGroup.valid = valid

    this.onValidate()

    return validGroup
  }

  _setErrorMessage (inputs, name, label, field, message) {
    /* Error element id */

    const errorID = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorID)

    /* Output */

    if (error !== null) {
      const messageElement = error.querySelector('.o-form-error__message')
      messageElement.textContent = message
    } else {
      label.insertAdjacentHTML('beforeend', `
        <div id="${errorID}" class="o-form-error${this.errorClass}">
          <span class="o-form-error__message">
            ${message}
          </span>
        </div>
      `)
    }

    if (this.errorShake) { addClass(field, this.errorShakeClass) }

    /* Set inputs as invalid */

    inputs.forEach((input) => {
      input.setAttribute('aria-invalid', true)
    })
  }

  _removeErrorMessage (inputs, name, label, field) {
    /* Error element id */

    const errorID = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorID)

    if (error !== null) { label.removeChild(error) }

    if (this.errorShake) { removeClass(field, this.errorShakeClass) }

    /* Set inputs as valid */

    inputs.forEach((input) => {
      input.setAttribute('aria-invalid', false)
    })
  }

  _onChange (e) {
    const input = e.currentTarget
    const name = input.name
    const inputGroup = this._inputGroups[name]

    if (this.submitted) { this._validateGroup(inputGroup, name) }
  }

  /**
   * Public methods
   */

  validate () {
    let validForm = true

    /* Validate individual input groups */

    for (const name in this._inputGroups) {
      const validGroup = this._validateGroup(this._inputGroups[name], name)

      if (!validGroup) { validForm = false }
    }

    return validForm
  }

  getFormValues (urlEncoded = false, filter = false) {
    let formValues = {}
    const usedEmailLabels = []

    for (const name in this._inputGroups) {
      const inputGroup = this._inputGroups[name]
      let values = inputGroup.values

      if (values.length === 0) {
        values = ''
      } else if (values.length === 1) {
        values = values[0]
      }

      let formValuesArgs = {
        value: values,
        type: this._inputTypes[name]
      }

      if (Object.getOwnPropertyDescriptor(this._inputEmailLabels, name)) {
        const emailLabel = this._inputEmailLabels[name]

        if (usedEmailLabels.indexOf(emailLabel) === -1) { formValuesArgs.email_label = emailLabel }

        usedEmailLabels.push(emailLabel)
      } else {
        formValuesArgs.label = this._inputLabels[name]
      }

      if (filter && typeof filter === 'function') { formValuesArgs = filter(formValuesArgs, inputGroup.inputs) }

      formValues[name] = formValuesArgs
    }

    formValues = { inputs: formValues }

    if (urlEncoded) { formValues = urlEncode(formValues) }

    return formValues
  }

  clear (exclude = []) {
    for (const name in this._inputGroups) {
      const inputGroup = this._inputGroups[name]
      const inputs = inputGroup.inputs
      const field = inputGroup.field
      const type = inputGroup.type

      /* Remove error markup if exists */

      this._removeErrorMessage(inputs, name, field)

      if (exclude.indexOf(name) === -1) {
        inputs.forEach((input) => {
          switch (type) {
            case 'checkbox':
            case 'radio':
              input.checked = false
              break
            default:
              input.value = ''
          }

          /* Clear floated label */

          setTimeout(() => {
            input.focus()
            input.blur()
          }, 100)
        })
      }
    }
  }
} // End Form

/* Exports */

export default Form
