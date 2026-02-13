/**
 * Utils - String Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isString, isStringStrict, isStringSafe } from '../string.js'

/* Test isString */

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

/* Test isStringStrict */

describe('isStringStrict()', () => {
  it('should return true if value is a string with content', () => {
    const value = 'text'
    const result = isStringStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty string', () => {
    const value = ''
    const result = isStringStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is an empty string with spaces', () => {
    const value = ' '
    const result = isStringStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isStringStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isStringStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isStringStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isStringStrict(value)
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

/* Test isStringSafe */

describe('isStringSafe()', () => {
  it('should return false if value proto key', () => {
    const protoVal = isStringSafe('__proto__')
    const prototypeVal = isStringSafe('prototype')
    const constructorVal = isStringSafe('constructor')
    const expectedResult = false

    expect(protoVal).toBe(expectedResult)
    expect(prototypeVal).toBe(expectedResult)
    expect(constructorVal).toBe(expectedResult)
  })

  it('should return false if value is empty string', () => {
    const value = isStringSafe('')
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return false if value is a null', () => {
    const value = isStringSafe(null)
    const expectedResult = false

    expect(value).toBe(expectedResult)
  })

  it('should return true if value is a random string', () => {
    const value = isStringSafe('abc123')
    const expectedResult = true

    expect(value).toBe(expectedResult)
  })
})
