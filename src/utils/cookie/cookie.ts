/**
 * Utils - Cookie
 */

/* Imports */

import type { CookieOptions } from './cookieTypes.js'
import { isStringStrict } from '../string/string.js'

/**
 * Add browser cookie.
 *
 * @param {string} name
 * @param {string} value
 * @param {CookieOptions} [options]
 * @return {string}
 */
const setCookie = (name: string, value: string, options?: CookieOptions): string => {
  if (!isStringStrict(name) || !isStringStrict(value)) {
    return ''
  }

  const {
    expires,
    maxAge,
    domain,
    path = '/',
    secure = true,
    httpOnly = false,
    sameSite
  } = options || {}

  let cookie = `${name}=${value};`

  if (expires) {
    const date = new Date()

    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)

    cookie += `expires=${date.toUTCString()};`
  }

  if (maxAge) {
    cookie += `max-age=${maxAge};`
  }

  if (domain) {
    cookie += `domain=${domain};`
  }

  if (path) {
    cookie += `path=${path};`
  }

  if (secure) {
    cookie += 'Secure;'
  }

  if (httpOnly) {
    cookie += 'HttpOnly;'
  }

  if (sameSite) {
    cookie += `SameSite=${sameSite};`
  }

  document.cookie = cookie

  return cookie
}

/**
 * Retrieve browser cookie.
 *
 * @param {string} name
 * @return {string}
 */
const getCookie = (name: string): string => {
  if (!isStringStrict(name)) {
    return ''
  }

  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=')

    if (!key || !value) {
      continue
    }

    if (key === name) {
      return value
    }
  }

  return ''
}

/* Exports */

export {
  setCookie,
  getCookie
}
