/**
 * Utils - Cookies
 */

/* Imports */

import { isString } from '../isString/isString'

/**
 * Function - set browser cookie
 *
 * @param {string} name
 * @param {string} value
 * @param {number} [expirationDays=0]
 * @return {boolean}
 */

const setCookie = (name: string, value: string, expirationDays: number = 0): boolean => {
  if (!isString(name) || !(isString(value))) {
    return false
  }

  let expires = ''

  if (expirationDays > 0) {
    const d = new Date()

    d.setTime(d.getTime() + expirationDays * 24 * 60 * 60 * 1000)

    expires = `expires=${d.toUTCString()};`
  }

  document.cookie = `${name}=${value};${expires}path=/`

  return true
}

/**
 * Function - get browser cookie
 *
 * @param {string} name
 * @return {string}
 */

const getCookie = (name: string): string => {
  if (!isString(name)) {
    return ''
  }

  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i]
    const c = cookie.split('=')

    if (c.length < 2) {
      return ''
    }

    if (c[0].trim() === name) {
      return c[1]
    }
  }

  return ''
}

/* Exports */

export { setCookie, getCookie }
