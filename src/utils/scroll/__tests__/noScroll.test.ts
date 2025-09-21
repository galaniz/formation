/**
 * Utils - No Scroll Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { noScroll } from '../noScroll.js'

/**
 * Data attribute name.
 *
 * @type {string}
 */
const testAttribute: string = 'data-no-scroll'

/**
 * Check if HTML element has attribute.
 *
 * @return {boolean}
 */
const testCheckAttribute = (): boolean => {
  return document.documentElement.hasAttribute(testAttribute)
}

/* Tests */

describe('noScroll()', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(testAttribute)
  })

  it('should add data attribute to HTML element if on is true', () => {
    const result = noScroll()
    const attrResult = testCheckAttribute()
    const expectedResult = true
    const expectedAttrResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should add data attribute to HTML element if on is truthy', () => {
    // @ts-expect-error - test truthy on value
    const result = noScroll('false')
    const attrResult = testCheckAttribute()
    const expectedResult = true
    const expectedAttrResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should remove data attribute from HTML element if on is false', () => {
    noScroll()

    const result = noScroll(false)
    const attrResult = testCheckAttribute()
    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should remove data attribute from HTML element if on is falsey', () => {
    noScroll()

    // @ts-expect-error - test falsey on value
    const result = noScroll(null)
    const attrResult = testCheckAttribute()
    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })
})
