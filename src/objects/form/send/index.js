/**
 * Objects: send and validate form
 *
 * @param {object} args {
 *  @param {string} id
 *  @param {HTMLElement} form
 *  @param {string} groupClass
 *  @param {string} fieldClass
 *  @param {string} labelClass
 *  @param {HTMLElement} submit
 *  @param {nodelist} inputs
 *  @param {boolean} filterInputs
 *  @param {object} data
 *  @param {array} loaders
 *  @param {string} url
 *  @param {function} onSuccess
 *  @param {function} onError
 *  @param {string} errorTemplate
 *  @param {object} result
 *  @param {boolean} clearOnSuccess
 *  @param {boolean} JSONresponse
 * }
 */

/* Imports */

import {
  mergeObjects,
  setLoaders,
  request
} from '../../../utils'

import Form from '../index'

/* Class */

class Send {
  /**
   * Constructor
   */

  constructor (args) {
    /*
     * Public variables
     */

    const {
      id = '',
      form = null,
      groupClass = '',
      fieldClass = '',
      labelClass = '',
      submit = null,
      inputs = null,
      filterInputs = false,
      data = {},
      loaders = [],
      url = '',
      onSuccess = () => {},
      onError = () => {},
      errorTemplate = '',
      result = {},
      clearOnSuccess = true,
      JSONresponse = true
    } = args

    this.id = id
    this.form = form
    this.groupClass = groupClass
    this.fieldClass = fieldClass
    this.labelClass = labelClass
    this.submit = submit
    this.inputs = inputs
    this.filterInputs = filterInputs
    this.data = data
    this.loaders = loaders
    this.url = url
    this.onSuccess = onSuccess
    this.onError = onError
    this.errorTemplate = errorTemplate
    this.result = result
    this.clearOnSuccess = clearOnSuccess
    this.JSONresponse = JSONresponse

    this.result = mergeObjects(
      {
        error: {
          summary: {
            container: null,
            list: null
          },
          container: null,
          primary: null,
          secondary: null,
          message: {
            primary: 'Sorry, there is a problem with the service.',
            secondary: 'Try again later.'
          }
        },
        success: {
          container: null,
          primary: null,
          secondary: null,
          message: {
            primary: 'Success!',
            secondary: ''
          }
        }
      },
      this.result
    )

    /**
     * Internal variables
     */

    /* Form for validation */

    this._form = null

    /* Keep track of error/success */

    this._error = false

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

    let error = false
    const required = [
      'id',
      'form',
      'groupClass',
      'fieldClass',
      'labelClass',
      'submit',
      'inputs',
      'url'
    ]

    required.forEach((r) => {
      if (!this[r]) {
        error = true
      }
    })

    if (error) { return false }

    /* Prepare for validation */

    const formArgs = {
      groupClass: this.groupClass,
      fieldClass: this.fieldClass,
      labelClass: this.labelClass,
      inputs: this.inputs,
      errorSummary: this.result.error.summary
    }

    if (this.errorTemplate) {
      formArgs.errorTemplate = this.errorTemplate
    }

    this._form = new Form(formArgs)

    /* Add event listeners */

    this.form.addEventListener('submit', this._submit.bind(this))

    return true
  }

  /**
   * Helper methods
   */

  /* Display results of form submission */

  _displayResult (error = false) {
    const primaryMessage = this.result[error ? 'error' : 'success'].message.primary
    const secondaryMessage = this.result[error ? 'error' : 'success'].message.secondary
    const container = this.result[error ? 'error' : 'success'].container
    const primaryContainer = this.result[error ? 'error' : 'success'].primary
    const secondaryContainer = this.result[error ? 'error' : 'success'].secondary

    if (primaryContainer && primaryMessage) {
      primaryContainer.textContent = primaryMessage
    }

    if (secondaryContainer && secondaryMessage) {
      secondaryContainer.textContent = secondaryMessage
    }

    if (container) {
      container.style.setProperty('display', 'block')
      container.focus()
    }

    this._error = error

    /* Set loaders off */

    if (this.loaders.length) {
      setLoaders(this.loaders, [this.submit], false)
    }
  }

  _hideResult () {
    const errorContainer = this.result.error.container
    const successContainer = this.result.success.container

    if (errorContainer) {
      errorContainer.style.setProperty('display', 'none')
    }

    if (successContainer) {
      successContainer.style.setProperty('display', 'none')
    }
  }

  /**
   * Event handlers
   */

  _submit (e) {
    e.preventDefault()

    /* Hide result containers */

    this._hideResult()

    /* On change for inputs */

    this._form.submitted = true

    const valid = this._form.validate()

    if (!valid) {
      return
    }

    /* Set loaders on */

    if (this.loaders.length) {
      setLoaders(this.loaders, [this.submit], true)
    }

    /* Get form values */

    const formValues = this._form.getFormValues(true, this.filterInputs)
    let data = `id=${this.id}&${formValues}`

    if (this.data) {
      for (const d in this.data) {
        data += `&${d}=${this.data[d]}`
      }
    }

    /* Send */

    request({
      method: 'POST',
      url: this.url,
      headers: { 'Content-type': 'application/x-www-form-urlencoded' },
      body: data
    })
      .then(response => {
        return this.JSONresponse ? JSON.parse(response) : response
      })
      .then(res => {
        this.onSuccess(res)

        this._form.submitted = false

        this._displayResult()

        if (this.clearOnSuccess) {
          this.clear()
        }
      }).catch(xhr => {
        this.onError(xhr)

        this._form.submitted = false

        this._displayResult(true)
      })
  }

  /**
   * Public methods
   */

  clear () {
    /* Clear form values and messages */

    this.form.reset()

    if (this._form) { this._form.clearErrorMessages() }

    /* Set loaders off */

    if (this.loaders.length) {
      setLoaders(this.loaders, [this.submit], false)
    }
  }

  getFormInstance () {
    return this._form
  }
} // End Send

/* Exports */

export default Send
