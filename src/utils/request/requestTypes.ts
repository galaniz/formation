/**
 * Utils - Request Types
 */

/**
 * @typedef {function} RequestErrorCallback
 * @param {Error} error
 * @return {void}
 */
export type RequestErrorCallback = (error: Error) => void

/**
 * @typedef {function} RequestSuccessCallback
 * @param {string|object} res
 * @return {void}
 */
export type RequestSuccessCallback = (res: unknown) => void

/**
 * @typedef {object} RequestArgs
 * @prop {string} [method=GET]
 * @prop {string} [url]
 * @prop {Object<string, string>} [headers]
 * @prop {object|FormData} body
 * @prop {string} [encode=json] - url | json | formData
 * @prop {string} [expect=json] - json | text
 * @prop {RequestErrorCallback} onError
 * @prop {RequestSuccessCallback} onSuccess
 */
export interface RequestArgs {
  method?: string
  url: string
  headers?: Record<string, string>
  body: object | FormData
  encode?: 'url' | 'json' | 'formData'
  expect?: 'json' | 'text'
  onError: RequestErrorCallback
  onSuccess: RequestSuccessCallback
}
