/**
 * Utils - Is HTML Element Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isHTMLElement, isHTMLElementArray, isHTMLElementArrayStrict } from '../isHTMLElement'

/* Test isHTMLElement */

describe('isHTMLElement()', () => {
  it('should return true if value is an html element', () => {
    const value = document.createElement('div')
    const result = isHTMLElement(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isHTMLElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isHTMLElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isHTMLElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is string', () => {
    const value = ''
    const result = isHTMLElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isHTMLElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is boolean', () => {
    const value = true
    const result = isHTMLElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test isHTMLElementArray */

describe('isHTMLElementArray()', () => {
  it('should return true if value is an array of html elements', () => {
    const value = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]

    const result = isHTMLElementArray(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if first item in array is an html element', () => {
    const value = [
      document.createElement('div'),
      'test',
      1234,
      false
    ]

    const result = isHTMLElementArray(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if first item in array is not an html element', () => {
    const value = [
      'test',
      document.createElement('div'),
      1234,
      false
    ]

    const result = isHTMLElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isHTMLElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty array', () => {
    const value = []
    const result = isHTMLElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isHTMLElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isHTMLElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test isHTMLElementArrayStrict */

describe('isHTMLElementArrayStrict()', () => {
  it('should return true if value is an array of html elements', () => {
    const value = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]

    const result = isHTMLElementArrayStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array of some html elements', () => {
    const value = [
      document.createElement('div'),
      'test',
      1234,
      false
    ]

    const result = isHTMLElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isHTMLElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty array', () => {
    const value = []
    const result = isHTMLElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isHTMLElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isHTMLElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
