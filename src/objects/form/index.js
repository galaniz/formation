/**
 * Objects: form validation and get values
 *
 * @param {object} args {
 *  @param {nodelist} inputs
 *  @param {string} fieldClass
 *  @param {string} groupClass
 *  @param {string} labelClass
 *  @param {boolean} submitted
 *  @param {function} onValidate
 */

/* Imports */

import {
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
      errorTemplate = "<span id='%id'><span id='%id-text'>%message</span></span>",
      errorSummary = {
        container: null,
        list: null
      },
      submitted = false,
      onValidate = () => {}
    } = args

    this.inputs = inputs
    this.fieldClass = fieldClass
    this.groupClass = groupClass
    this.labelClass = labelClass
    this.errorTemplate = errorTemplate
    this.errorSummary = errorSummary
    this.submitted = submitted
    this.onValidate = onValidate

    /**
     * Internal variables
     */

    /* Regex source: https://emailregex.com && https://urlregex.com */

    this._exp = {
      url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/,
      email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }

    /* Input data goes here */

    this._inputGroups = {}

    /* Input types by name */

    this._inputTypes = {}

    /* Input labels by name */

    this._inputLabels = {}

    /* Input email labels by name */

    this._inputEmailLabels = {}

    /* Store errors for summary list */

    this._errorSummaryList = {
      ids: [],
      messages: {}
    }

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

      /* Listen on blur so can validate then rather than only submit */

      input.addEventListener('blur', this._onBlur.bind(this))
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
            message = 'Enter a valid email'
          }
          break
        case 'url':
          if (values[0].match(this._exp.url)) {
            valid = true
          } else {
            valid = false
            message = 'Enter a valid URL'
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

      if (label) {
        if (!this._errorSummaryList.ids.includes(label.id)) {
          console.log(label, label.id)
          this._errorSummaryList.ids.push(label.id)
        }

        this._errorSummaryList.messages[label.id] = message
      }

      validGroup = false
    } else {
      this._removeErrorMessage(inputs, name, label, field)

      if (label) {
        if (this._errorSummaryList.ids.includes(label.id)) {
          this._errorSummaryList.ids = this._errorSummaryList.ids.filter((id) => {
            return label.id !== id
          })

          this._errorSummaryList.messages[label.id] = ''
        }
      }
    }

    /* Reset summary list */

    this._setErrorSummaryList()

    /* Save valid state and values in inputGroup */

    inputGroup.values = values
    inputGroup.valid = valid

    this.onValidate()

    return validGroup
  }

  _setErrorMessage (inputs, name, label, field, message) {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorId)

    /* Output */

    if (error !== null) {
      const messageElement = error.querySelector(`#${errorId}-text`)
      messageElement.textContent = message
    } else {
      const errorHtml = this.errorTemplate.replace(/%id/g, errorId).replace(/%message/g, message)
      label.insertAdjacentHTML('beforeend', errorHtml)
    }

    /* Set inputs as invalid */

    inputs.forEach((input) => {
      input.setAttribute('aria-invalid', true)
    })
  }

  _removeErrorMessage (inputs, name, label, field) {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorId)

    if (error !== null) { label.removeChild(error) }

    /* Set inputs as valid */

    inputs.forEach((input) => {
      input.setAttribute('aria-invalid', false)
    })
  }

  _displayErrorSummary (display = true) {
    if (!this.errorSummary.container) {
      return
    }

    const displayValue = display ? 'block' : 'none'
    this.errorSummary.container.style.setProperty('display', displayValue)
  }

  _setErrorSummaryList () {
    if (!this.errorSummary.list) {
      return
    }

    if (!this._errorSummaryList.ids.length) {
      this._displayErrorSummary(false)
    }

    const frag = new window.DocumentFragment()

    this._errorSummaryList.ids.forEach((id) => {
      const li = document.createElement('LI')
      const message = this._errorSummaryList.messages[id]

      li.innerHTML = `<a href="#${id}">${message}</a>`

      frag.appendChild(li)
    })

    this.errorSummary.list.innerHTML = ''
    this.errorSummary.list.appendChild(frag)
  }

  _onBlur (e) {
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

    this._displayErrorSummary(!validForm)

    if (!validForm) {
      if (this.errorSummary.container) {
        this.errorSummary.container.focus()
      }
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
