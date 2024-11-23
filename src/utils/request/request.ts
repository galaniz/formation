/**
 * Utils - Request
 */

/* Imports */

import type { RequestArgs } from './requestTypes.js'
import { urlEncode } from '../url/url.js'
import { objectToFormData } from '../object/objectToFormData.js'
import { isObjectStrict } from '../object/object.js'
import { isFunction } from '../function/function.js'
import { ResponseError } from '../ResponseError/ResponseError.js'

/**
 * Handle requests with fetch method
 *
 * @param {RequestArgs} args
 * @return {Promise<void>}
 */
const request = async (args: RequestArgs): Promise<void> => {
  /* Defaults */

  let {
    method = 'GET',
    url = '',
    headers = {},
    body = '',
    encode = 'json',
    expect = 'json',
    onError = undefined,
    onSuccess = undefined
  } = isObjectStrict(args) ? args : {}

  /* Error and success must be functions */

  if (!isFunction(onError)) {
    onError = () => {}
  }

  if (!isFunction(onSuccess)) {
    onSuccess = () => {}
  }

  /* Headers */

  const reqHeaders = new Headers(isObjectStrict(headers) ? headers : {})

  /* Body */

  const isFormData = body instanceof FormData

  let reqBody: string | FormData = isFormData ? body : ''

  /* Encode and make request */

  try {
    /* Encode and body */

    if (encode === 'url') {
      reqHeaders.set('Content-Type', 'application/x-www-form-urlencoded')
      reqBody = urlEncode(body)
    }

    if (encode === 'json') {
      reqHeaders.set('Content-Type', 'application/json')
      reqBody = JSON.stringify(body)
    }

    if (encode === 'formData' && !isFormData) {
      reqBody = objectToFormData(body)
    }

    /* Request */

    const res = await fetch(url, {
      method,
      headers: reqHeaders,
      body: reqBody
    })

    if (!res.ok) {
      throw new ResponseError('Bad fetch response', res)
    }

    onSuccess(expect === 'json' ? await res.json() : await res.text())
  } catch (error) {
    onError(error)
  }
}

/* Exports */

export { request }
