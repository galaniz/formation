/**
 * Utils - Is Object Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isObject } from '../isObject'

/* Tests */

describe('isObject()', () => {
  it('should return true if value is an object', () => {
    const value = {
      propOne: 'text',
      propTwo: [1, 2, 3],
      propThree: false
    }

    const result = isObject(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = [1, 2, 3]
    const result = isObject(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isObject(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isObject(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is string', () => {
    const value = ''
    const result = isObject(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isObject(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is boolean', () => {
    const value = true
    const result = isObject(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
