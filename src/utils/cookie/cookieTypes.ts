/**
 * Utils - Cookie
 */

/**
 * @typedef {object} CookieOptions
 * @property {number} [expires] - Expiration in days.
 * @property {number} [maxAge] - Expiration in seconds.
 * @property {string} [domain]
 * @property {string} [path='/']
 * @property {boolean} [secure=true]
 * @property {boolean} [httpOnly=false]
 * @property {'Strict'|'Lax'|'None'} [sameSite]
 */
export interface CookieOptions {
  expires?: number
  maxAge?: number
  domain?: string
  path?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}
