/**
 * Utils - Request Mock Fetch
 */

/* Imports */

import type { MockFetchResult, MockFetchOptions } from '../../../../tests/types.js'
import { mockFetchErrorMessage } from '../../../../tests/types.js'
import { isString, isStringStrict } from '../../string/string.js'
import { vi } from 'vitest'

/**
 * @typedef {object} MockRequestFetchArgs
 * @prop {string} [encode='json']
 * @prop {string} [expect='json']
 * @prop {number} [status=200]
 * @prop {string|object} [data]
 * @prop {Function} reset
 */
const mockRequestFetchArgs: {
  encode: 'url' | 'json' | 'formData'
  expect: 'json' | 'text'
  status: number
  data?: string | object
  reset: () => void
} = {
  encode: 'json',
  expect: 'json',
  status: 200,
  data: undefined,
  reset () {
    this.encode = 'json'
    this.expect = 'json'
    this.status = 200
    this.data = undefined
  }
}

/**
 * Mock fetch function.
 *
 * @param {string} url
 * @param {MockFetchOptions} options
 * @return {Promise<MockFetchResult>}
 */
const mockRequestFetch = vi.fn(async (
  url: string,
  options: MockFetchOptions
): Promise<MockFetchResult> => {
  return await new Promise((resolve, reject) => {
    /* URL check */

    if (!isStringStrict(url)) {
      reject(new TypeError(mockFetchErrorMessage.url))
    }

    /* Options */

    const {
      headers,
      body
    } = options

    /* Request options to compare against */
  
    const {
      encode,
      expect
    } = mockRequestFetchArgs

    let {
      status,
      data
    } = mockRequestFetchArgs

    /* Error message */

    let err: undefined | TypeError | Error

    /* Ok state */

    let ok = true

    /* Encode check */

    if ((encode === 'json' || encode === 'url') && !isString(body)) {
      ok = false
      err = new Error(mockFetchErrorMessage.bodyString)
      status = 400
    }

    if (encode === 'formData' && !(body instanceof FormData)) {
      ok = false
      err = new Error(mockFetchErrorMessage.bodyFormData)
      status = 400
    }

    if (status > 200) {
      ok = false
    }

    /* Content type check */

    const contentType = headers.get('Content-Type')

    if (
      (encode === 'json' && contentType !== 'application/json') ||
      (encode === 'url' && contentType !== 'application/x-www-form-urlencoded')
    ) {
      ok = false
      err = new Error(mockFetchErrorMessage.contentType)
      status = 400
    }

    /* Data */

    if (!ok) {
      data = undefined
    }

    if (!data && !err) {
      ok = false
      err = new TypeError(mockFetchErrorMessage.data)
      status = status === 200 ? 500 : status
    }

    if (err) {
      data = {
        error: err.message
      }
    }

    /* Result */

    const res = expect === 'json' ? JSON.stringify(data) : isString(data) ? data : ''

    resolve({
      ok,
      status,
      body: res,
      text: async () => {
        return await new Promise((resolve) => {
          resolve(res)
        })
      },
      json: async () => {
        return await new Promise((resolve) => {
          resolve(data)
        })
      }
    })
  })
})

/* Exports */

export {
  mockRequestFetch,
  mockRequestFetchArgs
}
