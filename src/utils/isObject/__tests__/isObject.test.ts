/**
 * Utils - Is Object Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isObject, isObjectStrict } from '../isObject'

/* Test isObject */

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

  it('should return true if value is a Map', () => {
    const value = new Map()
    const result = isObject(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is an array', () => {
    const value = [1, 2, 3]
    const result = isObject(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is an html element', () => {
    const value = document.createElement('div')
    const result = isObject(value)
    const expectedResult = true

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

/* Test isObjectStrict */

describe('isObjectStrict()', () => {
  it('should return true if value is an object', () => {
    const value = {
      propOne: 'text',
      propTwo: [1, 2, 3],
      propThree: false
    }

    const result = isObjectStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is a Map', () => {
    const value = new Map()
    const result = isObjectStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array', () => {
    const value = [1, 2, 3]
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an html element', () => {
    const value = document.createElement('div')
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a blob', () => {
    const value = new Blob([JSON.stringify({ key: 1 })], {
      type: 'application/json'
    })
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is a file', () => {
    const value = new File(['foo'], 'foo.txt', {
      type: 'text/plain'
    })
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is string', () => {
    const value = ''
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is boolean', () => {
    const value = true
    const result = isObjectStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
