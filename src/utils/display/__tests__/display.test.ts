/**
 * Utils - Display Test
 */

/* Imports */

import { it, expect, describe, beforeEach, afterEach, vi } from 'vitest'
import { setDisplay } from '../display.js'

/**
 * Create div element.
 *
 * @param {boolean} [none=false]
 * @param {boolean} [attr=false]
 * @return {HTMLDivElement}
 */
const testItem = (none: boolean = false, attr: boolean = false): HTMLDivElement => {
  const div = document.createElement('div')
  const body = document.body

  div.tabIndex = -1
  div.ariaLabel = 'Loading'

  if (none) {
    div.style.setProperty('display', 'none')
  }

  if (attr) {
    div.dataset.attr = 'show'
  }

  body.textContent = ''
  body.append(div)

  return div
}

/**
 * Check element attribute.
 *
 * @param {HTMLElement} item
 * @return {string|undefined}
 */
const testCheckAttribute = (item: HTMLElement): string | undefined => {
  return item.dataset.attr
}

/**
 * Check element display.
 *
 * @param {HTMLElement} item
 * @return {string}
 */
const testCheckDisplay = (item: HTMLElement): string => {
  return item.style.getPropertyValue('display')
}

/**
 * Check if element focused.
 *
 * @param {HTMLElement} item
 * @return {boolean}
 */
const testCheckFocus = (item: HTMLElement): boolean => {
  return item === document.activeElement
}

/**
 * Coerce timeout ID to number.
 *
 * @param {*} id
 * @return {number}
 */
const testGetTimeoutId = (id: unknown): number => {
  // @ts-expect-error - workaround NodeJS.Timeout
  return id[Symbol.toPrimitive]('number') // eslint-disable-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
}

/* Tests */

describe('setDisplay()', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return -1 if item is null', () => {
    const result = setDisplay(null, 'show')

    expect(result).toBe(-1)
  })

  it('should remove display property and return timeout ID', () => {
    const item = testItem(true)
    const result = setDisplay(item, 'show')

    vi.advanceTimersByTime(1)

    const displayResult = testCheckDisplay(item)
    const focusResult = testCheckFocus(item)

    expect(testGetTimeoutId(result)).toBeTypeOf('number')
    expect(displayResult).toBe('')
    expect(focusResult).toBe(false)
  })

  it('should remove display property, focus item and return timeout ID', () => {
    const item = testItem(true)
    const result = setDisplay(item, 'focus')

    vi.advanceTimersByTime(1)

    const displayResult = testCheckDisplay(item)
    const focusResult = testCheckFocus(item)

    expect(testGetTimeoutId(result)).toBeTypeOf('number')
    expect(displayResult).toBe('')
    expect(focusResult).toBe(true)
  })

  it('should add display property and return 0', () => {
    const item = testItem()
    const result = setDisplay(item, 'hide')
    const displayResult = testCheckDisplay(item)

    expect(result).toBe(0)
    expect(displayResult).toBe('none')
  })

  it('should add attribute and return timeout ID', () => {
    const item = testItem()
    const result = setDisplay(item, 'show', 'attr')

    vi.advanceTimersByTime(1)

    const attrResult = testCheckAttribute(item)
    const focusResult = testCheckFocus(item)

    expect(testGetTimeoutId(result)).toBeTypeOf('number')
    expect(attrResult).toBe('show')
    expect(focusResult).toBe(false)
  })

  it('should add attribute, focus item and return timeout ID', () => {
    const item = testItem()
    const result = setDisplay(item, 'focus', 'attr')

    vi.advanceTimersByTime(1)

    const attrResult = testCheckAttribute(item)
    const focusResult = testCheckFocus(item)

    expect(testGetTimeoutId(result)).toBeTypeOf('number')
    expect(attrResult).toBe('show')
    expect(focusResult).toBe(true)
  })

  it('should remove attribute and return 0', () => {
    const item = testItem(false, true)
    const result = setDisplay(item, 'hide', 'attr')
    const attrResult = testCheckAttribute(item)

    expect(result).toBe(0)
    expect(attrResult).toBe(undefined)
  })
})
