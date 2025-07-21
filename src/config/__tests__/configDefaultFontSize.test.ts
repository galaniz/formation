/**
 * Config - Default Font Size Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { configDefaultFontSize } from '../configDefaultFontSize.js'
import { config } from '../config.js'

/* Tests */

describe('configDefaultFontSize()', () => {
  it('should return 16', () => {
    configDefaultFontSize()

    const expectedResult = 16

    expect(config.defaultFontSize).toBe(expectedResult)
  })

  it('should return 18', () => {
    document.documentElement.style.fontSize = '18px'
    const expectedResult = 18

    configDefaultFontSize()

    expect(config.defaultFontSize).toBe(expectedResult)
  })
})
