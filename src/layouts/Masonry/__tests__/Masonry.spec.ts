/**
 * Layouts - Masonry Test
 */

import type { Masonry } from '../Masonry.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testMasonrySet: Record<string, number>
    testMasonryLoad: Record<string, number>
    testMasonryResize: number
  }
}

/* Tests */

test.describe('Masonry', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testMasonrySet = {}
      window.testMasonryLoad = {}
      window.testMasonryResize = 0

      const maxLoads = 2
      const heights = [130, 190, 100]

      let loads = 0

      /* Listen on document so recording does not depend on when the elements init */

      document.addEventListener('masonry:set', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testMasonrySet[id] = (window.testMasonrySet[id] || 0) + 1
      }, true)

      document.addEventListener('masonry:load', (e: Event) => {
        const masonry = e.target as Masonry

        window.testMasonryLoad[masonry.id] = (window.testMasonryLoad[masonry.id] || 0) + 1

        if (masonry.id !== 'msn-loads') {
          return
        }

        if (loads >= maxLoads) {
          masonry.endItems()
          return
        }

        /* Timeout to mimic fetching items */

        setTimeout(() => {
          const template = document.getElementById('msn-item') as HTMLTemplateElement
          const newItems = document.createDocumentFragment()

          heights.forEach(height => {
            const item = template.content.firstElementChild?.cloneNode(true) as HTMLElement

            item.style.height = `${height}px`

            newItems.append(item)
          })

          loads += 1

          masonry.appendItems(newItems)
        }, 0)
      }, true)
    })

    await page.goto('/spec/layouts/Masonry/__tests__/Masonry.html')

    await page.waitForFunction(() => { // Wait for init set events
      return Object.keys(window.testMasonrySet).length === 3
    })
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const msnInit = await page.evaluate(() => {
      const masonry: Masonry[] = Array.from(document.querySelectorAll('frm-masonry'))
      return masonry.map(msn => msn.init)
    })

    expect(msnInit).toStrictEqual([
      false, // #msn-empty
      false, // No element ID
      false, // #msn-no-list
      false, // #msn-no-bk
      false, // #msn-invalid-bk
      true,  // #msn-partial-bk
      true,  // #msn
      true   // #msn-loads
    ])
  })

  test('should skip breakpoints without matching columns or margins', async ({ page }) => {
    const msnBreakpoints = await page.evaluate(() => {
      const msn = document.querySelector('#msn-partial-bk') as Masonry
      return Array.from(msn.breakpoints)
    })

    expect(msnBreakpoints).toStrictEqual([
      {
        low: 0,
        high: 600,
        columns: 2,
        margin: 16
      },
      {
        low: 600,
        high: 900,
        columns: 3,
        margin: 16
      }
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const msnProps = await page.evaluate(async () => {
      const msn = document.querySelector('#msn') as Masonry

      msn.parentElement?.insertAdjacentElement('beforeend', msn)

      await Promise.resolve()

      return {
        init: msn.init,
        items: msn.items.length,
        breakpoints: msn.breakpoints.size,
        setCount: window.testMasonrySet.msn
      }
    })

    expect(msnProps.init).toBe(true)
    expect(msnProps.items).toBe(9)
    expect(msnProps.breakpoints).toBe(2)
    expect(msnProps.setCount).toBe(1)
  })

  /* Test layout */

  test('should stack each item below the item above it in its column', async ({ page }) => {
    const msnLayout = await page.evaluate(() => {
      const msn = document.querySelector('#msn') as Masonry
      const rects = msn.items.map(item => item.getBoundingClientRect())
      const columns = new Set(rects.map(rect => Math.round(rect.left))).size

      return {
        columns,
        gaps: rects.slice(columns).map((rect, i) => {
          const peer = rects[i] as DOMRect // Item one row up in the same column
          return Math.round(rect.top - peer.bottom)
        })
      }
    })

    expect(msnLayout.columns).toBeGreaterThanOrEqual(2)
    expect(new Set(msnLayout.gaps)).toStrictEqual(new Set([16]))
  })

  test('should relayout on resize', async ({ page }) => {
    const msnInstance = await page.evaluateHandle(() => document.querySelector('#msn') as Masonry)
    const viewport = page.viewportSize() as { width: number, height: number }
    const msnSetCount = await page.evaluate(() => window.testMasonrySet.msn || 0)

    await page.setViewportSize({
      width: 400,
      height: viewport.height
    })

    await page.waitForFunction(count => { // Wait for debounced resize set
      return (window.testMasonrySet.msn || 0) > count
    }, msnSetCount)

    const msnNarrow = await page.evaluate(msn => {
      const rects = msn.items.map(item => item.getBoundingClientRect())
      const columns = new Set(rects.map(rect => Math.round(rect.left))).size

      return {
        columns,
        gaps: rects.slice(columns).map((rect, i) => {
          const peer = rects[i] as DOMRect // Item one row up in the same column
          return Math.round(rect.top - peer.bottom)
        })
      }
    }, msnInstance)

    expect(msnNarrow.columns).toBe(2)
    expect(msnNarrow.gaps.length).toBe(7)
    expect(new Set(msnNarrow.gaps)).toStrictEqual(new Set([16]))
  })

  test('should not relayout if viewport height change', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testMasonryResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }
    const width = viewport.width - 1 // Must differ to fire resize

    // Initial inner width unstable on mobile emulator - resize width first so only height changes below
    await page.setViewportSize({
      width,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testMasonryResize
    })

    const msnBefore = await page.evaluate(() => {
      return {
        set: window.testMasonrySet.msn || 0,
        resize: window.testMasonryResize
      }
    })

    await page.setViewportSize({ // Height only resize
      width,
      height: viewport.height - 100
    })

    await page.waitForFunction((resize: number) => { // Wait for resize
      return window.testMasonryResize > resize
    }, msnBefore.resize)

    const msnHeight = await page.evaluate(() => window.testMasonrySet.msn || 0)

    expect(msnHeight).toBe(msnBefore.set) // No set on height change
  })

  /* Test append */

  test('should append items and keep the layout', async ({ page }) => {
    const msnAppend = await page.evaluate(() => {
      const msn = document.querySelector('#msn') as Masonry
      const template = document.getElementById('msn-item') as HTMLTemplateElement
      const item = template.content.firstElementChild?.cloneNode(true) as HTMLElement

      item.id = 'msn-9'
      item.style.height = '150px'

      const appended = msn.appendItems(item.outerHTML)
      const rects = msn.items.map(msnItem => msnItem.getBoundingClientRect())
      const columns = new Set(rects.map(rect => Math.round(rect.left))).size

      return {
        appended,
        items: msn.items.length,
        setCount: window.testMasonrySet.msn || 0,
        gaps: rects.slice(columns).map((rect, i) => {
          const peer = rects[i] as DOMRect // Item one row up in the same column
          return Math.round(rect.top - peer.bottom)
        })
      }
    })

    expect(msnAppend.appended).toBe(true)
    expect(msnAppend.items).toBe(10)
    expect(msnAppend.setCount).toBe(2)
    expect(new Set(msnAppend.gaps)).toStrictEqual(new Set([16]))
  })

  test('should not append markup without items', async ({ page }) => {
    const msnAppend = await page.evaluate(() => {
      const msn = document.querySelector('#msn') as Masonry

      msn.loading = true

      return {
        appended: msn.appendItems('<li id="msn-9"></li>'), // No data-masonry-item
        loading: msn.loading,
        items: msn.items.length
      }
    })

    expect(msnAppend.appended).toBe(false)
    expect(msnAppend.loading).toBe(false)
    expect(msnAppend.items).toBe(9)
  })

  test('should not append or end items if not initialized', async ({ page }) => {
    const msnEmpty = await page.evaluate(() => {
      const msn = document.querySelector('#msn-empty') as Masonry

      return {
        appended: msn.appendItems('<li id="msn-empty-0" data-masonry-item></li>'),
        ended: msn.endItems()
      }
    })

    expect(msnEmpty.appended).toBe(false)
    expect(msnEmpty.ended).toBe(false)
  })

  /* Test loads */

  test('should load more items when loads element scrolled into view', async ({ page }) => {
    const msnInstance = await page.evaluateHandle(() => document.querySelector('#msn-loads') as Masonry)

    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight) })
    await page.waitForFunction(msn => msn.items.length === 9, msnInstance)

    const msnFirstLoad = await page.evaluate(msn => {
      return {
        items: msn.items.length,
        loading: msn.loading,
        done: msn.done
      }
    }, msnInstance)

    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight) })
    await page.waitForFunction(msn => msn.items.length === 12, msnInstance)
    await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight) })
    await page.waitForFunction(msn => msn.done, msnInstance)

    const msnEnd = await page.evaluate(msn => {
      const rects = msn.items.map(item => item.getBoundingClientRect())
      const columns = new Set(rects.map(rect => Math.round(rect.left))).size

      return {
        items: msn.items.length,
        loading: msn.loading,
        done: msn.done,
        loadCount: window.testMasonryLoad['msn-loads'] || 0,
        gaps: rects.slice(columns).map((rect, i) => {
          const peer = rects[i] as DOMRect // Item one row up in the same column
          return Math.round(rect.top - peer.bottom)
        })
      }
    }, msnInstance)

    expect(msnFirstLoad.items).toBe(9)
    expect(msnFirstLoad.loading).toBe(false)
    expect(msnFirstLoad.done).toBe(false)
    expect(msnEnd.items).toBe(12)
    expect(msnEnd.loading).toBe(false)
    expect(msnEnd.done).toBe(true)
    expect(msnEnd.loadCount).toBe(3)
    expect(new Set(msnEnd.gaps)).toStrictEqual(new Set([16]))
  })

  /* Test clean up */

  test('should remove instance, styles and event listeners', async ({ page }) => {
    const msnProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const msn = document.querySelector('#msn-loads') as Masonry // Loads element to disconnect observer
      const resizeActionsCount = actions.get('resize')?.size || 1

      msn.remove()

      await Promise.resolve()

      return {
        init: msn.init,
        list: msn.list,
        items: msn.items.length,
        breakpoints: msn.breakpoints.size,
        loads: msn.loads,
        loading: msn.loading,
        done: msn.done,
        styles: document.getElementById('msn-msn-loads-styles'),
        actionsRemoved: actions.get('resize')?.size === resizeActionsCount - 1
      }
    })

    expect(msnProps.init).toBe(false)
    expect(msnProps.list).toBeNull()
    expect(msnProps.items).toBe(0)
    expect(msnProps.breakpoints).toBe(0)
    expect(msnProps.loads).toBeNull()
    expect(msnProps.loading).toBe(false)
    expect(msnProps.done).toBe(false)
    expect(msnProps.styles).toBeNull()
    expect(msnProps.actionsRemoved).toBe(true)
  })
})
