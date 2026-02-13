/**
 * Components - Pagination Test
 */

/* Imports */

import type { Pagination } from '../Pagination.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testPagLoad: string[]
  }
}

/* Tests */

test.describe('Pagination', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testPagLoad = []

      requestAnimationFrame(() => {
        const ids = [
          'pag-empty',
          'pag-partial',
          'pag'
        ]

        ids.forEach(id => {
          const pag = document.getElementById(id)

          if (!pag) {
            return
          }

          pag.addEventListener('pag:load', (e) => {
            window.testPagLoad.push((e.target as HTMLElement).id)
          })
        })
      })
    })

    await page.goto('/spec/components/Pagination/__tests__/Pagination.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)

    await page.addInitScript(() => {
      window.testPagLoad = []
    })
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const pagInit = await page.evaluate(() => {
      const pag = document.querySelector('#pag-empty') as Pagination
      return pag.init
    })

    expect(pagInit).toBe(false)
  })

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
        slots: Array.from(pag.slots).map(([key, value]) => `${key}:${value.tagName.toLowerCase()}`)
      }
    })

    expect(pagProps.init).toBe(true)
    expect(pagProps.url).toBe('http://localhost:3000/spec/components/Pagination/__tests__/Pagination')
    expect(pagProps.page).toBe(1)
    expect(pagProps.templatesSize).toBe(2)
    expect(pagProps.clonesSize).toBe(0)
    expect(pagProps.params).toStrictEqual({})
    expect(pagProps.slots).toStrictEqual([
      'nav:ol',
      'entry:ul'
    ])
  })

  /* Test nav */

  test('should update navigation, entry slots and location on click', async ({ page }) => {
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
})
