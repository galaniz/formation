/**
 * Effects - Visible Test
 */

import type { Visible } from '../Visible.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

declare global {
  interface Window {
    testVisResize: number
  }
}

/* Tests */

test.describe('Visible', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)
    await page.goto('/spec/effects/Visible/__tests__/Visible.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const visInit = await page.evaluate(() => {
      const vis: Visible[] = Array.from(document.querySelectorAll('frm-visible'))
      return vis.map(instance => instance.init)
    })

    expect(visInit).toStrictEqual([
      false, // #vis-empty
      false, // #vis-missing
      true,  // #vis
      true   // #vis-offset
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const visProps = await page.evaluate(async () => {
      const vis = document.querySelector('#vis') as Visible

      vis.parentElement?.insertAdjacentElement('beforeend', vis)

      await Promise.resolve()

      return {
        init: vis.init,
        offset: vis.offset,
        itemsSize: vis.items.size
      }
    })

    expect(visProps.init).toBe(true)
    expect(visProps.offset).toBe(0)
    expect(visProps.itemsSize).toBe(3)
  })

  /* Test items */

  test('should end each item at the following item and the last at the end element', async ({ page }) => {
    const visItems = await page.evaluate(() => {
      const vis = document.querySelector('#vis') as Visible

      return Array.from(vis.items.entries()).map(([id, entry]) => {
        return {
          id,
          hash: entry.link.hash,
          itemId: entry.item.id,
          nextId: entry.next?.id ?? null
        }
      })
    })

    expect(visItems).toStrictEqual([
      {
        id: 'vis-1',
        hash: '#vis-1',
        itemId: 'vis-1',
        nextId: 'vis-2'
      },
      {
        id: 'vis-2',
        hash: '#vis-2',
        itemId: 'vis-2',
        nextId: 'vis-3'
      },
      {
        id: 'vis-3',
        hash: '#vis-3',
        itemId: 'vis-3',
        nextId: 'vis-end'
      }
    ])
  })

  test('should skip links without corresponding items', async ({ page }) => {
    const visProps = await page.evaluate(() => {
      const vis = document.querySelector('#vis-offset') as Visible

      return {
        init: vis.init,
        offset: vis.offset,
        itemIds: Array.from(vis.items.keys()),
        nextIds: Array.from(vis.items.values()).map(entry => entry.next?.id ?? null)
      }
    })

    expect(visProps.init).toBe(true)
    expect(visProps.offset).toBe(100)
    expect(visProps.itemIds).toStrictEqual(['vis-offset-1', 'vis-offset-3'])
    expect(visProps.nextIds).toStrictEqual(['vis-offset-3', null])
  })

  /* Test scroll */

  test('should set current link on scroll', async ({ page }) => {
    const visInstance = await page.evaluateHandle(() => document.querySelector('#vis') as Visible)

    const visIds = await page.evaluate(vis => {
      return Array.from(vis.items.keys())
    }, visInstance)

    const visStart = await page.evaluate(vis => {
      return Array.from(vis.items.values()).map(entry => entry.link.ariaCurrent)
    }, visInstance)

    const visCurrent: Array<Array<string | null>> = []

    for (const id of visIds) {
      await page.evaluate((itemId: string) => {
        const item = document.getElementById(itemId) as HTMLElement
        item.scrollIntoView({ behavior: 'instant' })
      }, id)

      await page.waitForFunction(({ vis, itemId }) => { // Wait for debounced scroll
        return vis.items.get(itemId)?.link.ariaCurrent === 'true'
      }, { vis: visInstance, itemId: id })

      visCurrent.push(
        await page.evaluate(vis => {
          return Array.from(vis.items.values()).map(entry => entry.link.ariaCurrent)
        }, visInstance)
      )
    }

    expect(visStart).toStrictEqual([null, null, null])
    expect(visCurrent).toStrictEqual([
      ['true', null, null],
      [null, 'true', null],
      [null, null, 'true']
    ])
  })

  test('should set current link before item top by offset', async ({ page }) => {
    const visInstance = await page.evaluateHandle(() => document.querySelector('#vis-offset') as Visible)

    await page.evaluate(() => { // Above item top but within offset
      const item = document.getElementById('vis-offset-1') as HTMLElement

      item.scrollIntoView({ behavior: 'instant' })

      window.scrollBy({
        top: -50, // Clear of browser rounding at offset edge
        behavior: 'instant'
      })
    })

    await page.waitForFunction(vis => { // Wait for debounced scroll
      return vis.items.get('vis-offset-1')?.visible === true
    }, visInstance)

    const visOffset = await page.evaluate(vis => {
      const links: HTMLAnchorElement[] = Array.from(vis.querySelectorAll('[data-visible-link]'))
      return links.map(link => link.getAttribute('aria-current'))
    }, visInstance)

    await page.evaluate(() => { // Above item top and beyond offset
      const item = document.getElementById('vis-offset-1') as HTMLElement

      item.scrollIntoView({ behavior: 'instant' })

      window.scrollBy({
        top: -150, // Clear of browser rounding at offset edge
        behavior: 'instant'
      })
    })

    await page.waitForFunction(vis => { // Wait for debounced scroll
      return vis.items.get('vis-offset-1')?.visible === false
    }, visInstance)

    const visBeyondOffset = await page.evaluate(vis => {
      const links: HTMLAnchorElement[] = Array.from(vis.querySelectorAll('[data-visible-link]'))
      return links.map(link => link.getAttribute('aria-current'))
    }, visInstance)

    expect(visOffset).toStrictEqual(['true', null, null])
    expect(visBeyondOffset).toStrictEqual([null, null, null])
  })

  /* Test resize */

  test('should refresh offsets on resize', async ({ page }) => {
    const visInstance = await page.evaluateHandle(() => document.querySelector('#vis') as Visible)

    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      window.testVisResize = 0

      onResize(() => {
        window.testVisResize += 1
      })
    })

    const visBefore = await page.evaluate(vis => {
      return Array.from(vis.items.values()).map(entry => [entry.top, entry.bottom])
    }, visInstance)

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: viewport.width,
      height: Math.round(viewport.height / 2) // Items sized in vh
    })

    await page.waitForFunction(() => { // Wait for debounced resize
      return window.testVisResize
    })

    const visAfter = await page.evaluate(vis => {
      return {
        offsets: Array.from(vis.items.values()).map(entry => [entry.top, entry.bottom]),
        offsetsMatchItemHeights: Array.from(vis.items.values()).map(entry => {
          return entry.bottom - entry.top === entry.item.offsetHeight
        })
      }
    }, visInstance)

    expect(visAfter.offsets).not.toStrictEqual(visBefore)
    expect(visAfter.offsetsMatchItemHeights).toStrictEqual([true, true, true])
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const visProps = await page.evaluate(async () => {
      const { actions, doActions } = await import('../../../actions/actions.js')

      const vis = document.querySelector('#vis') as Visible
      const links: HTMLAnchorElement[] = Array.from(vis.querySelectorAll('[data-visible-link]'))
      const scrollActionsCount = actions.get('scroll')?.size || 1
      const resizeActionsCount = actions.get('resize')?.size || 1

      vis.remove()

      await Promise.resolve()

      const item = document.getElementById('vis-2') as HTMLElement

      item.scrollIntoView({ behavior: 'instant' })
      doActions('scroll')

      return {
        init: vis.init,
        itemsSize: vis.items.size,
        current: links.map(link => link.getAttribute('aria-current')), // Stale as links no longer updated
        actionsRemoved:
          actions.get('scroll')?.size === scrollActionsCount - 1 &&
          actions.get('resize')?.size === resizeActionsCount - 1
      }
    })

    expect(visProps.init).toBe(false)
    expect(visProps.itemsSize).toBe(0)
    expect(visProps.current).toStrictEqual([null, null, null])
    expect(visProps.actionsRemoved).toBe(true)
  })
})
