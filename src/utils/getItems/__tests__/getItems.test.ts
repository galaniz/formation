/**
 * Utils - Get Items Test
 */

/* Imports */

import { it, expect, describe } from 'vitest'
import { getItems } from '../getItems'

/**
 * @typedef {object} TestHtmlObj
 * @prop {HTMLElement} nav
 * @prop {HTMLElement} main
 * @prop {HTMLElement} footer
 * @prop {string} className
 * @prop {HTMLElement[]} classItems
 * @prop {Document} root
 * @prop {HTMLElement} list
 * @prop {HTMLElement[]} items
 * @prop {HTMLElement[]} footerItems
 */
interface TestHtmlObj {
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
}

/**
 * Get html elements
 *
 * @return {TestHtmlObj}
 */
const testGetHtml = (): TestHtmlObj => {
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
  const body = document.body
  const className = 'test-class'

  divOne.className = className
  divTwo.className = className
  divThree.className = className
  divFour.className = className
  divFive.className = className
  divSix.className = className

  itemOne.appendChild(linkOne)
  itemTwo.appendChild(linkTwo)
  itemThree.appendChild(linkThree)
  list.appendChild(itemOne)
  list.appendChild(itemTwo)
  list.appendChild(itemThree)
  nav.appendChild(list)
  main.appendChild(divOne)
  main.appendChild(divTwo)
  main.appendChild(divThree)
  footer.appendChild(divFour)
  footer.appendChild(divFive)
  footer.appendChild(divSix)

  body.innerHTML = ''
  body.appendChild(nav)
  body.appendChild(main)
  body.appendChild(footer)

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
    ]
  }
}

/* Tests */

describe('getItems()', () => {
  it('should return empty object if items are null', () => {
    const result = getItems(null)
    const expectedResult = {}

    expect(result).toEqual(expectedResult)
  })

  it('should return object of null element and empty array', () => {
    const { root } = testGetHtml()
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
    const { root, nav, main, footer } = testGetHtml()
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
    const { className, footerItems, footer } = testGetHtml()
    const result = getItems(
      [
        `.${className}`
      ],
      footer
    )

    expect(result).toEqual(footerItems)
  })

  it('should return object of nav, list and array of list and link elements', () => {
    const { root, nav, list, items, linkItems } = testGetHtml()
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
    const { root, nav, list, items } = testGetHtml()
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
})
