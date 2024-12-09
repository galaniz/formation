/**
 * Mocks - Types
 */

/**
 * @typedef {object} MockFetchOpts
 * @prop {string} method
 * @prop {Headers} headers
 * @prop {string|FormData} body
 */
export interface MockFetchOpts {
  method: string
  headers: Headers
  body: string | FormData
}

/**
 * @typedef {object} MockFetchRes
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {string} body
 * @prop {function} text
 * @prop {function} json
 */
export interface MockFetchRes {
  ok: boolean
  status: number
  body: string
  text: Function
  json: Function
}

/**
 * @typedef {object} MockErrorMessage
 * @prop {string} url
 * @prop {string} bodyString
 * @prop {string} bodyFormData
 * @prop {string} data
 * @prop {string} contentType
 */
export const mockFetchErrorMessage: {
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
 * @typedef {object} MockFetchRequestArgs
 * @prop {string} [encode=json]
 * @prop {string} [expect]
 * @prop {number} [status=200]
 * @prop {string|object} [data]
 */
export const mockFetchRequestArgs: {
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
