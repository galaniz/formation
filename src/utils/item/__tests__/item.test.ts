/**
 * Utils - Item Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getItem, getItems, getTemplateItem, cloneItem } from '../item.js'

/**
 * @typedef {object} TestHtml
 * @prop {HTMLElement} nav
 * @prop {HTMLElement} main
 * @prop {HTMLElement} footer
 * @prop {string} className
 * @prop {HTMLElement[]} classItems
 * @prop {Document} root
 * @prop {HTMLElement} list
 * @prop {HTMLElement[]} items
 * @prop {HTMLElement[]} footerItems
 * @prop {HTMLElement} template
 */
interface TestHtml {
  nav: HTMLElement
  main: HTMLElement
  footer: HTMLElement
  className: string
  classItems: HTMLElement[]
  root: Document
  list: HTMLElement
  items: HTMLElement[]
  footerItems: HTMLElement[]
  linkItems: HTMLElement[]
  template: HTMLElement
}

/**
 * Html elements
 *
 * @return {TestHtml}
 */
const testHtml = (): TestHtml => {
  const nav = document.createElement('nav')
  const list = document.createElement('ul')
  const itemOne = document.createElement('li')
  const itemTwo = document.createElement('li')
  const itemThree = document.createElement('li')
  const main = document.createElement('main')
  const footer = document.createElement('footer')
  const divOne = document.createElement('div')
  const divTwo = document.createElement('div')
  const divThree = document.createElement('div')
  const divFour = document.createElement('div')
  const divFive = document.createElement('div')
  const divSix = document.createElement('div')
  const linkOne = document.createElement('a')
  const linkTwo = document.createElement('a')
  const linkThree = document.createElement('a')
  const templateOne = document.createElement('template')
  const templateTwo = document.createElement('template')
  const template = document.createElement('div')
  const body = document.body
  const className = 'test-class'

  divOne.className = className
  divTwo.className = className
  divThree.className = className
  divFour.className = className
  divFive.className = className
  divSix.className = className

  templateOne.id = 'template-one'
  templateTwo.id = 'template-two'
  template.id = 'template'

  itemOne.append(linkOne)
  itemTwo.append(linkTwo)
  itemThree.append(linkThree)
  list.append(itemOne)
  list.append(itemTwo)
  list.append(itemThree)
  nav.append(list)
  main.append(divOne)
  main.append(divTwo)
  main.append(divThree)
  footer.append(divFour)
  footer.append(divFive)
  footer.append(divSix)
  templateTwo.append(template)

  body.innerHTML = ''
  body.append(nav)
  body.append(main)
  body.append(footer)
  body.append(templateOne)
  body.append(templateTwo)

  return {
    nav,
    main,
    footer,
    className,
    classItems: [
      divOne,
      divTwo,
      divThree
    ],
    root: document,
    list,
    items: [
      itemOne,
      itemTwo,
      itemThree
    ],
    footerItems: [
      divFour,
      divFive,
      divSix
    ],
    linkItems: [
      linkOne,
      linkTwo,
      linkThree
    ],
    template
  }
}

/* Test getItem */

describe('getItem()', () => {
  it('should return null if item is empty string', () => {
    const result = getItem('')
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return null if item is undefined', () => {
    // @ts-expect-error - test invalid item
    const result = getItem(undefined)
    const expectedResult = null

    expect(result).toBe(expectedResult)
  })

  it('should return nav element', () => {
    const { root, nav } = testHtml()
    const result = getItem('nav', root)
    const expectedResult = nav

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if array of empty string', () => {
    const result = getItem([''])
    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array of array of null element', () => {
    // @ts-expect-error - test invalid item
    const result = getItem([null])
    const expectedResult: string[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return array of div elements', () => {
    const { main, className, classItems } = testHtml()
    const result = getItem([`.${className}`], main)
    const expectedResult = classItems

    expect(result).toEqual(expectedResult)
  })
})

/* Test getItems */

describe('getItems()', () => {
  it('should return empty object if items are null', () => {
    const result = getItems(null)
    const expectedResult = {}

    expect(result).toEqual(expectedResult)
  })

  it('should return empty array if items are array of null items', () => {
    const result = getItems([null])
    const expectedResult: unknown[] = []

    expect(result).toEqual(expectedResult)
  })

  it('should return object of null element and empty array', () => {
    const { root } = testHtml()
    const result = getItems(
      {
        nullItem: '.does-not-exist',
        nullItems: [
          'figure'
        ]
      },
      root
    )

    const expectedResult = {
      nullItem: null,
      nullItems: []
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object of nav, main and footer elements', () => {
    const { root, nav, main, footer } = testHtml()
    const result = getItems(
      {
        nav: 'nav',
        main: 'main',
        footer: 'footer'
      },
      root
    )

    const expectedResult = {
      nav,
      main,
      footer
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return array of div elements from footer', () => {
    const { className, footerItems, footer } = testHtml()
    const result = getItems(
      [
        `.${className}`
      ],
      footer
    )

    expect(result).toEqual(footerItems)
  })

  it('should return object of nav, list and array of list and link elements', () => {
    const { root, nav, list, items, linkItems } = testHtml()
    const result = getItems(
      {
        nav: 'nav',
        list: 'ul',
        items: [
          {
            context: 'li',
            link: 'a'
          }
        ]
      },
      root
    )

    const expectedResult = {
      nav,
      list,
      items: [
        {
          context: items[0],
          link: linkItems[0]
        },
        {
          context: items[1],
          link: linkItems[1]
        },
        {
          context: items[2],
          link: linkItems[2]
        }
      ]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return object of nav, list and array of list elements', () => {
    const { root, nav, list, items } = testHtml()
    const result = getItems(
      {
        context: 'nav',
        list: 'ul',
        items: [
          'li'
        ]
      },
      root
    )

    const expectedResult = {
      context: nav,
      list,
      items
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div from root context', () => {
    const { root, classItems } = testHtml()
    const result = getItems(
      {
        context: undefined,
        div: 'div'
      },
      root
    )

    const expectedResult = {
      context: root,
      div: classItems[0]
    }

    expect(result).toEqual(expectedResult)
  })

  it('should return div from footer context', () => {
    const { root, footer, footerItems } = testHtml()
    const result = getItems(
      {
        context: footer,
        div: 'div'
      },
      root
    )

    const expectedResult = {
      context: root,
      div: footerItems[0]
    }

    expect(result).toEqual(expectedResult)
  })
})

/* Test getTemplateItem */

describe('getTemplateItem()', () => {
  it('should return undefined if template item does not exist', () => {
    const result = getTemplateItem('does-not-exist')
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return null if first element does not exist', () => {
    testHtml()

    const result = getTemplateItem('template-one')
    const expectedResult = null

    expect(result).toEqual(expectedResult)
  })

  it('should return first element from template', () => {
    const { template } = testHtml()

    const result = getTemplateItem('template-two')
    const expectedResult = template

    expect(result).toEqual(expectedResult)
  })
})

/* Test cloneItem */

describe('cloneItem()', () => {
  it('should return undefined if item is null', () => {
    const result = cloneItem(null)
    const expectedResult = undefined

    expect(result).toEqual(expectedResult)
  })

  it('should return cloned item', () => {
    const { template } = testHtml()

    const result = cloneItem(template)
    const expectedId = template.id
    const expectedTag = template.tagName

    expect(result?.id).toEqual(expectedId)
    expect(result?.tagName).toEqual(expectedTag)
  })
})
