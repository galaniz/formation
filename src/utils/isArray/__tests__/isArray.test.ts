/**
 * Utils - Is Array Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isArray } from '../isArray'

/* Tests */

describe('isArray()', () => {
  it('should return true if value is an array with items', () => {
    const value = [1, 2, 3]
    const valueInstance = new Array(1, 2, 3) // eslint-disable-line @typescript-eslint/no-array-constructor

    const result = isArray(value)
    const resultInstance = isArray(valueInstance)

    const expectedResult = true

    expect(result).toBe(expectedResult)
    expect(resultInstance).toBe(expectedResult)
  })

  it('should return true if value is an empty array', () => {
    const value: unknown[] = []
    const valueInstance = new Array() // eslint-disable-line @typescript-eslint/no-array-constructor

    const result = isArray(value)
    const resultInstance = isArray(valueInstance)

    const expectedResult = true

    expect(result).toBe(expectedResult)
    expect(resultInstance).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is string', () => {
    const value = ''
    const result = isArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is boolean', () => {
    const value = true
    const result = isArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
