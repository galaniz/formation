/**
 * Components - Pagination Filter Test
 */

import type { PaginationFilter } from '../PaginationFilter.js'
import type { PaginationEventDetail } from '../PaginationTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testPagFilterLoad: string[]
  }
}

/* Url of test page */

const pagFilterUrl = 'http://localhost:3000/spec/components/Pagination/__tests__/PaginationFilter'

/* Tests */

test.describe('PaginationFilter', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testPagFilterLoad = []

      /* Listen on document so recording does not depend on when the elements init */

      document.addEventListener('pag:load', (e: Event) => {
        const { id } = e.target as HTMLElement
        const { source } = (e as CustomEvent<PaginationEventDetail>).detail

        window.testPagFilterLoad.push(`${id}:${source}`)
      }, true)
    })

    await page.goto('/spec/components/Pagination/__tests__/PaginationFilter.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const pagInit = await page.evaluate(() => {
      const pags: PaginationFilter[] = Array.from(document.querySelectorAll('frm-pagination-filter'))
      return pags.map(pag => [pag.init, pag.subInit])
    })

    expect(pagInit).toStrictEqual([ // Init and sub init
      [true, false], // #pag-filter-partial
      [true, true],  // #pag-filter
      [true, true]   // #pag-filter-change
    ])
  })

  test('should set groups and load onset from inputs', async ({ page }) => {
    const pagProps = await page.evaluate(() => {
      const pag = document.querySelector('#pag-filter') as PaginationFilter
      const pagChange = document.querySelector('#pag-filter-change') as PaginationFilter

      return {
        loadOn: pag.loadOn,
        changeLoadOn: pagChange.loadOn,
        form: pag.form?.tagName,
        groups: Array.from(pag.groups).map(([key, value]) => `${key}:${value.type}:${value.inputs.length}`)
      }
    })

    expect(pagProps.loadOn).toBe('submit')
    expect(pagProps.changeLoadOn).toBe('change')
    expect(pagProps.form).toBe('FORM')
    expect(pagProps.groups).toStrictEqual([
      'q:text:1',
      'sort:select:1',
      'cat:checkbox:3',
      'year:radio:3'
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const pagProps = await page.evaluate(async () => {
      const pag = document.querySelector('#pag-filter') as PaginationFilter

      pag.parentElement?.insertAdjacentElement('afterbegin', pag)

      await Promise.resolve()

      return {
        init: pag.init,
        subInit: pag.subInit,
        loadOn: pag.loadOn,
        form: pag.form?.tagName,
        groups: Array.from(pag.groups).map(([key, value]) => `${key}:${value.type}:${value.inputs.length}`)
      }
    })

    expect(pagProps.init).toBe(true)
    expect(pagProps.subInit).toBe(true)
    expect(pagProps.loadOn).toBe('submit')
    expect(pagProps.form).toBe('FORM')
    expect(pagProps.groups).toStrictEqual([ // Inputs not added again
      'q:text:1',
      'sort:select:1',
      'cat:checkbox:3',
      'year:radio:3'
    ])
  })

  /* Test submit */

  test('should update params, page and location on submit', async ({ page }) => {
    const pagInstance = await page.evaluateHandle(() => document.querySelector('#pag-filter') as PaginationFilter)

    await page.evaluate(pag => {
      pag.page = 3 // Reset to first page on submit

      pag.request = (source) => {
        pag.update('success', source)
      }
    }, pagInstance)

    await page.getByTestId('pag-filter-search').fill('hello')
    await page.getByTestId('pag-filter-sort').selectOption('desc')
    await page.getByTestId('pag-filter-cat-1-label').click()
    await page.getByTestId('pag-filter-cat-3-label').click()
    await page.getByTestId('pag-filter-2024-label').click()
    await page.getByTestId('pag-filter-submit').click()

    await expect(page).toHaveURL(`${pagFilterUrl}?q=hello&sort=desc&cat=cat-1%2Ccat-3&year=2024`)

    const pagProps = await page.evaluate(pag => {
      return {
        page: pag.page,
        params: pag.params,
        groups: Array.from(pag.groups).map(([key, value]) => `${key}:${value.values.join('|')}`),
        load: window.testPagFilterLoad
      }
    }, pagInstance)

    expect(pagProps.page).toBe(1)
    expect(pagProps.params).toStrictEqual({
      q: 'hello',
      sort: 'desc',
      cat: 'cat-1,cat-3',
      year: '2024'
    })
    expect(pagProps.groups).toStrictEqual([
      'q:hello',
      'sort:desc',
      'cat:cat-1|cat-3',
      'year:2024'
    ])
    expect(pagProps.load).toStrictEqual(['pag-filter:form'])
  })

  test('should load on submit if any group values change', async ({ page }) => {
    const pagInstance = await page.evaluateHandle(() => document.querySelector('#pag-filter') as PaginationFilter)

    await page.evaluate(pag => {
      pag.request = (source) => {
        pag.update('success', source)
      }
    }, pagInstance)

    await page.getByTestId('pag-filter-search').fill('hello') // First group - later groups unchanged
    await page.getByTestId('pag-filter-submit').click()

    await expect(page).toHaveURL(`${pagFilterUrl}?q=hello`)

    const pagProps = await page.evaluate(pag => {
      return {
        params: Object.fromEntries(Object.entries(pag.params).filter(([, value]) => value !== undefined)),
        load: window.testPagFilterLoad
      }
    }, pagInstance)

    expect(pagProps.params).toStrictEqual({ q: 'hello' })
    expect(pagProps.load).toStrictEqual(['pag-filter:form'])
  })

  test('should not load on submit if values unchanged', async ({ page }) => {
    await page.getByTestId('pag-filter-submit').click()
    await page.getByTestId('pag-filter-submit').click()

    const pagProps = await page.evaluate(() => {
      const pag = document.querySelector('#pag-filter') as PaginationFilter

      return {
        paramKeys: Object.keys(pag.params), // Empty values undefined
        paramValues: Object.values(pag.params).filter(value => value !== undefined),
        load: window.testPagFilterLoad
      }
    })

    await expect(page).toHaveURL(pagFilterUrl) // No history update

    expect(pagProps.paramKeys).toStrictEqual([
      'q',
      'sort',
      'cat',
      'year'
    ])
    expect(pagProps.paramValues).toStrictEqual([])
    expect(pagProps.load).toStrictEqual([])
  })

  /* Test reset */

  test('should clear params, page and location on reset', async ({ page }) => {
    const pagInstance = await page.evaluateHandle(() => document.querySelector('#pag-filter') as PaginationFilter)

    await page.evaluate(pag => {
      pag.request = (source) => {
        pag.update('success', source)
      }
    }, pagInstance)

    await page.getByTestId('pag-filter-cat-2-label').click()
    await page.getByTestId('pag-filter-2025-label').click()
    await page.getByTestId('pag-filter-submit').click()

    await expect(page).toHaveURL(`${pagFilterUrl}?cat=cat-2&year=2025`)

    await page.getByTestId('pag-filter-reset').click()

    await expect(page).toHaveURL(pagFilterUrl)

    const pagProps = await page.evaluate(pag => {
      return {
        page: pag.page,
        params: pag.params,
        load: window.testPagFilterLoad
      }
    }, pagInstance)

    expect(pagProps.page).toBe(1)
    expect(pagProps.params).toStrictEqual({})
    expect(pagProps.load).toStrictEqual([
      'pag-filter:form',
      'pag-filter:form'
    ])
  })

  /* Test change */

  test('should update params and page on change if load onset is change', async ({ page }) => {
    const pagInstance = await page.evaluateHandle(() => document.querySelector('#pag-filter-change') as PaginationFilter)

    await page.evaluate(pag => {
      pag.page = 2 // Reset to first page on change

      pag.request = (source) => {
        pag.update('success', source)
      }
    }, pagInstance)

    await page.getByTestId('pag-filter-change-sort').selectOption('title')
    await page.getByTestId('pag-filter-change-cat-2-label').click()

    await expect(page).toHaveURL(`${pagFilterUrl}?sort=title&cat=cat-2`)

    const pagProps = await page.evaluate(pag => {
      return {
        page: pag.page,
        params: pag.params,
        load: window.testPagFilterLoad
      }
    }, pagInstance)

    expect(pagProps.page).toBe(1)
    expect(pagProps.params).toStrictEqual({
      sort: 'title',
      cat: 'cat-2'
    })
    expect(pagProps.load).toStrictEqual([
      'pag-filter-change:form',
      'pag-filter-change:form'
    ])
  })

  test('should not load on change if input group missing', async ({ page }) => {
    const pagProps = await page.evaluate(async () => {
      const pag = document.querySelector('#pag-filter-change') as PaginationFilter
      const input = pag.querySelector('#pag-filter-change-search') as HTMLInputElement

      pag.groups.clear()

      input.value = 'hello'
      input.dispatchEvent(new Event('change', { bubbles: true }))

      await Promise.resolve()

      return {
        params: pag.params,
        load: window.testPagFilterLoad
      }
    })

    expect(pagProps.params).toStrictEqual({})
    expect(pagProps.load).toStrictEqual([])
  })

  /* Test history */

  test('should restore input values on history navigation', async ({ page }) => {
    const pagInstance = await page.evaluateHandle(() => document.querySelector('#pag-filter') as PaginationFilter)

    await page.evaluate(pag => {
      pag.request = (source) => {
        pag.update('success', source)
      }
    }, pagInstance)

    const search = page.getByTestId('pag-filter-search')
    const sort = page.getByTestId('pag-filter-sort')
    const cat = page.getByTestId('pag-filter-cat-2')
    const year = page.getByTestId('pag-filter-2023')

    await search.fill('hello')
    await sort.selectOption('popular')
    await page.getByTestId('pag-filter-cat-2-label').click()
    await page.getByTestId('pag-filter-2023-label').click()
    await page.getByTestId('pag-filter-submit').click()

    await expect(page).toHaveURL(`${pagFilterUrl}?q=hello&sort=popular&cat=cat-2&year=2023`)

    await page.goBack()
    await page.waitForFunction(() => { // Wait for pop load
      return window.testPagFilterLoad.includes('pag-filter:pop')
    })

    await expect(search).toHaveValue('') // No state so inputs cleared from location
    await expect(sort).toHaveValue('')
    await expect(cat).not.toBeChecked()
    await expect(year).not.toBeChecked()

    const pagBackParams = await page.evaluate(pag => {
      return pag.params
    }, pagInstance)

    await page.goForward()
    await page.waitForFunction(() => { // Wait for second pop load
      return window.testPagFilterLoad.filter(load => load === 'pag-filter:pop').length === 2
    })

    await expect(search).toHaveValue('hello') // Inputs restored from state params
    await expect(sort).toHaveValue('popular')
    await expect(cat).toBeChecked()
    await expect(year).toBeChecked()

    const pagForwardParams = await page.evaluate(pag => {
      return pag.params
    }, pagInstance)

    expect(pagBackParams).toStrictEqual({})
    expect(pagForwardParams).toStrictEqual({
      q: 'hello',
      sort: 'popular',
      cat: 'cat-2',
      year: '2023'
    })
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const pagProps = await page.evaluate(async () => {
      const pag = document.querySelector('#pag-filter') as PaginationFilter
      const pagChange = document.querySelector('#pag-filter-change') as PaginationFilter
      const form = pag.form
      const changeForm = pagChange.form
      const changeInput = pagChange.querySelector('#pag-filter-change-sort') as HTMLSelectElement

      pag.page = 2
      pagChange.page = 2

      pag.remove()
      pagChange.remove()

      await new Promise(resolve => { setTimeout(resolve, 0) }) // Disconnect awaits parent and own tick

      form?.dispatchEvent(new Event('submit', { cancelable: true }))
      form?.dispatchEvent(new Event('reset')) // Reset would set page to 1
      changeForm?.dispatchEvent(new Event('reset'))
      changeInput.value = 'desc'
      changeInput.dispatchEvent(new Event('change', { bubbles: true }))

      return {
        init: pag.init,
        subInit: pag.subInit,
        page: pag.page,
        form: pag.form,
        groupsSize: pag.groups.size,
        changeSubInit: pagChange.subInit,
        changePage: pagChange.page,
        changeGroupsSize: pagChange.groups.size
      }
    })

    expect(pagProps.init).toBe(false)
    expect(pagProps.subInit).toBe(false)
    expect(pagProps.page).toBe(2)
    expect(pagProps.form).toBe(null)
    expect(pagProps.groupsSize).toBe(0)
    expect(pagProps.changeSubInit).toBe(false)
    expect(pagProps.changePage).toBe(2)
    expect(pagProps.changeGroupsSize).toBe(0)
  })
})
