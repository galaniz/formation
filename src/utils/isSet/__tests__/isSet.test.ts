/**
 * Utils - Is Set Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isSet, isSetStrict } from '../isSet'

/* Test isSet */

describe('isSet()', () => {
  it('should return true if value is a Set', () => {
    const value = new Set()
    const result = isSet(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isSet(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = []
    const result = isSet(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isSet(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isSet(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a function', () => {
    const value = (): void => {}
    const result = isSet(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test isSetStrict */

describe('isSetStrict()', () => {
  it('should return true if value is a Set with item(s)', () => {
    const value = new Set([1])
    const result = isSetStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty Set', () => {
    const value = new Set()
    const result = isSetStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isSetStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = []
    const result = isSetStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isSetStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isSetStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a function', () => {
    const value = (): void => {}
    const result = isSetStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
