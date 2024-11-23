/**
 * Test - Fetch
 */

/* Imports */

import { vi } from 'vitest'

/**
 * @typedef {object} TestFetchOpts
 * @prop {string} method
 * @prop {Headers} headers
 * @prop {string|FormData} body
 */
interface TestFetchOpts {
  method: string
  headers: Headers
  body: string | FormData
}

/**
 * @typedef {object} TestFetchRes
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {string} body
 * @prop {function} text
 * @prop {function} json
 */
interface TestFetchRes {
  ok: boolean
  status: number
  body: string
  text: Function
  json: Function
}

/**
 * @typedef {object} TestErrorMessage
 * @prop {string} url
 * @prop {string} bodyString
 * @prop {string} bodyFormData
 * @prop {string} data
 * @prop {string} contentType
 */
const testFetchErrorMessage: {
  url: string
  bodyString: string
  bodyFormData: string
  data: string
  contentType: string
} = {
  url: 'URL not valid',
  bodyString: 'Body not a string',
  bodyFormData: 'Body not Form Data',
  data: 'Data is undefined',
  contentType: 'Incorrect content type'
}

/**
 * @typedef {object} TestFetchRequestArgs
 * @prop {string} [encode=json]
 * @prop {string} [expect]
 * @prop {number} [status=200]
 * @prop {string|object} [data]
 */
const testFetchRequestArgs: {
  encode: 'url' | 'json' | 'formData'
  expect: string
  status: number
  data?: string | object
  reset: Function
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
 * Mock fetch function
 *
 * @param {string} url
 * @param {TestFetchOpts} options
 * @return {Promise<TestFetchRes>}
 */
const testFetch = vi.fn(async (
  url: string,
  options: TestFetchOpts
): Promise<TestFetchRes> => {
  return await new Promise((resolve, reject) => {
    /* Url check */

    if (typeof url !== 'string' || url === '') {
      reject(new TypeError(testFetchErrorMessage.url))
    }

    /* Options */

    const {
      headers,
      body
    } = options

    /* Request options to compare against */

    let {
      encode = 'json',
      expect = 'json',
      status = 200,
      data = undefined
    } = testFetchRequestArgs

    /* Error message */

    let err: undefined | TypeError | Error

    /* Ok state */

    let ok = true

    /* Encode check */

    if ((encode === 'json' || encode === 'url') && typeof body !== 'string') {
      ok = false
      err = new Error(testFetchErrorMessage.bodyString)
      status = 400
    }

    if (encode === 'formData' && !(body instanceof FormData)) {
      ok = false
      err = new Error(testFetchErrorMessage.bodyFormData)
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
      err = new Error(testFetchErrorMessage.contentType)
      status = 400
    }

    /* Data */

    if (!ok) {
      data = undefined
    }

    if (data === undefined && err === undefined) {
      ok = false
      err = new TypeError(testFetchErrorMessage.data)
      status = status === 200 ? 500 : status
    }

    if (err !== undefined) {
      data = {
        error: err.message
      }
    }

    /* Result */

    const res = expect === 'json' ? JSON.stringify(data) : String(data)

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
  testFetch,
  testFetchRequestArgs,
  testFetchErrorMessage
}
