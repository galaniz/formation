/**
 * Render - Test
 */

/* Imports */

import type { RenderFunction, RenderItems, RenderStringFunction } from '../renderTypes.js'
import { it, expect, describe } from 'vitest'
import { isString } from '../../utils/string/string.js'
import { render, renderElement, renderString } from '../render.js' 

/**
 * Items to output.
 *
 * @type {RenderItems}
 */
const testItemsDataOne: RenderItems = {
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
 * Items to output.
 *
 * @type {RenderItems}
 */
const testItemsDataTwo: RenderItems = {
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
 * Minify string.
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
 * List item output as string.
 *
 * @type {RenderStringFunction}
 */
const testListItemString: RenderStringFunction<{ text: string }> = ({ args }) => {
  const { text } = args
  return [`<li>${text}`, '</li>']
}

/**
 * List item output as element.
 *
 * @type {RenderFunction}
 */
const testListItemElement: RenderFunction<{ text: string }> = ({ args }) => {
  const { text } = args

  return {
    tag: 'li',
    props: {
      textContent: text
    }
  }
}

/* Test renderString */

describe('renderString()', () => {
  it('should return empty string if functions are null', () => {
    // @ts-expect-error - test invalid functions
    const result = renderString(null)
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return empty string if items are null', () => {
    const result = renderString(
      {
        container (): string {
          return '<div></div>'
        }
      },
      // @ts-expect-error - test invalid function
      null
    )
    const expectedResult = ''

    expect(result).toBe(expectedResult)
  })

  it('should return multi-level list as string', () => {
    const html = renderString(
      {
        ul () {
          return ['<ul>', '</ul>']
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
    const html = renderString(
      {
        ul () {
          return ['<ul>', '</ul>']
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

  it('should return single level list with item classes', () => {
    const html = renderString(
      {
        ul () {
          return ['<ul>', '</ul>']
        },
        li (props) {
          const { args } = props
          const { text } = args

          return `<li class="test">${text as string}</li>`
        }
      },
      testItemsDataTwo
    )

    const result = testMinify(html)
    const expectedResult = testMinify(`
      <ul>
        <li class="test">Item one</li>
        <li class="test">Item two</li>
        <li class="test">Item three</li>
        <li class="test">Item four</li>
        <li class="test">Item five</li>
      </ul>
    `)

    expect(result).toBe(expectedResult)
  })
})

/* Test renderElement */

describe('renderElement()', () => {
  it('should return null if args are null', () => {
    // @ts-expect-error - test invalid args
    const result = renderElement(null)
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if tag is undefined', () => {
    const result = renderElement({
      // @ts-expect-error - test invalid tag
      tag: undefined
    })

    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return div without data attribute', () => {
    const result = renderElement({
      tag: 'div',
      attrs: {
        // @ts-expect-error - test invalid attribute value
        'data-attr': false
      }
    })

    const expectedResult = document.createElement('div')

    expect(result).toEqual(expectedResult)
  })

  it('should return div without invalid props or attributes', () => {
    const result = renderElement({
      tag: 'div',
      props: {
        // @ts-expect-error - test invalid prop
        __proto__: 'test'
      },
      attrs: {
        prototype: 'test'
      }
    })

    const expectedResult = document.createElement('div')

    expect(result).toEqual(expectedResult)
  })

  it('should return div with data attribute and inert property', () => {
    const result = renderElement({
      tag: 'div',
      props: {
        inert: true
      },
      attrs: {
        'data-attr': 'false'
      }
    })

    const expectedResult = document.createElement('div')

    expectedResult.inert = true
    expectedResult.dataset.attr = 'false'

    expect(result).toEqual(expectedResult)
  })
})

/* Test render */

describe('render()', () => {
  it('should return null if functions are null', () => {
    // @ts-expect-error - test invalid functions
    const result = render(null)
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if items are null', () => {
    const result = render(
      {
        container () {
          return {
            tag: 'ul'
          }
        }
      },
      // @ts-expect-error - test invalid function
      null
    )

    const expectedResult = null

    expect(result).toEqual(expectedResult)
  })

  it('should return null if render function returns invalid object', () => {
    const result = render(
      {
        // @ts-expect-error - test invalid return
        ul () {
          return {
            tag: null
          }
        }
      },
      testItemsDataOne
    )

    const expectedResult = null

    expect(result).toEqual(expectedResult)
  })

  it('should return multi-level list element', () => {
    const html = render(
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

    const result = !html ? '' : testMinify(html.outerHTML)
    const compare = document.createElement('ul')
    compare.role = 'list'
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
    const html = render(
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

    const result = !html ? '' : testMinify(html.outerHTML)
    const compare = document.createElement('ul')
    compare.role = 'list'
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
