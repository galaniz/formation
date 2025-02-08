/**
 * Utils - Focusability Test
 */

/* Imports */

import { it, expect, describe, beforeEach } from 'vitest'
import { config, configFallback } from '../../../config/config.js'
import {
  toggleFocusability,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
} from '../focusability.js'
import {
  toggleFocusabilityFallback,
  getOuterFocusableItemsFallback
} from '../focusabilityFallback.js'

/**
 * @typedef {object} TestHtmlObj
 * @prop {HTMLElement[]} focusable
 * @prop {HTMLElement[]} nonFocusable
 * @prop {HTMLElement[]} inner
 * @prop {HTMLElement[]} outer
 * @prop {HTMLElement[]} outerFallback
 * @prop {HTMLElement} item
 */
interface TestHtmlObj {
  focusable: HTMLElement[]
  nonFocusable: HTMLElement[]
  inner: HTMLElement[]
  outer: HTMLElement[]
  outerFallback: HTMLElement[]
  item: HTMLElement
}

/**
 * Create elements and group by type
 *
 * @return {TestHtmlObj}
 */
const testHtml = (): TestHtmlObj => {
  const nav = document.createElement('nav')
  const link = document.createElement('a')
  const main = document.createElement('main')
  const iframe = document.createElement('iframe')
  const video = document.createElement('video')
  const audio = document.createElement('audio')
  const details = document.createElement('details')
  const summary = document.createElement('summary')
  const div = document.createElement('div')
  const span = document.createElement('span')
  const divTab = document.createElement('div')
  const divEdit = document.createElement('div')
  const footer = document.createElement('footer')
  const form = document.createElement('form')
  const select = document.createElement('select')
  const option = document.createElement('option')
  const input = document.createElement('input')
  const textarea = document.createElement('textarea')
  const button = document.createElement('button')
  const body = document.body

  body.innerHTML = ''

  iframe.id = 'hidden-test'
  divTab.id = 'tabindex-test'
  divEdit.id = 'editable-text'

  divTab.tabIndex = 0
  iframe.ariaHidden = 'true'
  divEdit.setAttribute('contenteditable', 'true') // divEdit.contentEditable = 'true' not working as expected

  nav.append(link)
  details.append(summary)
  main.append(iframe)
  main.append(video)
  div.append(details)
  div.append(audio)
  div.append(button)
  main.append(div)
  main.append(span)
  main.append(divTab)
  main.append(divEdit)
  select.append(option)
  form.append(select)
  form.append(input)
  form.append(textarea)
  footer.append(form)
  body.append(nav)
  body.append(main)
  body.append(footer)

  return {
    focusable: [
      link,
      iframe,
      video,
      audio,
      details,
      select,
      input,
      textarea,
      button,
      divTab,
      divEdit
    ],
    nonFocusable: [
      nav,
      main,
      div,
      span,
      footer,
      form
    ],
    inner: [
      details,
      audio,
      button
    ],
    outer: [
      iframe,
      video,
      span,
      divTab,
      divEdit,
      nav,
      footer
    ],
    outerFallback: [
      iframe,
      video,
      divTab,
      divEdit,
      link,
      select,
      input,
      textarea
    ],
    item: div
  }
}

/* Test toggleFocusability */

describe('toggleFocusability()', () => {
  beforeEach(() => {
    config.inert = true
    configFallback.toggleFocusability = undefined
    configFallback.getOuterFocusableItems = undefined
  })

  it('should return undefined if items are empty', () => {
    const result = toggleFocusability(true, [])
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if items are null', () => {
    // @ts-expect-error - test invalid items
    const result = toggleFocusability(true, null)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it('should return undefined if inert false and no callable fallback', () => {
    config.inert = false

    const html = testHtml()
    const { outer } = html

    const result = toggleFocusability(false, outer)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it(
    'should modify aria hidden, tabindex and contenteditable attributes if inert false and fallback exists',
    () => {
      config.inert = false
      configFallback.toggleFocusability = toggleFocusabilityFallback

      const html = testHtml()
      const { outerFallback } = html

      const result = toggleFocusability(false, outerFallback)
      const fakeInertResult = outerFallback.filter(item => {
        const ariaHidden = item.ariaHidden
        const tabIndex = item.tabIndex
        const editable = item.contentEditable

        if (ariaHidden === 'true' && tabIndex === -1 && editable === 'false') {
          return false
        }

        return true
      }).length
      const expectedResult = false
      const expectedFakeInertResult = 0

      expect(result).toBe(expectedResult)
      expect(fakeInertResult).toBe(expectedFakeInertResult)
    }
  )

  it('should add inert attribute to items if on is false', () => {
    const html = testHtml()
    const { outer } = html

    const result = toggleFocusability(false, outer)
    const inertResult = outer.filter(item => !item.inert).length // Filter out if inert
    const expectedResult = false
    const expectedInertResult = 0

    expect(result).toBe(expectedResult)
    expect(inertResult).toBe(expectedInertResult)
  })

  it('should remove inert attribute from items if on is true', () => {
    const html = testHtml()
    const { outer } = html

    toggleFocusability(false, outer)

    const result = toggleFocusability(true, outer)
    const inertResult = outer.filter(item => item.inert).length // Filter out if not inert
    const expectedResult = true
    const expectedInertResult = 0

    expect(result).toBe(expectedResult)
    expect(inertResult).toBe(expectedInertResult)
  })
})

/* Test toggleFocusabilityFallback */

describe('toggleFocusabilityFallback()', () => {
  it('should return undefined if items are null', () => {
    // @ts-expect-error - test invalid items
    const result = toggleFocusabilityFallback(true, null)
    const expectedResult = undefined

    expect(result).toBe(expectedResult)
  })

  it(
    'should modify aria hidden, tabindex and contenteditable attributes if fallback and on is false',
    () => {
      const html = testHtml()
      const { outerFallback } = html

      const result = toggleFocusabilityFallback(false, outerFallback)
      const fakeInertResult = outerFallback.filter(item => {
        const ariaHidden = item.ariaHidden
        const tabIndex = item.tabIndex
        const editable = item.contentEditable

        if (ariaHidden === 'true' && tabIndex === -1 && editable === 'false') {
          return false
        }

        return true
      }).length
      const expectedResult = false
      const expectedFakeInertResult = 0

      expect(result).toBe(expectedResult)
      expect(fakeInertResult).toBe(expectedFakeInertResult)
    }
  )

  it(
    'should restore aria hidden, tabindex and contenteditable values if fallback and on is true',
    () => {
      const html = testHtml()
      const { outerFallback } = html

      toggleFocusabilityFallback(false, outerFallback)

      const result = toggleFocusabilityFallback(true, outerFallback)
      const fakeInertResult = outerFallback.filter(item => {
        const ariaHidden = item.ariaHidden
        const tabIndex = item.getAttribute('tabindex')
        const editable = item.getAttribute('contenteditable')
        const ariaCompare = item.id === 'hidden-test' ? 'true' : null
        const tabIndexCompare = item.id === 'tabindex-test' ? '0' : null
        const editableCompare = item.id === 'editable-text' ? 'true' : null

        if (ariaHidden === ariaCompare && tabIndex === tabIndexCompare && editable === editableCompare) {
          return false
        }

        return true
      }).length
      const expectedResult = true
      const expectedFakeInertResult = 0

      expect(result).toBe(expectedResult)
      expect(fakeInertResult).toBe(expectedFakeInertResult)
    }
  )
})

/* Test isItemFocusable */

describe('isItemFocusable()', () => {
  it('should return false if item is null', () => {
    const result = isItemFocusable(null)
    const expectedResult = false

    expect(result).toBe(expectedResult)
  })

  it('should return true for all focusable elements', () => {
    const html = testHtml()
    const { focusable } = html

    const store: Set<boolean> = new Set(
      focusable.map(item => isItemFocusable(item))
    )

    const result = !store.has(false)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })

  it('should return false for all non-focusable elements', () => {
    const html = testHtml()
    const { nonFocusable } = html

    const store: Set<boolean> = new Set(
      nonFocusable.map(item => isItemFocusable(item))
    )

    const result = !store.has(true)
    const expectedResult = true

    expect(result).toBe(expectedResult)
  })
})

/* Test getInnerFocusableItems */

describe('getInnerFocusableItems()', () => {
  it('should return empty array if item is null', () => {
    const result = getInnerFocusableItems(null)
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of focusable elements inside item', () => {
    const html = testHtml()
    const { inner: expectedResult, item } = html
    const result = getInnerFocusableItems(item)

    expect(result).toEqual(expectedResult)
  })
})

/* Test getOuterFocusableItems */

describe('getOuterFocusableItems()', () => {
  beforeEach(() => {
    config.inert = true
    configFallback.toggleFocusability = undefined
    configFallback.getOuterFocusableItems = undefined
  })

  it('should return empty array if item is null', () => {
    const result = getOuterFocusableItems(null)
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of siblings/ascendant sibling elements', () => {
    const html = testHtml()
    const { outer: expectedResult, item } = html
    const result = getOuterFocusableItems(item)

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if inert false and no callable fallback', () => {
    config.inert = false

    const html = testHtml()
    const { item } = html

    const result = getOuterFocusableItems(item)
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of focusable elements outside item if inert false and fallback exists', () => {
    config.inert = false
    configFallback.getOuterFocusableItems = getOuterFocusableItemsFallback

    const html = testHtml()
    const { outerFallback: expectedResult, item } = html
    const result = getOuterFocusableItems(item)

    expect(result).toEqual(expectedResult)
  })
})

/* Test getOuterFocusableItemsFallback */

describe('getOuterFocusableItemsFallback()', () => {
  it('should return empty array if item is null', () => {
    const result = getOuterFocusableItemsFallback(null)
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of focusable elements outside item', () => {
    const html = testHtml()
    const { outerFallback: expectedResult, item } = html
    const result = getOuterFocusableItemsFallback(item)

    expect(result).toEqual(expectedResult)
  })
})
