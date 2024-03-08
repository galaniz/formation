/**
 * Utils - Is HTML Element Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getQueriesForElement } from '@testing-library/dom'
import { isHTMLElement } from '../isHTMLElement'

/* Tests */

describe('isHTMLElement()', () => {
  it('should return true if value is an html element', () => {
    const text = 'text'
    const div = document.createElement('div')
    div.textContent = text

    const { getByText } = getQueriesForElement(div)
    const value = getByText(text)
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
