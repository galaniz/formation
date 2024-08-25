/**
 * Utils - Render Html String Test
 */

/* Imports */

import type { RenderHtmlFunction, RenderHtmlItems, RenderHtmlStringFunction } from '../renderHtmlTypes'
import { it, expect, describe } from 'vitest'
import { isString } from '../../isString/isString'
import { renderHtml, renderHtmlString } from '../renderHtml'

// should return parent object that looks like this
// should pass children object that looks like this
// should return ? if render function returns null
// should return ? if render function returns null or empty string   

/**
 * Items to output
 *
 * @type {import('../renderHtmlTypes').RenderHtmlItems}
 */
const testItemsDataOne: RenderHtmlItems = {
  renderType: 'ul',
  content: [
    {
      renderType: 'li',
      text: 'Item one'
    },
    {
      renderType: 'li',
      text: 'Item two'
    },
    {
      renderType: 'li',
      text: 'Item three',
      content: [
        {
          renderType: 'ul',
          content: [
            {
              renderType: 'li',
              text: 'Nested item one'
            },
            {
              renderType: 'li',
              text: 'Nested item two'
            },
            {
              renderType: 'li',
              text: 'Nested item three'
            }
          ]
        }
      ]
    },
    {
      renderType: 'li',
      text: 'Item four'
    },
    {
      renderType: 'li',
      text: 'Item five'
    }
  ]
}

/**
 * Items to output
 *
 * @type {import('../renderHtmlTypes').RenderHtmlItems}
 */
const testItemsDataTwo: RenderHtmlItems = {
  renderType: 'ul',
  content: [
    {
      renderType: 'li',
      text: 'Item one'
    },
    {
      renderType: 'li',
      text: 'Item two'
    },
    {
      renderType: 'li',
      text: 'Item three',
      content: [
        {
          renderType: 'doesNotExist',
          content: [
            {
              renderType: 'li',
              text: 'Nested item one'
            },
            {
              renderType: 'li',
              text: 'Nested item two'
            },
            {
              renderType: 'li',
              text: 'Nested item three'
            }
          ]
        }
      ]
    },
    {
      renderType: 'li',
      text: 'Item four'
    },
    {
      renderType: 'li',
      text: 'Item five'
    }
  ]
}

/**
 * Minify string
 *
 * @param {string} str
 * @return {string}
 */
const testMinify = (str?: string): string => {
  if (!isString(str)) {
    return ''
  }

  return str.replace(/\s+/g, '')
}

/**
 * List item output as string
 *
 * @type {import('../renderHtmlTypes').RenderHtmlStringFunction}
 */
const testListItemString: RenderHtmlStringFunction<{ text: string }> = ({ args }) => {
  const { text } = args

  return {
    start: `<li>${text}`,
    end: '</li>'
  }
}

/**
 * List item output as element
 *
 * @type {import('../renderHtmlTypes').RenderHtmlFunction}
 */
const testListItemElement: RenderHtmlFunction<{ text: string }> = ({ args }) => {
  const { text } = args

  return {
    tag: 'li',
    props: {
      textContent: text
    }
  }
}

/* Test renderHtmlString */

describe('renderHtmlString()', () => {
  it('should return empty string if functions are null', () => {
    // @ts-expect-error
    const result = renderHtmlString(null)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if items are null', () => {
    const result = renderHtmlString(
      {
        container (): string {
          return '<div></div>'
        }
      },
      // @ts-expect-error
      null
    )
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return multi-level list as string', () => {
    const html = renderHtmlString(
      {
        ul () {
          return {
            start: '<ul>',
            end: '</ul>'
          }
        },
        li: testListItemString
      },
      testItemsDataOne
    )

    const result = testMinify(html)
    const expectedResult = testMinify(`
      <ul>
        <li>Item one</li>
        <li>Item two</li>
        <li>
          Item three
          <ul>
            <li>Nested item one</li>
            <li>Nested item two</li>
            <li>Nested item three</li>
          </ul>
        </li>
        <li>Item four</li>
        <li>Item five</li>
      </ul>
    `)

    expect(result).toBe(expectedResult)
  })

  it('should return single level list as string if renderType does not exist', () => {
    const html = renderHtmlString(
      {
        ul () {
          return {
            start: '<ul>',
            end: '</ul>'
          }
        },
        li: testListItemString
      },
      testItemsDataTwo
    )

    const result = testMinify(html)
    const expectedResult = testMinify(`
      <ul>
        <li>Item one</li>
        <li>Item two</li>
        <li>Item three</li>
        <li>Item four</li>
        <li>Item five</li>
      </ul>
    `)

    expect(result).toBe(expectedResult)
  })
})

/* Test renderHtml */

describe('renderHtml()', () => {
  it('should return null if functions are null', () => {
    // @ts-expect-error
    const result = renderHtml(null)
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if items are null', () => {
    const result = renderHtml(
      {
        container () {
          return {
            tag: 'ul'
          }
        }
      },
      // @ts-expect-error
      null
    )
    const expectedResult = null

    expect(result).toEqual(expectedResult)
  })

  it('should return multi-level list element', () => {
    const html = renderHtml(
      {
        ul () {
          return {
            tag: 'ul',
            attrs: {
              role: 'list'
            }
          }
        },
        li: testListItemElement
      },
      testItemsDataOne
    )

    const result = html === null ? '' : testMinify(html.outerHTML)
    const compare = document.createElement('ul')
    compare.setAttribute('role', 'list')
    compare.innerHTML = `
      <li>Item one</li>
      <li>Item two</li>
      <li>
        Item three
        <ul role="list">
          <li>Nested item one</li>
          <li>Nested item two</li>
          <li>Nested item three</li>
        </ul>
      </li>
      <li>Item four</li>
      <li>Item five</li>
    `

    const expectedResult = testMinify(compare.outerHTML)

    expect(result).toBe(expectedResult)
  })

  it('should return single level list element if renderType does not exist', () => {
    const html = renderHtml(
      {
        ul () {
          return {
            tag: 'ul',
            attrs: {
              role: 'list'
            }
          }
        },
        li: testListItemElement
      },
      testItemsDataTwo
    )

    const result = html === null ? '' : testMinify(html.outerHTML)
    const compare = document.createElement('ul')
    compare.setAttribute('role', 'list')
    compare.innerHTML = `
      <li>Item one</li>
      <li>Item two</li>
      <li>Item three</li>
      <li>Item four</li>
      <li>Item five</li>
    `

    const expectedResult = testMinify(compare.outerHTML)

    expect(result).toBe(expectedResult)
  })
})
