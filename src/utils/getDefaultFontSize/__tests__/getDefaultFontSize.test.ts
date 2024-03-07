/**
 * Utils - Get Default Font Size Test
 */

/* Imports */

import { it, expect, describe, vi } from 'vitest'
import { getDefaultFontSize } from '../getDefaultFontSize'

/* Tests */

describe('getDefaultFontSize()', () => {
  it('should return 16', () => {
    const result = getDefaultFontSize()
    const expectedResult = 16

    expect(result).toBe(expectedResult)
  })

  it('should return 18', () => {
    const value = 18

    Object.defineProperty(
      HTMLElement.prototype,
      'clientWidth', {
        configurable: true,
        value
      }
    )

    const result = getDefaultFontSize()

    expect(result).toBe(value)
  })
})
