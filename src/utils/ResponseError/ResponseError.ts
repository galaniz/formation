/**
 * Utils - Response Error
 */

/**
 * Custom exception to include fetch response
 */
class ResponseError extends Error {
  /**
   * Response data
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

/* Exports */

export { ResponseError }
