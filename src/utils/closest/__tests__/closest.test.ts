/**
 * Utils - Closest Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getQueriesForElement } from '@testing-library/dom'
import { closest } from '../closest'

/**
 * Top level class name
 *
 * @type {string}
 */

const className: string = 'level-test'

/**
 * Function - output html with nested elements
 *
 * @return {HTMLDivElement}
 */

const html = (): HTMLDivElement => {
  const container = document.createElement('div')

  container.innerHTML = `
    <div data-testid="level-0" class="${className}">
      <div data-testid="level-1">
        <div data-testid="level-2">
          <div data-testid="level-3">
          </div>
        </div>
      </div>
    </div>
  `

  return container
}

/**
 * Function - get html element
 *
 * @param {string} [id=level-3]
 * @return {HTMLElement}
 */

const getElement = (id: string = 'level-3'): HTMLElement => {
  const output = html()
  const { getByTestId } = getQueriesForElement(output)

  return getByTestId(id)
}

/* Tests */

describe('closest()', () => {
  it('should return null if item is null', () => {
    const item = null
    const result = closest(item, className)

    expect(result).toBe(null)
  })

  it('should return null if classes is empty string', () => {
    const item = getElement()
    const result = closest(item, '')

    expect(result).toBe(null)
  })

  it('should return null if max value is below target element level', () => {
    const item = getElement()
    const result = closest(item, className, 1)

    expect(result).toBe(null)
  })

  it('should return element with specified classes', () => {
    const item = getElement()
    const result = closest(item, className)
    const compare = getElement('level-0')

    expect(result).toEqual(compare)
  })
})
