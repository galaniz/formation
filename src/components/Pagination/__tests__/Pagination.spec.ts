/**
 * Components - Pagination Test
 */

import type { Pagination } from '../Pagination.js'
import type { PaginationEventDetail, PaginationState } from '../PaginationTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testPagLoad: string[]
  }
}

/* Url of test page */

const pagUrl = 'http://localhost:3000/spec/components/Pagination/__tests__/Pagination'

/* Navigation and entry markup for request responses */

const nav = /* html */`
  <li>
    <a href="/blog/" aria-label="Previous page">
      ←
    </a>
  </li>
  <li>
    <a href="/blog/">
      <span class="a-hide-vis">Page </span>
      <span>1</span>
    </a>
  </li>
  <li>
    <span>
      <span class="a-hide-vis">Current page </span>
      <span>2</span>
    </span>
  </li>
  <li>
    <a href="/blog/?page=3">
      <span class="a-hide-vis">Page </span>
      <span>3</span>
    </a>
  </li>
  <li>
    <a href="/blog/?page=3" aria-label="Next page">
      →
    </a>
  </li>
`

const entry = /* html */`
  <li>
    <a href="/blog/post-5/" data-testid="pag-first">Post 5</a>
  </li>
  <li>
    <a href="/blog/post-6/">Post 6</a>
  </li>
  <li>
    <a href="/blog/post-7/">Post 7</a>
  </li>
  <li>
    <a href="/blog/post-8/">Post 8</a>
  </li>
`

/* Tests */

test.describe('Pagination', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testPagLoad = []

      /* Listen on document so recording does not depend on when the elements init */

      document.addEventListener('pag:load', (e: Event) => {
        const { id } = e.target as HTMLElement
        const { source } = (e as CustomEvent<PaginationEventDetail>).detail

        window.testPagLoad.push(`${id}:${source}`)
      }, true)
    })

    await page.goto('/spec/components/Pagination/__tests__/Pagination.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const pagInit = await page.evaluate(() => {
      const pags: Pagination[] = Array.from(document.querySelectorAll('frm-pagination'))
      return pags.map(pag => pag.init)
    })

    expect(pagInit).toStrictEqual([
      false, // #pag-empty
      false, // #pag-partial
      true   // #pag
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const pagProps = await page.evaluate(async () => {
      const pag = document.querySelector('#pag') as Pagination

      pag.parentElement?.insertAdjacentElement('afterbegin', pag)

      await Promise.resolve()

      return {
        init: pag.init,
        url: pag.url,
        page: pag.page,
        templatesSize: pag.templates.size,
        clonesSize: pag.clones.size,
        params: pag.params,
        slots: Array.from(pag.slots).map(([key, value]) => `${key}:${value.tagName}`)
      }
    })

    expect(pagProps.init).toBe(true)
    expect(pagProps.url).toBe(pagUrl)
    expect(pagProps.page).toBe(1)
    expect(pagProps.templatesSize).toBe(2)
    expect(pagProps.clonesSize).toBe(0)
    expect(pagProps.params).toStrictEqual({})
    expect(pagProps.slots).toStrictEqual([
      'nav:OL',
      'entry:UL'
    ])
  })

  /* Test state */

  test('should set url, page and params from location', async ({ page }) => {
    // Extensionless path so params survive clean url redirect
    await page.goto('/spec/components/Pagination/__tests__/Pagination?page=3&cat=cat-1&__proto__=unsafe')

    const pagState = await page.evaluate(() => {
      const pag = document.querySelector('#pag') as Pagination

      return {
        url: pag.url,
        page: pag.page,
        params: pag.params,
        unsafeParam: Object.hasOwn(pag.params, '__proto__') // Prototype key skipped
      }
    })

    expect(pagState.url).toBe(pagUrl)
    expect(pagState.page).toBe(3)
    expect(pagState.params).toStrictEqual({ cat: 'cat-1' })
    expect(pagState.unsafeParam).toBe(false)
  })

  /* Test clones */

  test('should clone, append and reuse templates', async ({ page }) => {
    const pagClones = await page.evaluate(() => {
      const pag = document.querySelector('#pag') as Pagination
      const loader = pag.getClone('loader')
      const loaderAgain = pag.getClone('loader')
      const error = pag.getClone('error')

      return {
        reused: loader === loaderAgain, // Second call returns cached clone
        clonesSize: pag.clones.size,
        loaderParent: loader?.parentElement?.id,
        errorParent: error?.parentElement?.id,
        childCount: pag.children.length
      }
    })

    expect(pagClones.reused).toBe(true)
    expect(pagClones.clonesSize).toBe(2)
    expect(pagClones.loaderParent).toBe('pag')
    expect(pagClones.errorParent).toBe('pag')
    expect(pagClones.childCount).toBe(4) // Entry, nav and one clone each
  })

  test('should not clone if templates cleared', async ({ page }) => {
    const pagClone = await page.evaluate(() => {
      const pag = document.querySelector('#pag') as Pagination

      pag.templates.clear()

      return {
        clone: pag.getClone('loader'),
        clonesSize: pag.clones.size
      }
    })

    expect(pagClone.clone).toBe(null)
    expect(pagClone.clonesSize).toBe(0)
  })

  /* Test load */

  test('should emit load event and display loader', async ({ page }) => {
    await page.evaluate(async () => { // Default request has no response
      const pag = document.querySelector('#pag') as Pagination
      await pag.load('nav')
    })

    const loader = page.getByTestId('pag-loader')

    await expect(loader).toHaveAttribute('data-loader', 'show')
    await expect(loader).toBeFocused()

    const pagLoad = await page.evaluate(() => window.testPagLoad)

    expect(pagLoad).toStrictEqual(['pag:nav'])
  })

  test('should hide loader if response precedes display delay', async ({ page }) => {
    await page.evaluate(async () => {
      const pag = document.querySelector('#pag') as Pagination

      pag.request = (source) => { // Immediate response
        pag.update('success', source)
      }

      await pag.load('nav')
      await new Promise(resolve => { setTimeout(resolve, 0) }) // Display delay elapsed
    })

    await expect(page.getByTestId('pag-loader')).not.toHaveAttribute('data-loader')
  })

  /* Test nav */

  test('should update navigation, entry slots and location on click', async ({ page }) => {
    await page.evaluate(({ nav, entry }) => {
      const pag = document.querySelector('#pag') as Pagination

      pag.request = (source) => {
        pag.update('success', source, nav, entry)
      }
    }, { nav, entry })

    await page.getByTestId('pag-2').click()

    const firstEntry = page.getByTestId('pag-first')
    const entryItems = await page.getByTestId('pag-entry').innerHTML()
    const navItems = await page.getByTestId('pag-nav').innerHTML()

    await expect(firstEntry).toBeFocused()
    await expect(page).toHaveURL(/page=2/)

    expect(entryItems).toBe(entry)
    expect(navItems).toBe(nav)
  })

  test('should update navigation and entry slots with fragments on click', async ({ page }) => {
    await page.evaluate(({ nav, entry }) => {
      const pag = document.querySelector('#pag') as Pagination
      const navTemplate = document.createElement('template')
      const entryTemplate = document.createElement('template')

      navTemplate.innerHTML = nav
      entryTemplate.innerHTML = entry

      pag.request = (source) => {
        pag.update('success', source, navTemplate.content, entryTemplate.content)
      }
    }, { nav, entry })

    await page.getByTestId('pag-2').click()

    const firstEntry = page.getByTestId('pag-first')
    const entryItems = await page.getByTestId('pag-entry').innerHTML()
    const navItems = await page.getByTestId('pag-nav').innerHTML()

    await expect(firstEntry).toBeFocused()
    await expect(page).toHaveURL(/page=2/)

    expect(entryItems).toBe(entry)
    expect(navItems).toBe(nav)
  })

  test('should not load if click item is not a link', async ({ page }) => {
    const pagErrors: string[] = []

    page.on('pageerror', error => {
      pagErrors.push(error.message)
    })

    await page.getByTestId('pag-current').click()

    const pagState = await page.evaluate(() => {
      const pag = document.querySelector('#pag') as Pagination

      return {
        page: pag.page,
        load: window.testPagLoad
      }
    })

    expect(pagErrors).toStrictEqual([])
    expect(pagState.page).toBe(1)
    expect(pagState.load).toStrictEqual([])
  })

  test('should not load if click page is current page', async ({ page }) => {
    await page.getByTestId('pag-2').click() // Navigation unchanged - default request has no response
    await page.waitForFunction(() => { // Wait for load
      return window.testPagLoad.length === 1
    })

    await page.getByTestId('pag-2').click() // Same page - no load

    const pagState = await page.evaluate(() => {
      const pag = document.querySelector('#pag') as Pagination

      return {
        page: pag.page,
        load: window.testPagLoad
      }
    })

    expect(pagState.page).toBe(2)
    expect(pagState.load).toStrictEqual(['pag:nav'])
  })

  /* Test history */

  test('should push page and params to history', async ({ page }) => {
    const pagPage = await page.evaluate(({ nav, entry }) => {
      const pag = document.querySelector('#pag') as Pagination

      pag.page = 2
      pag.params = { cat: 'cat-1', sort: undefined } // Empty param removed

      return {
        updated: pag.update('success', 'nav', nav, entry),
        url: window.location.href,
        state: history.state as PaginationState
      }
    }, { nav, entry })

    const pagNoPage = await page.evaluate(() => {
      const pag = document.querySelector('#pag') as Pagination

      pag.page = 1 // Page param removed

      return {
        updated: pag.update('success', 'nav'),
        url: window.location.href,
        state: history.state as PaginationState
      }
    })

    expect(pagPage.updated).toBe(true)
    expect(pagPage.url).toBe(`${pagUrl}?page=2&cat=cat-1`)
    expect(pagPage.state).toStrictEqual({
      page: 2,
      params: { cat: 'cat-1' }
    })

    expect(pagNoPage.updated).toBe(true)
    expect(pagNoPage.url).toBe(`${pagUrl}?cat=cat-1`)
    expect(pagNoPage.state).toStrictEqual({
      page: 1,
      params: { cat: 'cat-1' }
    })
  })

  test('should not push to history if pop source', async ({ page }) => {
    const pagPop = await page.evaluate(({ nav, entry }) => {
      const pag = document.querySelector('#pag') as Pagination
      const url = window.location.href

      pag.page = 2

      return {
        updated: pag.update('success', 'pop', nav, entry),
        url,
        newUrl: window.location.href,
        state: history.state as PaginationState | null
      }
    }, { nav, entry })

    expect(pagPop.updated).toBe(true)
    expect(pagPop.newUrl).toBe(pagPop.url)
    expect(pagPop.state).toBe(null)
  })

  test('should load page and params from history navigation', async ({ page }) => {
    await page.evaluate(({ nav, entry }) => {
      const pag = document.querySelector('#pag') as Pagination

      pag.params = { cat: 'cat-1' }

      pag.request = (source) => {
        pag.update('success', source, nav, entry)
      }
    }, { nav, entry })

    await page.getByTestId('pag-2').click()
    await expect(page).toHaveURL(`${pagUrl}?page=2&cat=cat-1`)

    await page.goBack()
    await page.waitForFunction(() => { // Wait for pop load
      return window.testPagLoad.includes('pag:pop')
    })

    const pagBack = await page.evaluate(() => { // No state so params from location
      const pag = document.querySelector('#pag') as Pagination

      return {
        page: pag.page,
        params: pag.params,
        url: window.location.href
      }
    })

    await page.goForward()
    await page.waitForFunction(() => { // Wait for second pop load
      return window.testPagLoad.filter(load => load === 'pag:pop').length === 2
    })

    const pagForward = await page.evaluate(() => { // Page and params from state
      const pag = document.querySelector('#pag') as Pagination

      return {
        page: pag.page,
        params: pag.params,
        url: window.location.href
      }
    })

    expect(pagBack.page).toBe(1)
    expect(pagBack.params).toStrictEqual({})
    expect(pagBack.url).toBe(pagUrl)
    expect(pagForward.page).toBe(2)
    expect(pagForward.params).toStrictEqual({ cat: 'cat-1' })
    expect(pagForward.url).toBe(`${pagUrl}?page=2&cat=cat-1`)
  })

  /* Test error */

  test('should display error and clear slots on failed request', async ({ page }) => {
    await page.evaluate(() => { // Failed request
      const pag = document.querySelector('#pag') as Pagination

      pag.request = async (source) => {
        await new Promise(resolve => { setTimeout(resolve, 0) }) // Delay response so loader displays first
        pag.update('error', source)
      }
    })

    await page.getByTestId('pag-2').click()

    const error = page.getByTestId('pag-error')

    await expect(error).toBeVisible()
    await expect(error).toBeFocused()
    await expect(page.getByTestId('pag-loader')).not.toHaveAttribute('data-loader')
    await expect(page).toHaveURL(pagUrl) // No history update

    const navItems = await page.getByTestId('pag-nav').innerHTML()
    const entryItems = await page.getByTestId('pag-entry').innerHTML()

    const pagUpdated = await page.evaluate(() => { // Slots and history not updated
      const pag = document.querySelector('#pag') as Pagination
      return pag.update('error', 'nav')
    })

    expect(navItems).toBe('')
    expect(entryItems).toBe('')
    expect(pagUpdated).toBe(false)
  })

  test('should not focus error if update follows error', async ({ page }) => {
    await page.evaluate(async () => {
      const pag = document.querySelector('#pag') as Pagination

      pag.update('error', 'nav')
      pag.update('success', 'nav') // Error focus delay cleared

      await new Promise(resolve => { setTimeout(resolve, 0) }) // Focus delay elapsed
    })

    await expect(page.getByTestId('pag-error')).not.toBeFocused()
  })

  test('should hide error on load', async ({ page }) => {
    await page.evaluate(() => { // Failed request
      const pag = document.querySelector('#pag') as Pagination

      pag.request = (source) => {
        pag.update('error', source)
      }
    })

    await page.getByTestId('pag-2').click()

    const error = page.getByTestId('pag-error')
    const loader = page.getByTestId('pag-loader')

    await expect(error).toBeVisible()

    await page.evaluate(async () => { // Successful request with no items
      const pag = document.querySelector('#pag') as Pagination

      pag.request = async (source) => {
        await new Promise(resolve => { setTimeout(resolve, 0) }) // Delay response so loader displays first
        pag.update('success', source)
      }

      await pag.load('nav')
    })

    await expect(error).not.toBeVisible()
    await expect(loader).not.toHaveAttribute('data-loader')
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const pagProps = await page.evaluate(async () => {
      const pag = document.querySelector('#pag') as Pagination
      const navLink = pag.slots.get('nav')?.querySelector('a') as HTMLAnchorElement

      pag.page = 2
      pag.remove()

      await Promise.resolve()

      navLink.href = '#' // Page differs from current so click would set page to 1
      navLink.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      window.dispatchEvent(new PopStateEvent('popstate')) // Pop would set page to 1

      return {
        init: pag.init,
        page: pag.page,
        slotsSize: pag.slots.size,
        templatesSize: pag.templates.size,
        clonesSize: pag.clones.size,
        params: pag.params,
        scrollRestoration: history.scrollRestoration
      }
    })

    expect(pagProps.init).toBe(false)
    expect(pagProps.page).toBe(2)
    expect(pagProps.slotsSize).toBe(0)
    expect(pagProps.templatesSize).toBe(0)
    expect(pagProps.clonesSize).toBe(0)
    expect(pagProps.params).toStrictEqual({})
    expect(pagProps.scrollRestoration).toBe('auto')
  })
})
