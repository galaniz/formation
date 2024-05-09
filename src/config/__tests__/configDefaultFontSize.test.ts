/**
 * Config - Default Font Size Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { configDefaultFontSize } from '../configDefaultFontSize'

/* Tests */

describe('configDefaultFontSize()', () => {
  it('should return 16', () => {
    const result = configDefaultFontSize()
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

    const result = configDefaultFontSize()

    expect(result).toBe(value)
  })
})
