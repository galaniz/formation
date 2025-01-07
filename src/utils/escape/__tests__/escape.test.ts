/**
 * Utils - Escape Test
 */

/* Imports */

import { it, expect, describe, beforeEach, vi } from 'vitest'
import { fireEvent, createEvent } from '@testing-library/dom'
import { actions } from '../../action/action.js'
import { onEscape, removeEscape } from '../escape.js'

/**
 * Add keydown event to document
 *
 * @param {string} key
 * @return {KeyboardEvent}
 */
const testMakeEvent = (key = ''): KeyboardEvent => {
  return createEvent.keyDown(document, { key }) as KeyboardEvent
}

/* Test onEscape */

describe('onEscape()', () => {
  beforeEach(() => {
    actions.get('escape')?.clear()
  })

  it('should run function on escape key', () => {
    const testOne = vi.fn()

    onEscape(testOne)
    fireEvent(document, testMakeEvent('Escape'))

    expect(testOne).toHaveBeenCalledTimes(1)
  })

  it(
    'should run two functions on escape key',
    async () => await new Promise(resolve => {
      const testOne = vi.fn()
      const testTwo = vi.fn(() => {
        expect(testOne).toHaveBeenCalledTimes(1)
        expect(testTwo).toHaveBeenCalledTimes(1)
        resolve('')
      })

      onEscape(testOne)
      onEscape(testTwo)
      fireEvent(document, testMakeEvent('Escape'))
    })
  )

  it('should not run function on space key', () => {
    const testOne = vi.fn()

    onEscape(testOne)
    fireEvent(document, testMakeEvent('Space'))

    expect(testOne).not.toHaveBeenCalled()
  })
})

/* Test removeEscape */

describe('removeEscape()', () => {
  beforeEach(() => {
    actions.get('escape')?.clear()
  })

  it('should run one function on escape key', () => {
    const testOne = vi.fn()
    const testTwo = vi.fn()

    onEscape(testOne)
    onEscape(testTwo)
    removeEscape(testOne)
    fireEvent(document, testMakeEvent('Escape'))

    expect(testOne).not.toHaveBeenCalled()
    expect(testTwo).toHaveBeenCalledTimes(1)
  })

  it('should not run any functions on escape key', () => {
    const testOne = vi.fn()
    const testTwo = vi.fn()

    onEscape(testOne)
    onEscape(testTwo)
    removeEscape(testOne)
    removeEscape(testTwo)
    fireEvent(document, testMakeEvent('Escape'))

    expect(testOne).not.toHaveBeenCalled()
    expect(testTwo).not.toHaveBeenCalled()
  })
})
