/**
 * Utils - Is String Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isString } from '../isString'

/* Tests */

describe('isString()', () => {
  it('should return true if value is a string with content', () => {
    const value = 'text'
    const result = isString(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is an empty string', () => {
    const value = ''
    const result = isString(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty string with spaces', () => {
    const value = ' '
    const result = isString(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isString(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isString(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isString(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isString(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is boolean', () => {
    const value = true
    const result = isString(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
