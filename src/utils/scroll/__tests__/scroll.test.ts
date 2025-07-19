/**
 * Utils - Scroll Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent } from '@testing-library/dom'
import { actions } from '../../action/action.js'
import { onScroll, removeScroll } from '../scroll.js'
import { config } from '../../../config/config.js'

/**
 * Fire window scroll event.
 *
 * @return {void}
 */
const scrollEvent = (): void => {
  window.scrollTo(0, 800)
  fireEvent(window, new Event('scroll'))
}

/* Test onScroll */

describe('onScroll()', () => {
  beforeEach(() => {
    actions.get('scroll')?.clear()
  })

  it('should run function on window scroll',
    async () => await new Promise(resolve => {
      const testOne = vi.fn(() => {
        expect(testOne).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onScroll(testOne)
      scrollEvent()
    })
  )

  it(
    'should run two functions on window scroll',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn(() => {
        expect(testOne).toHaveBeenCalledTimes(1)
        expect(testTwo).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onScroll(testOne)
      onScroll(testTwo)
      scrollEvent()
    })
  )
})

/* Test removeScroll */

describe('removeScroll()', () => {
  beforeEach(() => {
    actions.get('scroll')?.clear()
  })

  it('should run one function on window scroll',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn(() => {
        expect(testOne).not.toHaveBeenCalled()
        expect(testTwo).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onScroll(testOne)
      onScroll(testTwo)
      removeScroll(testOne)
      scrollEvent()
    })
  )

  it('should not run any functions on window scroll',
    async () => await new Promise(resolve => {
      let timeoutId = 0

      const testOne = vi.fn()
      const testTwo = vi.fn()

      window.addEventListener('scroll', () => {
        clearTimeout(timeoutId)

        timeoutId = window.setTimeout(() => {
          expect(testTwo).not.toHaveBeenCalled()
          expect(testTwo).not.toHaveBeenCalled()
          resolve('')
        }, config.scrollDelay + 100)
      })

      onScroll(testOne)
      onScroll(testTwo)
      removeScroll(testOne)
      removeScroll(testTwo)
      scrollEvent()
    })
  )
})
