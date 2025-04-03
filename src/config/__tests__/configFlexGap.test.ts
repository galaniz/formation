/**
 * Config - Flex Gap Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import { configFlexGap } from '../configFlexGap.js'
import { config } from '../config.js'

/* Tests */

describe('configFlexGap()', () => {
  beforeEach(() => {
    config.flexGap = false
  })

  it('should set flex gap to true', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        style: {},
        append: vi.fn(),
        scrollHeight: 1,
        remove: vi.fn()
      } as unknown as HTMLElement
    })

    configFlexGap()

    expect(config.flexGap).toBe(true)
  })

  it('should add class to body to indicate no flex gap', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        style: {},
        append: vi.fn(),
        scrollHeight: 42,
        remove: vi.fn()
      } as unknown as HTMLElement
    })

    configFlexGap()

    expect(config.flexGap).toBe(false)
    expect(document.body.classList.contains('no-flex-gap')).toBe(true)
  })
})
