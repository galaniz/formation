/**
 * Config - Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import * as defaultFontSizeModule from '../configDefaultFontSize.js'
import { config, setConfig } from '../config.js'

/* Tests */

describe('setConfig()', () => {
  beforeEach(() => {
    config.inert = false
    config.reduceMotion = false
    config.wellFormed = false
    config.defaultFontSize = 16
    config.fontSizeMultiplier = 1
    config.resizeDelay = 100
    config.scrollDelay = 10
    config.labels = {}

    document.body.className = 'no-js'
  })

  it('should remove no js class and add js class to body', () => {
    setConfig()

    expect(document.body.classList.contains('no-js')).toBe(false)
    expect(document.body.classList.contains('js')).toBe(true)
  })

  it('should set inert to true', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        inert: true,
        style: {},
        append: vi.fn(),
        scrollHeight: 1,
        remove: vi.fn()
      } as unknown as HTMLElement
    })

    setConfig()

    expect(config.inert).toBe(true)
  })

  it('should set reduce motion to true', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation(() => {
      return { matches: true } as unknown as MediaQueryList
    })

    setConfig()

    expect(config.reduceMotion).toBe(true)
  })

  it('should set well formed to true', () => {
    vi.spyOn(String.prototype, 'normalize').mockReturnValue('wellFormed')

    setConfig()

    expect(config.wellFormed).toBe(true)
  })

  it('should call config default font size', () => {
    const spy = vi.spyOn(defaultFontSizeModule, 'configDefaultFontSize')

    setConfig()

    expect(spy).toHaveBeenCalled()
  })
})
