/**
 * Config - Default Font Size Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { configDefaultFontSize } from '../configDefaultFontSize'
import { config } from '../config'

/* Tests */

describe('configDefaultFontSize()', () => {
  it('should return 16', () => {
    configDefaultFontSize()

    const expectedResult = 16

    expect(config.defaultFontSize).toBe(expectedResult)
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

    configDefaultFontSize()

    expect(config.defaultFontSize).toBe(value)
  })
})
