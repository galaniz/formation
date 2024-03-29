/**
 * Objects - form validation and get values
 *
 * @param {object} args {
 *  @param {NodeList} inputs
 *  @param {string} fieldClass
 *  @param {string} groupClass
 *  @param {string} labelClass
 *  @param {boolean} submitted
 *  @param {function} onValidate
 */

/* Imports */

import { closest, focusSelector, getOuterElements, isItemFocusable } from '../../utils'

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
      email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }

    /* Input data goes here */

    this._inputGroups = {}

    /* Input types by name */

    this._inputTypes = {}

    /* Input labels by name */

    this._inputLabels = {}

    /* Input legends name */

    this._inputLegends = {}

    /* Store errors for summary list */

    this._errorSummaryList = {
      ids: [],
      messages: {},
      items: {}
    }

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.inputs || !this.fieldClass) {
      return false
    }

    this.inputs = Array.from(this.inputs)

    /* Loop through inputs to insert input data into inputGroups */

    this.inputs.forEach((input) => {
      const name = input.name

      /* Already exists in inputGroups so push input into inputs array */

      if (Object.getOwnPropertyDescriptor(this._inputGroups, name)) {
        this._inputGroups[name].inputs.push(input)
      } else {
        /* Doesn't exist so create new object of input data */

        const reqAttr = input.getAttribute('aria-required')
        let required = (reqAttr === 'true' || reqAttr === '1')

        const dataReqAttr = input.getAttribute('data-aria-required') // Required radio buttons and checkboxes in groups
        let excludeAriaInvalid = false

        if (dataReqAttr === 'true' || dataReqAttr === '1') {
          required = true
          excludeAriaInvalid = true
        }

        /* Type */

        let type = input.tagName.toLowerCase()

        if (type === 'input') {
          type = input.type
        }

        this._inputTypes[name] = type

        /* Legend */

        const fieldset = closest(input, this.groupClass)
        let legend = null
        let excludeLabel = false

        if (fieldset) {
          legend = fieldset.querySelector('legend')

          if (legend) {
            this._inputLegends[name] = legend.textContent.replace(' required', '')

            if (type === 'radio' || type === 'checkbox') {
              excludeLabel = true
            }
          }
        }

        /* Field */

        const field = closest(input, this.fieldClass)

        /* Label */

        let label = null
        let labelText = ''

        if (field) {
          label = field.querySelector('.' + this.labelClass)

          if (label && !excludeLabel) {
            labelText = label.textContent.replace(' required', '')
          }

          if (!label && !excludeLabel) {
            labelText = input.getAttribute('aria-label')
          }
        }

        this._inputLabels[name] = labelText

        /* Empty and invalid messages */

        const emptyMessage = input.getAttribute('data-empty-message')
        const invalidMessage = input.getAttribute('data-invalid-message')

        /* Group object */

        this._inputGroups[name] = {
          inputs: [input], // Array for checkboxes and radio buttons
          legend,
          label,
          required,
          type,
          values: [],
          valid: false,
          emptyMessage,
          invalidMessage,
          excludeAriaInvalid
        }
      }

      /* Listen on blur so can validate then rather than only submit */

      input.addEventListener('blur', this._onBlur.bind(this))
    })

    /* Add blur to error summary container */

    if (this.errorSummary.container) {
      this.errorSummary.container.addEventListener('blur', this._onErrorSummaryBlur.bind(this))
    }

    /* Successful init */

    return true
  }

  /**
   * Internal helper methods
   */

  _validateInputs (inputs, type, required, emptyMessage = '', invalidMessage = '') {
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

      if (value !== '') {
        values.push(value)
      }
    })

    /* Check if has values */

    if (values.length === 0) {
      if (required) {
        valid = false
        message = emptyMessage || 'This field is required'
      } else {
        valid = true
      }
    } else {
      /* Check if inputs like email, url... are valid */

      switch (type) {
        case 'email':
          if (values[0].toLowerCase().match(this._exp.email)) {
            valid = true
          } else {
            valid = false
            message = invalidMessage || 'Enter a valid email'
          }
          break
        case 'url':
          if (values[0].toLowerCase().match(this._exp.url)) {
            valid = true
          } else {
            valid = false
            message = invalidMessage || 'Enter a valid URL'
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

    const {
      inputs,
      legend,
      label,
      type,
      required,
      excludeAriaInvalid,
      emptyMessage,
      invalidMessage
    } = inputGroup

    const useLegend = legend && (type === 'radio' || type === 'checkbox')

    const l = useLegend ? legend : label

    const errorId = useLegend ? l.id : inputs[0].id

    /* Validate inputGroup */

    const validate = this._validateInputs(inputs, type, required, emptyMessage, invalidMessage)
    const values = validate.values
    const valid = validate.valid
    const message = validate.message

    if (!valid) {
      this._setErrorMessage(inputs, name, type, l, message, excludeAriaInvalid)

      if (l) {
        if (!this._errorSummaryList.ids.includes(errorId)) {
          this._errorSummaryList.ids.push(errorId)
        }

        this._errorSummaryList.messages[errorId] = message
      }

      validGroup = false
    } else {
      this._removeErrorMessage(inputs, name, type, l, excludeAriaInvalid)

      if (l) {
        if (this._errorSummaryList.ids.includes(errorId)) {
          this._errorSummaryList.ids = this._errorSummaryList.ids.filter((id) => {
            return errorId !== id
          })

          this._errorSummaryList.messages[errorId] = ''
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

  _setErrorMessage (inputs, name, type, label, message, excludeAriaInvalid) {
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

    if (!excludeAriaInvalid) {
      inputs.forEach((input) => {
        input.setAttribute('aria-invalid', true)
      })
    }
  }

  _removeErrorMessage (inputs, name, type, label, excludeAriaInvalid) {
    /* Error element id */

    const errorId = name + '-error'

    /* Check if error element exists */

    const error = document.getElementById(errorId)

    if (error !== null) {
      label.removeChild(error)
    }

    /* Set inputs as valid */

    if (!excludeAriaInvalid) {
      inputs.forEach((input) => {
        input.setAttribute('aria-invalid', false)
      })
    }
  }

  _displayErrorSummary (display = true) {
    if (!this.errorSummary.container) {
      return
    }

    this.errorSummary.container.style.setProperty('display', display ? 'block' : 'none')
  }

  _setErrorSummaryList () {
    if (!this.errorSummary.list) {
      return
    }

    if (!this._errorSummaryList.ids.length) {
      this._displayErrorSummary(false)
    }

    const frag = new window.DocumentFragment()
    let focusItem = null

    this._errorSummaryList.ids.forEach((id) => {
      const existingItem = this._errorSummaryList.items[id] || {}
      const { message, item } = existingItem

      let currentItem = null
      const currentMessage = this._errorSummaryList.messages[id]

      if (existingItem && message === currentMessage) {
        currentItem = item

        if (currentItem.firstElementChild === document.activeElement) {
          focusItem = document.activeElement
        }
      }

      if (!currentItem) {
        currentItem = document.createElement('LI')
        currentItem.innerHTML = `<a href="#${id}">${currentMessage}</a>`
      }

      const returnItem = frag.appendChild(currentItem)

      this._errorSummaryList.items[id] = {
        id,
        message: currentMessage,
        item: returnItem
      }
    })

    this.errorSummary.list.innerHTML = ''
    this.errorSummary.list.appendChild(frag)

    if (focusItem) {
      focusItem.focus()
    }
  }

  _onBlur (e) {
    const input = e.currentTarget
    const name = input.name
    const inputGroup = this._inputGroups[name]

    if (this.submitted) {
      setTimeout(() => {
        let focusInErrorSummary = false

        if (this.errorSummary.container) {
          focusInErrorSummary = this.errorSummary.container.contains(document.activeElement)
        }

        this._validateGroup(inputGroup, name)

        if (this._errorSummaryList.ids.length) {
          this._displayErrorSummary(true)
        } else {
          let prevFocusItem = null

          /* Previous focusable element from error summary */

          getOuterElements(
            this.errorSummary.container,
            'prev',
            (store) => {
              let stop = false

              for (let i = 0; i < store.length; i++) {
                const item = store[i]

                if (isItemFocusable(item)) {
                  stop = true
                  prevFocusItem = item
                  break
                } else {
                  const f = item.querySelectorAll(focusSelector)

                  if (f.length) {
                    stop = true
                    prevFocusItem = f[0]
                    break
                  }
                }
              }

              return { store, stop }
            }
          )

          if (focusInErrorSummary && prevFocusItem) {
            prevFocusItem.focus()
          }
        }
      }, 10) // Delay to get correct active element
    }
  }

  _onErrorSummaryBlur () {
    this.errorSummary.container.removeAttribute('role')
  }

  /**
   * Public methods
   */

  validate () {
    let validForm = true

    /* Validate individual input groups */

    Object.keys(this._inputGroups || {}).forEach((name) => {
      const validGroup = this._validateGroup(this._inputGroups[name], name)

      if (!validGroup) {
        validForm = false
      }
    })

    this._displayErrorSummary(!validForm)

    if (!validForm) {
      if (this.errorSummary.container) {
        this.errorSummary.container.setAttribute('role', 'alert')
        this.errorSummary.container.focus()
      }
    }

    return validForm
  }

  appendFormValues (formValues, filter = false) {
    formValues.inputs = {}

    Object.keys(this._inputGroups || {}).forEach((name) => {
      const inputGroup = this._inputGroups[name]
      let values = inputGroup.values

      if (values.length === 0) {
        values = ''
      } else if (values.length === 1) {
        values = values[0]
      }

      let formObj = {
        value: values,
        type: this._inputTypes[name]
      }

      if (Object.getOwnPropertyDescriptor(this._inputLegends, name)) {
        const legend = this._inputLegends[name]

        if (legend) {
          formObj.legend = legend
        }
      }

      formObj.label = this._inputLabels[name]

      if (filter && typeof filter === 'function') {
        formObj = filter(formObj, inputGroup.inputs)
      }

      formValues.inputs[name] = formObj
    })
  }

  clearErrorMessages () {
    Object.keys(this._inputGroups || {}).forEach((name) => {
      const inputGroup = this._inputGroups[name]

      const {
        inputs,
        type,
        legend,
        label
      } = inputGroup

      const l = legend && (type === 'radio' || type === 'checkbox') ? legend : label

      this._removeErrorMessage(inputs, name, type, l)
    })

    this._displayErrorSummary(false)
  }
}

/* Exports */

export default Form
