/**
 * Utils - Get Outer Items Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getOuterItems } from '../getOuterItems'

/**
 * @typedef {object} TestItemsObj
 * @prop {HTMLElement[]} all
 * @prop {HTMLElement[]} filtered
 * @prop {HTMLElement[]} prev
 * @prop {HTMLElement[]} next
 * @prop {HTMLElement} item
 */
interface TestItemsObj {
  all: HTMLElement[]
  filtered: HTMLElement[]
  prev: HTMLElement[]
  next: HTMLElement[]
  item: HTMLElement
}

/**
 * Create elements and group by type
 *
 * @return {TestItemsObj}
 */
const testGetItems = (): TestItemsObj => {
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

  itemParent.appendChild(list)
  itemParent.appendChild(item)
  itemParent.appendChild(button)
  container.appendChild(head)
  container.appendChild(style)
  container.appendChild(header)
  container.appendChild(span)
  container.appendChild(itemParent)
  container.appendChild(link)
  container.appendChild(footer)
  container.appendChild(script)

  return {
    all: [
      list,
      button,
      header,
      span,
      link,
      footer
    ],
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
  it('should return list, button, header, span, link and footer if all', () => {
    const { all, item } = testGetItems()
    const result = getOuterItems(item)

    expect(result).toEqual(all)
  })

  it('should return list, span and header if prev', () => {
    const { prev, item } = testGetItems()
    const result = getOuterItems(item, 'prev')

    expect(result).toEqual(prev)
  })

  it('should return button, link and footer if next', () => {
    const { next, item } = testGetItems()
    const result = getOuterItems(item, 'next')

    expect(result).toEqual(next)
  })

  it('should return list and button if filter', () => {
    const { filtered, item } = testGetItems()

    const result = getOuterItems(item, 'all', (store) => {
      let stop = false

      for (let i = 0; i < store.length; i += 1) {
        const storeItem = store[i]

        if (storeItem.tagName === 'BUTTON') {
          stop = true
          break
        }
      }

      return { store, stop }
    })

    expect(result).toEqual(filtered)
  })
})
