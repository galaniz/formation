/**
 * Mocks - Fetch
 */

/* Imports */

import type { MockFetchRes, MockFetchOpts } from './mockTypes.js'
import { mockFetchRequestArgs, mockFetchErrorMessage } from './mockTypes.js'
import { vi } from 'vitest'

/**
 * Mock fetch function
 *
 * @param {string} url
 * @param {MockFetchOpts} options
 * @return {Promise<MockFetchRes>}
 */
const mockFetch = vi.fn(async (
  url: string,
  options: MockFetchOpts
): Promise<MockFetchRes> => {
  return await new Promise((resolve, reject) => {
    /* Url check */

    if (typeof url !== 'string' || url === '') {
      reject(new TypeError(mockFetchErrorMessage.url))
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
    } = mockFetchRequestArgs

    /* Error message */

    let err: undefined | TypeError | Error

    /* Ok state */

    let ok = true

    /* Encode check */

    if ((encode === 'json' || encode === 'url') && typeof body !== 'string') {
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

    if (data === undefined && err === undefined) {
      ok = false
      err = new TypeError(mockFetchErrorMessage.data)
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
  mockFetch,
  mockFetchRequestArgs,
  mockFetchErrorMessage
}
