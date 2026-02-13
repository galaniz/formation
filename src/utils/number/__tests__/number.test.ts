/**
 * Utils - Number Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isNumber } from '../number.js'

/* Tests */

describe('isNumber()', () => {
  it('should return true if value is an integer', () => {
    const value = 1234
    const result = isNumber(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a decimal', () => {
    const value = 12.34
    const result = isNumber(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a string', () => {
    const value = ''
    const result = isNumber(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isNumber(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value: unknown[] = []
    const result = isNumber(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isNumber(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isNumber(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
