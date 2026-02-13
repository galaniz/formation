/**
 * Utils - Html Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { isHtmlElement, isHtmlElementArray, isHtmlElementArrayStrict } from '../html.js'

/* Test isHtmlElement */

describe('isHtmlElement()', () => {
  it('should return true if value is an HTML element', () => {
    const value = document.createElement('div')
    const result = isHtmlElement(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if value is an html button element', () => {
    const value = document.createElement('button')
    const result = isHtmlElement(value, HTMLButtonElement)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isHtmlElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isHtmlElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isHtmlElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is string', () => {
    const value = ''
    const result = isHtmlElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is number', () => {
    const value = 1
    const result = isHtmlElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is boolean', () => {
    const value = true
    const result = isHtmlElement(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test isHtmlElementArray */

describe('isHtmlElementArray()', () => {
  it('should return true if value is an array of HTML elements', () => {
    const value = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]

    const result = isHtmlElementArray(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return true if first item in array is an HTML element', () => {
    const value = [
      document.createElement('div'),
      'test',
      1234,
      false
    ]

    const result = isHtmlElementArray(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if first item in array is not an HTML element', () => {
    const value = [
      'test',
      document.createElement('div'),
      1234,
      false
    ]

    const result = isHtmlElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isHtmlElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty array', () => {
    const value: unknown[] = []
    const result = isHtmlElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isHtmlElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isHtmlElementArray(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})

/* Test isHtmlElementArrayStrict */

describe('isHtmlElementArrayStrict()', () => {
  it('should return true if value is an array of HTML elements', () => {
    const value = [
      document.createElement('div'),
      document.createElement('div'),
      document.createElement('div')
    ]

    const result = isHtmlElementArrayStrict(value)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an array of some HTML elements', () => {
    const value = [
      document.createElement('div'),
      'test',
      1234,
      false
    ]

    const result = isHtmlElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an object', () => {
    const value = {}
    const result = isHtmlElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is an empty array', () => {
    const value: unknown[] = []
    const result = isHtmlElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is null', () => {
    const value = null
    const result = isHtmlElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return false if value is undefined', () => {
    const value = undefined
    const result = isHtmlElementArrayStrict(value)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })
})
