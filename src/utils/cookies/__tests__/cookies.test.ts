/**
 * Utils - Cookies Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { setCookie, getCookie } from '../cookies'

/**
 * Test cookie name
 *
 * @type {string}
 */
const testName: string = 'test_cookie_name'

/**
 * Test cookie value
 *
 * @type {string}
 */
const testValue: string = 'test_cookie_value'

/**
 * Clear document cookies
 *
 * @return {void}
 */
const testClearCookies = (): void => {
  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i += 1) {
    const cookie = cookies[i]

    if (cookie === undefined) {
      continue
    }

    const cookieArr = cookie.split('=')
    const n = cookieArr[0]

    if (n === undefined) {
      continue
    }

    document.cookie = `${n}=;expires=Thu, 21 Sep 1979 00:00:01 UTC;path=/`
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

  it('should return false if name is empty', () => {
    const name = ''
    const value = 'test'
    const result = setCookie(name, value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if name is not a string', () => {
    const name = 1
    const value = 'test'
    // @ts-expect-error
    const result = setCookie(name, value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is empty', () => {
    const name = 'test'
    const value = ''
    const result = setCookie(name, value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is not a string', () => {
    const name = 'test'
    const value = false
    // @ts-expect-error
    const result = setCookie(name, value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true and add cookie', () => {
    const result = setCookie(testName, testValue)
    const expectedResult = true
    const cookieResult = getCookie(testName)

    expect(result).toBe(expectedResult)
    expect(cookieResult).toBe(testValue)
  })

  it('should return true, add cookie and expire after one day', () => {
    const name = 'test_cookie_name_two'
    const value = 'test_cookie_value_two'
    const expire = 1
    const result = setCookie(name, value, expire)
    const expectedResult = true
    const cookieResult = getCookie(name)
    const date = new Date()

    vi.setSystemTime(date.setDate(date.getDate() + expire))

    const expiredResult = getCookie(name)

    expect(result).toBe(expectedResult)
    expect(cookieResult).toBe(value)
    expect(expiredResult).toBe('')
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
    // @ts-expect-error
    const result = getCookie(name)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if name does not exist', () => {
    const name = 'not_exists'
    const result = getCookie(name)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return testValue', () => {
    setCookie(testName, testValue)

    const result = getCookie(testName)

    expect(result).toBe(testValue)
  })
})
