/**
 * Utils - Loader Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { setLoader } from '../loader.js'

/**
 * Data attribute name
 *
 * @type {string}
 */
const testAttribute: string = 'data-loader-show'

/**
 * Create div loader
 *
 * @return {HTMLDivElement}
 */
const testCreateLoader = (): HTMLDivElement => {
  const div = document.createElement('div')
  const body = document.body

  div.tabIndex = -1
  div.ariaLabel = 'Loading'

  body.innerHTML = ''
  body.append(div)

  return div
}

/**
 * Check if loader has attribute
 *
 * @param {HTMLElement} loader
 * @return {boolean}
 */
const testCheckAttribute = (loader: HTMLElement): boolean => {
  return loader.hasAttribute(testAttribute)
}

/**
 * Check if loader focused
 *
 * @param {HTMLElement} loader
 * @return {boolean}
 */
const testCheckFocus = (loader: HTMLElement): boolean => {
  return loader === document.activeElement
}

/* Tests */

describe('setLoader()', () => {
  it('should return undefined if loader is null', () => {
    // @ts-expect-error
    const result = setLoader(null)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should add data attribute to loader and receive focus if show and focus are true', () => {
    const loader = testCreateLoader()
    const result = setLoader(loader)
    const attrResult = testCheckAttribute(loader)
    const focusResult = testCheckFocus(loader)

    const expectedResult = true
    const expectedAttrResult = true
    const expectedFocusResult = true

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
    expect(focusResult).toBe(expectedFocusResult)
  })

  it('should add data attribute to loader and not receive focus if only show is true', () => {
    const loader = testCreateLoader()
    const result = setLoader(loader, true, false)
    const attrResult = testCheckAttribute(loader)
    const focusResult = testCheckFocus(loader)

    const expectedResult = true
    const expectedAttrResult = true
    const expectedFocusResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
    expect(focusResult).toBe(expectedFocusResult)
  })

  it('should remove data attribute from loader if show is false', () => {
    const loader = testCreateLoader()

    setLoader(loader)

    const result = setLoader(loader, false)
    const attrResult = testCheckAttribute(loader)

    const expectedResult = false
    const expectedAttrResult = false

    expect(result).toBe(expectedResult)
    expect(attrResult).toBe(expectedAttrResult)
  })
})
