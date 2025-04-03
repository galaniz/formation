/**
 * Utils - Cookie
 */

/* Imports */

import { isString, isStringStrict } from '../string/string.js'

/**
 * Add browser cookie
 *
 * @param {string} name
 * @param {string} value
 * @param {number} [expirationDays=0]
 * @return {boolean}
 */
const setCookie = (name: string, value: string, expirationDays: number = 0): boolean => {
  if (!isStringStrict(name) || !isStringStrict(value)) {
    return false
  }

  let expires = ''

  if (expirationDays > 0) {
    const date = new Date()

    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000)

    expires = `expires=${date.toUTCString()};`
  }

  document.cookie = `${name}=${value};${expires}path=/`

  return true
}

/**
 * Retrieve browser cookie
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
    const [n, v] = cookie.split('=')

    if (!isStringStrict(n) || !isString(v)) {
      continue
    }

    if (n === name) {
      return v
    }
  }

  return ''
}

/* Exports */

export {
  setCookie,
  getCookie
}
