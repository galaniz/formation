/**
 * Utils - Scroll Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { scroll } from '../scroll.js'

/**
 * Data attribute name.
 *
 * @type {string}
 */
const testAttribute: string = 'data-scroll'

/**
 * Check if HTML element has attribute.
 *
 * @return {boolean}
 */
const testCheckAttribute = (): boolean => {
  return document.documentElement.getAttribute(testAttribute) === 'off'
}

/* Tests */

describe('scroll()', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(testAttribute)
  })

  it('should add data attribute to HTML element if on is false', () => {
    const result = scroll()
    const attrResult = testCheckAttribute()
    const expectedResult = true
    const expectedAttrResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should add data attribute to HTML element if on is falsey', () => {
    // @ts-expect-error - test falsey on value
    const result = scroll(null)
    const attrResult = testCheckAttribute()
    const expectedResult = true
    const expectedAttrResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should remove data attribute from HTML element if on is true', () => {
    scroll()

    const result = scroll(true)
    const attrResult = testCheckAttribute()
    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should remove data attribute from HTML element if on is truthy', () => {
    scroll()

    // @ts-expect-error - test truthy on value
    const result = scroll('true')
    const attrResult = testCheckAttribute()
    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })
})
