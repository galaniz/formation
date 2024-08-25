/**
 * Utils - Is Map Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isMap } from '../isMap'

/* Tests */

describe('isMap()', () => {
  it('should return true if value is a Map', () => {
    const value = new Map()
    const result = isMap(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isMap(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = []
    const result = isMap(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isMap(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isMap(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a function', () => {
    const value = (): void => {}
    const result = isMap(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
