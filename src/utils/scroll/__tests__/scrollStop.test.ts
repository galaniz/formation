/**
 * Utils - Scroll Stop Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { stopScroll } from '../scrollStop.js'

/**
 * Data attribute name
 *
 * @type {string}
 */
const testAttribute = 'data-stop-scroll'

/**
 * Check if html element has attribute
 *
 * @return {boolean}
 */
const testCheckAttribute = (): boolean => {
  return document.documentElement.hasAttribute(testAttribute)
}

/* Tests */

describe('stopScroll()', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute(testAttribute)
  })

  it('should add data attribute to html element if on is true', () => {
    const result = stopScroll()
    const attrResult = testCheckAttribute()

    const expectedResult = true
    const expectedAttrResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should add data attribute to html element if on is truthy', () => {
    // @ts-expect-error - test truthy on value
    const result = stopScroll('false')
    const attrResult = testCheckAttribute()

    const expectedResult = true
    const expectedAttrResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should remove data attribute from html element if on is false', () => {
    stopScroll()

    const result = stopScroll(false)
    const attrResult = testCheckAttribute()

    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })

  it('should remove data attribute from html element if on is falsey', () => {
    stopScroll()

    // @ts-expect-error - test falsey on value
    const result = stopScroll(null)
    const attrResult = testCheckAttribute()

    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })
})
