/**
 * Utils - Item Outer Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getOuterItems } from '../itemOuter.js'

/**
 * @typedef {object} TestItems
 * @prop {HTMLElement[]} all
 * @prop {HTMLElement[]} filtered
 * @prop {HTMLElement[]} prev
 * @prop {HTMLElement[]} next
 * @prop {HTMLElement} item
 */
interface TestItems {
  all: HTMLElement[]
  filtered: HTMLElement[]
  prev: HTMLElement[]
  next: HTMLElement[]
  item: HTMLElement
}

/**
 * Create elements and group by type
 *
 * @param {boolean} [single]
 * @return {TestItems}
 */
const testItems = (single = false): TestItems => {
  const container = document.createElement('div')
  const head = document.createElement('head')
  const style = document.createElement('style')
  const header = document.createElement('header')
  const span = document.createElement('span')
  const item = document.createElement('div')
  const list = document.createElement('ul')
  const button = document.createElement('button')
  const itemParent = document.createElement('div')
  const link = document.createElement('a')
  const footer = document.createElement('footer')
  const script = document.createElement('script')

  if (!single) {
    itemParent.append(list)
  }

  itemParent.append(item)

  if (!single) {
    itemParent.append(button)
  }

  container.append(head)
  container.append(style)
  container.append(header)
  container.append(span)
  container.append(itemParent)
  container.append(link)
  container.append(footer)
  container.append(script)

  const all = [
    list,
    button,
    header,
    span,
    link,
    footer
  ]

  const allSingle = [
    header,
    span,
    link,
    footer
  ]

  return {
    all: single ? allSingle : all,
    filtered: [
      list,
      button
    ],
    prev: [
      list,
      span,
      header
    ],
    next: [
      button,
      link,
      footer
    ],
    item
  }
}

/* Tests */

describe('getOuterItems()', () => {
  it('should return empty array if item is null', () => {
    const result = getOuterItems(null)
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if item has no parent', () => {
    const result = getOuterItems(document.documentElement)
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return header, span, link and footer elements if all and single item', () => {
    const { all, item } = testItems(true)
    const result = getOuterItems(item)

    expect(result).toEqual(all)
  })

  it('should return list, button, header, span, link and footer elements if all', () => {
    const { all, item } = testItems()
    const result = getOuterItems(item)

    expect(result).toEqual(all)
  })

  it('should return list, span and header elements if prev', () => {
    const { prev, item } = testItems()
    const result = getOuterItems(item, 'prev')

    expect(result).toEqual(prev)
  })

  it('should return button, link and footer elements if next', () => {
    const { next, item } = testItems()
    const result = getOuterItems(item, 'next')

    expect(result).toEqual(next)
  })

  it('should return list and button elements if filter', () => {
    const { filtered, item } = testItems()

    const result = getOuterItems(item, 'all', (store) => {
      let stop = false

      for (const storeItem of store) {
        const isButton = storeItem.tagName === 'BUTTON'

        if (isButton) {
          stop = true
          break
        }
      }

      return { store, stop }
    })

    expect(result).toEqual(filtered)
  })
})
