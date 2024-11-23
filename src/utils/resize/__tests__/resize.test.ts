/**
 * Utils - Resize Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import { actions } from '../../action/action.js'
import { onResize, removeResize } from '../resize.js'
import { config } from '../../../config/config.js'

/**
 * Fire window resize event
 *
 * @return {void}
 */
const resizeEvent = (): void => {
  window.resizeTo(800, 800)
  fireEvent(window, new Event('resize'))
}

/* Test onResize */

describe('onResize()', () => {
  beforeEach(() => {
    actions.get('resize')?.clear()
  })

  it('should run function on window resize',
    async () => await new Promise(resolve => {
      const testOne = vi.fn(() => {
        expect(testOne).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onResize(testOne)
      resizeEvent()
    })
  )

  it(
    'should run two functions on window resize',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn(() => {
        expect(testOne).toHaveBeenCalledTimes(1)
        expect(testTwo).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onResize(testOne)
      onResize(testTwo)
      resizeEvent()
    })
  )
})

/* Test removeResize */

describe('removeResize()', () => {
  beforeEach(() => {
    actions.get('resize')?.clear()
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
        }, config.resizeDelay + 100)
      })

      onResize(testOne)
      onResize(testTwo)
      removeResize(testOne)
      removeResize(testTwo)
      resizeEvent()
    })
  )
})
