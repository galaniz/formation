/**
 * Objects: send and validate form
 *
 * @param {object} args {
 *  @param {string} id
 *  @param {HTMLElement} form
 *  @param {string} groupClass
 *  @param {string} fieldClass
 *  @param {string} labelClass
 *  @param {string} errorClass
 *  @param {HTMLElement} submit
 *  @param {nodelist} inputs
 *  @param {boolean} filterInputs
 *  @param {object} data
 *  @param {array} loaders
 *  @param {boolean} shake
 *  @param {string} url
 *  @param {function} success
 *  @param {function} error
 *  @param {object} result {
 *   @param {HTMLElement} container
 *   @param {HTMLElement} textContainer
 *   @param {object} text {
 *    @param {string} error
 *    @param {string} success
 *   }
 *  }
 * }
 */

/* Imports */

import {
  addClass,
  removeClass,
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
      errorClass = '',
      submit = null,
      inputs = null,
      filterInputs = false,
      data = {},
      loaders = [],
      shake = false,
      siteKey = '',
      url = '',
      success = () => {},
      error = () => {},
      result = {
        container: null,
        textContainer: null,
        text: {
          error: '',
          success: ''
        }
      }
    } = args

    this.id = id
    this.form = form
    this.groupClass = groupClass
    this.fieldClass = fieldClass
    this.labelClass = labelClass
    this.errorClass = errorClass
    this.submit = submit
    this.inputs = inputs
    this.filterInputs = filterInputs
    this.data = data
    this.loaders = loaders
    this.shake = shake
    this.siteKey = siteKey
    this.url = url
    this.success = success
    this.error = error
    this.result = result

    /**
     * Internal variables
     */

    /* Form for validation */

    this._form = null

    /* Keep track of error/success */

    this._error = false

    /* Default messages */

    this._defaultErrorMessage = 'Oops! Looks like something went wrong. Please try again later.'
    this._defaultSuccessMessage = 'Successfully sent!'

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
    /* Check that required variables not empty/null */

    if (!this.id || !this.form || !this.groupClass || !this.fieldClass || !this.labelClass || !this.submit || !this.inputs || !this.loaders || !this.siteKey || !this.url) {
      return false
    }

    /* Default messages if none */

    if (!Object.getOwnPropertyDescriptor(this.result.text, 'error')) {
      this.result.text.error = this._defaultErrorMessage
    }

    if (!this.result.text.error) {
      this.result.text.error = this._defaultErrorMessage
    }

    if (!Object.getOwnPropertyDescriptor(this.result.text, 'success')) {
      this.result.text.success = this._defaultSuccessMessage
    }

    if (!this.result.text.success) {
      this.result.text.success = this._defaultSuccessMessage
    }

    /* Prepare for validation */

    this._form = new Form({
      groupClass: this.groupClass,
      fieldClass: this.fieldClass,
      labelClass: this.labelClass,
      errorClass: this.errorClass,
      errorShake: this.shake,
      inputs: this.inputs
    })

    /* Add event listeners */

    this.form.addEventListener('submit', this._submit.bind(this))

    return true
  }

  /**
   * Helper methods
   */

  /* Display results of form submission */

  _displayResult (error = false) {
    const message = error ? this.result.text.error : this.result.text.success

    this.result.textContainer.textContent = message
    this.result.container.setAttribute('data-type', error ? 'error' : 'success')
    this._error = error

    setLoaders(this.loaders, [this.submit], false)
  }

  /**
   * Event handlers
   */

  _submit (e) {
    e.preventDefault()

    /* On change for inputs */

    this._form.submitted = true

    if (this.shake) { removeClass(this.submit, 'a-shake') }

    const valid = this._form.validate()

    if (!valid) {
      if (this.shake) { addClass(this.submit, 'a-shake') }

      return
    }

    setLoaders(this.loaders, [this.submit], true)

    /* Hide results container */

    this.result.container.removeAttribute('data-type')

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
    }).then(response => {
      // console.log('RESPONSE', response)

      try {
        this.success(JSON.parse(response))
        this._displayResult()
      } catch (e) {
        this._displayResult(true)
      }
    }).catch(xhr => {
      // console.log('ERROR', xhr)

      this._displayResult(true)
      this.error()
    })
  }

  /**
   * Public methods
   */

  clear (exclude = []) {
    if (this._form) { this._form.clear(exclude) }

    /* End loader */

    this.loader.setAttribute('data-hide', '')

    /* Hide results container */

    this.result.container.removeAttribute('data-type')
  }

  getFormInstance () {
    return this._form
  }
} // End Send

/* Exports */

export default Send
