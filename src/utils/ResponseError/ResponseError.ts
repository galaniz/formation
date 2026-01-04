/**
 * Utils - Response Error
 */

/**
 * Custom exception to include fetch response.
 */
class ResponseError extends Error {
  /**
   * Response data.
   *
   * @type {Response}
   */
  response: Response

  /**
   * Create new instance with given message and response.
   *
   * @param {string} message
   * @param {Response} resp
   */
  constructor (message: string, resp: Response) {
    super(message)
    this.message = message
    this.response = resp
  }
}

/* Exports */

export { ResponseError }
