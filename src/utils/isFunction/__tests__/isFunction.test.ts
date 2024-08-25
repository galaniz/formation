/**
 * Utils - Is Function Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isFunction } from '../isFunction'

/* Tests */

describe('isFunction()', () => {
  it('should return true if value is a function', () => {
    const value = (): void => {}
    const result = isFunction(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a method', () => {
    const value = { func (): void {} }
    const result = isFunction(value.func)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a class method', () => {
    class TestClass { static func (): void {} } // eslint-disable-line
    const result = isFunction(TestClass.func)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = { func (): void {} }
    const result = isFunction(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isFunction(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isFunction(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
