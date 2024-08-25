/**
 * Utils - Request
 */

/* Imports */

import type { RequestArgs } from './requestTypes'
import { urlEncode } from '../urlEncode/urlEncode'
import { objectToFormData } from '../objectToFormData/objectToFormData'
import { isObjectStrict } from '../isObject/isObject'
import { isFunction } from '../isFunction/isFunction'

/**
 * Custom exception to include fetch response
 */
class ResponseError extends Error {
  /**
   * Store response data
   *
   * @type {Response}
   */
  response: Response

  /**
   * Set properties
   *
   * @param {string} message
   * @param {Response} res
   */
  constructor (message: string, res: Response) {
    super(message)
    this.message = message
    this.response = res
  }
}

/**
 * Handle requests with fetch method
 *
 * @param {import('./requestTypes').RequestArgs} args
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

  let reqBody: string | FormData = body instanceof FormData ? body : ''

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

    if (encode === 'formData') {
      reqHeaders.set('Content-Type', 'multipart/form-data')
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

export { request, ResponseError }
