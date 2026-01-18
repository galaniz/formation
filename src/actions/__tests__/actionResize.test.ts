/**
 * Actions - Resize Test
 */

/* Imports */

import { it, expect, describe, afterEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import { actions } from '../actions.js'
import { onResize, removeResize } from '../actionResize.js'
import { config } from '../../config/config.js'

/**
 * Reset viewport to default.
 *
 * @return {void}
 */
const resetViewport = (): void => {
  window.resizeTo(1024, 1024)
  window.innerWidth = 1024
  window.innerHeight = 1024
  fireEvent(window, new Event('resize'))
}

/**
 * Fire window resize event.
 *
 * @return {void}
 */
const resizeEvent = (): void => {
  window.resizeTo(800, 800)
  window.innerWidth = 800
  window.innerHeight = 800
  fireEvent(window, new Event('resize'))
}

/* Test onResize */

describe('onResize()', () => {
  afterEach(() => {
    actions.get('resize')?.clear()
    resetViewport()
  })

  it('should run function on window resize',
    async () => await new Promise(resolve => {
      let initViewportWidth = 0

      const testOne = vi.fn((viewportWidths: [number, number]) => {
        expect(testOne).toHaveBeenCalledTimes(1)
        expect(viewportWidths).toEqual([1024, 800])
        expect(initViewportWidth).toEqual(1024)
        resolve('')
      })

      initViewportWidth = onResize(testOne)
      resizeEvent()
    })
  )

  it(
    'should run two functions on window resize',
    async () => await new Promise(resolve => {
      let initViewportWidth = 0

      const testOne = vi.fn((viewportWidths: [number, number]) => {
        expect(testOne).toHaveBeenCalledTimes(1)
        expect(viewportWidths).toEqual([1024, 800])
        expect(initViewportWidth).toEqual(1024)
      })

      const testTwo = vi.fn((viewportWidths: [number, number]) => {
        expect(testTwo).toHaveBeenCalledTimes(1)
        expect(viewportWidths).toEqual([1024, 800])
        expect(initViewportWidth).toEqual(1024)
        resolve('')
      })

      initViewportWidth = onResize(testOne)
      initViewportWidth = onResize(testTwo)
      resizeEvent()
    })
  )
})

/* Test removeResize */

describe('removeResize()', () => {
  afterEach(() => {
    actions.get('resize')?.clear()
    resetViewport()
  })

  it('should run one function on window resize',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn(() => {
        expect(testOne).not.toHaveBeenCalled()
        expect(testTwo).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onResize(testOne)
      onResize(testTwo)
      removeResize(testOne)
      resizeEvent()
    })
  )

  it('should not run any functions on window resize',
    async () => await new Promise(resolve => {
      let timeoutId = 0

      const testOne = vi.fn()
      const testTwo = vi.fn()

      window.addEventListener('resize', () => {
        clearTimeout(timeoutId)

        timeoutId = window.setTimeout(() => {
          expect(testOne).not.toHaveBeenCalled()
          expect(testTwo).not.toHaveBeenCalled()
          resolve('')
        }, config.resizeDelay + 10)
      })

      onResize(testOne)
      onResize(testTwo)
      removeResize(testOne)
      removeResize(testTwo)
      resizeEvent()
    })
  )
})
