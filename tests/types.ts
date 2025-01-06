/**
 * Tests - Types
 */

/**
 * @typedef {object} MockFetchOptions
 * @prop {string} method
 * @prop {Headers} headers
 * @prop {string|FormData} body
 */
export interface MockFetchOptions {
  method: string
  headers: Headers
  body: string | FormData
}

/**
 * @typedef {object} MockFetchResult
 * @prop {boolean} ok
 * @prop {number} status
 * @prop {headers} [headers]
 * @prop {string} body
 * @prop {function} text
 * @prop {function} json
 */
export interface MockFetchResult {
  ok: boolean
  status: number
  headers?: Headers
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
