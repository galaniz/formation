/**
 * Utils - Cookie Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { setCookie, getCookie } from '../cookie.js'

/**
 * Clear document cookies.
 *
 * @return {void}
 */
const testClearCookies = (): void => {
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const cookieArr = cookie.split('=')
    const [n] = cookieArr

    if (!n) {
      continue
    }

    document.cookie = `${n}=;expires=Thu, 21 Sep 1979 00:00:01 UTC;`
    document.cookie = `${n}=;expires=Thu, 21 Sep 1979 00:00:01 UTC;Secure;`
    document.cookie = `${n}=;expires=Thu, 21 Sep 1979 00:00:01 UTC;path=/admin;`
    document.cookie = `${n}=;expires=Thu, 21 Sep 1979 00:00:01 UTC;path=/admin;Secure;`
  }
}

/* Test setCookie */

describe('setCookie()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    testClearCookies()
  })

  it('should return empty string if name is empty', () => {
    const name = ''
    const value = 'test'
    const result = setCookie(name, value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if name is not a string', () => {
    const name = 1
    const value = 'test'
    // @ts-expect-error - test invalid name
    const result = setCookie(name, value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is empty', () => {
    const name = 'test'
    const value = ''
    const result = setCookie(name, value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if value is not a string', () => {
    const name = 'test'
    const value = false
    // @ts-expect-error - test invalid value
    const result = setCookie(name, value)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should set cookie', () => {
    const result = setCookie('test_cookie_name', 'test_cookie_value')
    const expectedResult = 'test_cookie_name=test_cookie_value;Secure;'
    const cookie = document.cookie

    expect(result).toBe(expectedResult)
    expect(cookie).toBe('test_cookie_name=test_cookie_value')
  })

  it('should set cookie and expire after 2 days', () => {
    const name = 'test_cookie_name_two'
    const value = 'test_cookie_value_two'
    const result = setCookie(name, value, { maxAge: 172800 })
    const expectedResult = 'test_cookie_name_two=test_cookie_value_two;max-age=172800;Secure;'
    const cookie = document.cookie
    const date = new Date()

    vi.setSystemTime(date.setDate(date.getDate() + 3))

    const expiredCookie = document.cookie

    expect(result).toBe(expectedResult)
    expect(cookie).toBe(`${name}=${value}`)
    expect(expiredCookie).toBe('')
  })

  it('should set cookie and expire after 1 day', () => {
    const name = 'test_cookie_name_three'
    const value = 'test_cookie_value_three'
    setCookie(name, value, { expires: 1 })
    const cookie = document.cookie
    const date = new Date()

    vi.setSystemTime(date.setDate(date.getDate() + 2))

    const expiredResult = getCookie(name)

    expect(cookie).toBe(`${name}=${value}`)
    expect(expiredResult).toBe('')
  })

  it('should set cookie with options', () => {
    const name = 'test_cookie_name_four'
    const value = 'test_cookie_value_four'
    const result = setCookie(name, value, {
      maxAge: 86400,
      path: '/admin',
      domain: 'www.test.com',
      secure: false,
      httpOnly: true,
      sameSite: 'Strict'
    })

    const expectedResult = 'test_cookie_name_four=test_cookie_value_four;max-age=86400;domain=www.test.com;path=/admin;HttpOnly;SameSite=Strict;'

    expect(result).toBe(expectedResult)
  })
})

/* Test getCookie */

describe('getCookie()', () => {
  afterEach(() => {
    testClearCookies()
  })

  it('should return empty string if name is empty', () => {
    const name = ''
    const result = getCookie(name)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if name is not a string', () => {
    const name = 1
    // @ts-expect-error - test invalid name
    const result = getCookie(name)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if name does not exist', () => {
    document.cookie = 'test_cookie_name=test_cookie_value;'

    const name = 'not_exists'
    const result = getCookie(name)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return cookie value', () => {
    document.cookie = 'test_cookie_name=test_cookie_value;path=/;Secure;test_cookie_name_two=test_cookie_value_two;path=/;Secure;'

    const result = getCookie('test_cookie_name')
    const expectedResult = 'test_cookie_value'

    expect(result).toBe(expectedResult)
  })
})
