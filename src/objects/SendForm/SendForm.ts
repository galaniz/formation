// @ts-nocheck

/**
 * Objects - Send Form
 *
 * @param {object} args
 * @param {string} args.id
 * @param {HTMLElement} args.form
 * @param {string} args.groupClass
 * @param {string} args.fieldClass
 * @param {string} args.labelClass
 * @param {HTMLElement} args.submit
 * @param {NodeList} args.inputs
 * @param {boolean} args.filterInputs
 * @param {object} args.data
 * @param {HTMLElement[]} args.loaders
 * @param {string} args.url
 * @param {string} args.encode
 * @param {function} args.onSuccess
 * @param {function} args.onError
 * @param {string} args.errorTemplate
 * @param {object} args.result
 * @param {boolean} args.clearOnSuccess
 * @param {boolean} args.jsonResponse
 */

/* Imports */

import {
  mergeObjects,
  setLoaders,
  request
} from '../../utils/utils'

import { Form } from '../Form/Form'

/* Class - send and validate form */

class SendForm {
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
      encode = 'url',
      onSuccess = () => {},
      onError = () => {},
      errorTemplate = '',
      result = {},
      clearOnSuccess = true,
      jsonResponse = true
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
    this.encode = encode
    this.onSuccess = onSuccess
    this.onError = onError
    this.errorTemplate = errorTemplate
    this.result = result
    this.clearOnSuccess = clearOnSuccess
    this.jsonResponse = jsonResponse

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

    if (!init) {
      return false
    }
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

    if (error) {
      return false
    }

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

    /* Request args */

    const args = {
      method: 'POST',
      url: this.url,
      encode: this.encode
    }

    /* Get form values */

    const body = {
      id: this.id
    }

    this._form.appendFormValues(body, this.filterInputs)

    if (this.data) {
      Object.keys(this.data || {}).forEach((d) => {
        body[d] = this.data[d]
      })
    }

    args.body = body

    /* Send */

    request(args)
      .then(response => {
        return this.jsonResponse ? JSON.parse(response) : response
      })
      .then(res => {
        this.onSuccess(res)

        this._form.submitted = false

        this._displayResult()

        if (this.clearOnSuccess) {
          this.clear()
        }
      }).catch(err => {
        this.onError(err)

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

    if (this._form) {
      this._form.clearErrorMessages()
    }

    /* Set loaders off */

    if (this.loaders.length) {
      setLoaders(this.loaders, [this.submit], false)
    }
  }

  getFormInstance () {
    return this._form
  }
}

/* Exports */

export { SendForm }
