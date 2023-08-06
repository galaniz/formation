/**
 * Utils - request
 */

/* Imports */

import { urlEncode } from './url-encode'
import { objectToFormData } from './object-to-form-data'

/**
 * Function - handle ajax requests with fetch method and encode data
 *
 * @param {object} args
 * @param {string} args.method
 * @param {string} args.url
 * @param {object} args.headers
 * @param {string} args.body
 * @param {string} args.encode
 * @return {Promise}
 */

const request = (args) => {
  const {
    method = 'GET',
    url = '',
    headers,
    body,
    encode = 'url'
  } = args

  /* Method */

  const reqArgs = {
    method
  }

  /* Headers */

  if (headers) {
    reqArgs.headers = headers
  }

  /* Body */

  if (body) {
    reqArgs.body = body
  }

  /* Encode */

  if (encode === 'url' || encode === 'json') {
    if (!Object.getOwnPropertyDescriptor(reqArgs, 'headers')) {
      reqArgs.headers = {}
    }
  }

  if (encode === 'url') {
    reqArgs.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    reqArgs.body = urlEncode(body)
  }

  if (encode === 'json') {
    reqArgs.headers['Content-Type'] = 'application/json'
    reqArgs.body = JSON.stringify(body)
  }

  if (encode === 'form-data') {
    const formData = new FormData() // eslint-disable-line no-undef

    objectToFormData(body, formData)

    reqArgs.body = formData
  }

  /* Make request */

  return new Promise((resolve, reject) => {
    fetch(url, reqArgs)
      .then(res => {
        if (res.status >= 200 && res.status < 300) {
          try {
            resolve(res.text())
          } catch (err) {
            reject(err.message)
          }
        } else {
          reject(res)
        }
      })
      .catch((err) => {
        reject(err.message)
      })
  })
}

/* Exports */

export { request }
