/**
 * Utils - Key Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { createEvent } from '@testing-library/dom'
import { getKey } from '../key.js'

/**
 * Create div and add keydown event to it.
 *
 * @param {string} key
 * @return {KeyboardEvent}
 */
const testMakeEvent = (key = ''): KeyboardEvent => {
  const div = document.createElement('div')

  return createEvent.keyDown(div, { key }) as KeyboardEvent
}

/* Tests */

describe('getKey()', () => {
  it('should return empty string if key does not exist', () => {
    const result = getKey(testMakeEvent('A'))
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return ESC if key is Escape', () => {
    const result = getKey(testMakeEvent('Escape'))
    const expectedResult = 'ESC'

    expect(result).toBe(expectedResult)
  })

  it('should return SPACE if key is Space', () => {
    const result = getKey(testMakeEvent('Space'))
    const expectedResult = 'SPACE'

    expect(result).toBe(expectedResult)
  })

  it('should return ENTER if key is Enter', () => {
    const result = getKey(testMakeEvent('Enter'))
    const expectedResult = 'ENTER'

    expect(result).toBe(expectedResult)
  })

  it('should return LEFT if key is ArrowLeft', () => {
    const result = getKey(testMakeEvent('ArrowLeft'))
    const expectedResult = 'LEFT'

    expect(result).toBe(expectedResult)
  })
})
