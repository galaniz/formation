/**
 * Layouts - Overflow Test
 */

import type { Overflow } from '../Overflow.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testOverflowSet: Record<string, number>
    testOverflowScroll: Record<string, number>
  }
}

/* Tests */

test.describe('Overflow', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testOverflowSet = {}
      window.testOverflowScroll = {}

      /* Listen on document so recording does not depend on when the elements init */

      document.addEventListener('overflow:set', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testOverflowSet[id] = (window.testOverflowSet[id] ?? 0) + 1
      }, true)

      document.addEventListener('overflow:scroll', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testOverflowScroll[id] = (window.testOverflowScroll[id] ?? 0) + 1
      }, true)
    })

    await page.goto('/spec/layouts/Overflow/__tests__/Overflow.html')

    await page.waitForFunction(() => { // Wait for init set events
      return Object.keys(window.testOverflowSet).length === 3
    })
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const ovInit = await page.evaluate(() => {
      const ovs: Overflow[] = Array.from(document.querySelectorAll('frm-overflow'))
      return ovs.map(ov => ov.init)
    })

    expect(ovInit).toStrictEqual([
      false, // #ov-empty
      true,  // #ov
      true,  // #ov-vertical
      true   // #ov-resize
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const ovProps = await page.evaluate(async () => {
      const ov = document.querySelector('#ov') as Overflow

      ov.parentElement?.insertAdjacentElement('beforeend', ov)

      await Promise.resolve()

      return {
        init: ov.init,
        direction: ov.direction,
        overflow: ov.overflow,
        trackTag: ov.track?.tagName
      }
    })

    expect(ovProps.init).toBe(true)
    expect(ovProps.direction).toBe('horizontal')
    expect(ovProps.overflow).toBe(true)
    expect(ovProps.trackTag).toBe('UL')
  })

  test('should fall back to horizontal direction if invalid', async ({ page }) => {
    const ovDirection = await page.evaluate(() => {
      const ov = document.querySelector('#ov-resize') as Overflow

      return {
        attribute: ov.getAttribute('direction'),
        direction: ov.direction
      }
    })

    expect(ovDirection.attribute).toBe('diagonal')
    expect(ovDirection.direction).toBe('horizontal')
  })

  /* Test horizontal */

  test('should set horizontal overflow attributes on init', async ({ page }) => {
    const ovProps = await page.evaluate(() => {
      const ov = document.querySelector('#ov') as Overflow

      return {
        overflow: [
          ov.overflow,
          ov.getAttribute('overflow')
        ],
        left: ov.getAttribute('left'),
        right: ov.getAttribute('right'),
        top: ov.getAttribute('top'),
        bottom: ov.getAttribute('bottom')
      }
    })

    expect(ovProps.overflow).toStrictEqual([true, 'true'])
    expect(ovProps.left).toBe('false')
    expect(ovProps.right).toBe('true')
    expect(ovProps.top).toBeNull()
    expect(ovProps.bottom).toBeNull()
  })

  test('should update horizontal attributes on track scroll', async ({ page }) => {
    const ovInstance = await page.evaluateHandle(() => document.querySelector('#ov') as Overflow)

    await page.evaluate(ov => { // Scroll to middle of track
      const track = ov.track as HTMLElement

      track.scrollTo({
        left: Math.round((track.scrollWidth - track.clientWidth) / 2),
        behavior: 'instant'
      })
    }, ovInstance)

    await page.waitForFunction(ov => { // Wait for debounced set
      return ov.getAttribute('left') === 'true'
    }, ovInstance)

    const ovMiddle = await page.evaluate(ov => {
      return {
        left: ov.getAttribute('left'),
        right: ov.getAttribute('right')
      }
    }, ovInstance)

    await page.evaluate(ov => { // Scroll to end of track
      const track = ov.track as HTMLElement

      track.scrollTo({
        left: track.scrollWidth - track.clientWidth,
        behavior: 'instant'
      })
    }, ovInstance)

    await page.waitForFunction(ov => { // Wait for debounced set
      return ov.getAttribute('right') === 'false'
    }, ovInstance)

    const ovEnd = await page.evaluate(ov => {
      return {
        left: ov.getAttribute('left'),
        right: ov.getAttribute('right'),
        scrollCount: window.testOverflowScroll.ov ?? 0
      }
    }, ovInstance)

    expect(ovMiddle.left).toBe('true')
    expect(ovMiddle.right).toBe('true')
    expect(ovEnd.left).toBe('true')
    expect(ovEnd.right).toBe('false')
    expect(ovEnd.scrollCount).toBe(2)
  })

  /* Test vertical */

  test('should set vertical overflow attributes on init', async ({ page }) => {
    const ovProps = await page.evaluate(() => {
      const ov = document.querySelector('#ov-vertical') as Overflow

      return {
        direction: ov.direction,
        overflow: [
          ov.overflow,
          ov.getAttribute('overflow')
        ],
        top: ov.getAttribute('top'),
        bottom: ov.getAttribute('bottom'),
        left: ov.getAttribute('left'),
        right: ov.getAttribute('right')
      }
    })

    expect(ovProps.direction).toBe('vertical')
    expect(ovProps.overflow).toStrictEqual([true, 'true'])
    expect(ovProps.top).toBe('false')
    expect(ovProps.bottom).toBe('true')
    expect(ovProps.left).toBeNull()
    expect(ovProps.right).toBeNull()
  })

  test('should update vertical attributes on track scroll', async ({ page }) => {
    const ovInstance = await page.evaluateHandle(() => document.querySelector('#ov-vertical') as Overflow)

    await page.evaluate(ov => { // Scroll to end of track
      const track = ov.track as HTMLElement

      track.scrollTo({
        top: track.scrollHeight - track.clientHeight,
        behavior: 'instant'
      })
    }, ovInstance)

    await page.waitForFunction(ov => { // Wait for debounced set
      return ov.getAttribute('bottom') === 'false'
    }, ovInstance)

    const ovEnd = await page.evaluate(ov => {
      return {
        top: ov.getAttribute('top'),
        bottom: ov.getAttribute('bottom'),
        scrollCount: window.testOverflowScroll['ov-vertical'] ?? 0
      }
    }, ovInstance)

    expect(ovEnd.top).toBe('true')
    expect(ovEnd.bottom).toBe('false')
    expect(ovEnd.scrollCount).toBe(1)
  })

  /* Test resize */

  test('should update overflow state on resize', async ({ page }) => {
    const ovInstance = await page.evaluateHandle(() => document.querySelector('#ov-resize') as Overflow)
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 1000,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize set
      return (window.testOverflowSet['ov-resize'] ?? 0) >= 2
    })

    const ovWide = await page.evaluate(ov => {
      return {
        overflow: [
          ov.overflow,
          ov.getAttribute('overflow')
        ],
        left: ov.getAttribute('left'),
        right: ov.getAttribute('right')
      }
    }, ovInstance)

    await page.setViewportSize({
      width: 360,
      height: viewport.height
    })

    await page.waitForFunction(ov => { // Wait for resize set
      return ov.overflow
    }, ovInstance)

    const ovNarrow = await page.evaluate(ov => {
      return {
        overflow: [
          ov.overflow,
          ov.getAttribute('overflow')
        ],
        left: ov.getAttribute('left'),
        right: ov.getAttribute('right')
      }
    }, ovInstance)

    expect(ovWide.overflow).toStrictEqual([false, 'false'])
    expect(ovWide.left).toBe('false')
    expect(ovWide.right).toBe('false')
    expect(ovNarrow.overflow).toStrictEqual([true, 'true'])
    expect(ovNarrow.left).toBe('false')
    expect(ovNarrow.right).toBe('true')
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const ovProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const ov = document.querySelector('#ov') as Overflow
      const track = ov.track as HTMLElement
      const resizeActionsCount = actions.get('resize')?.size || 1
      const scrollCount = window.testOverflowScroll.ov ?? 0

      ov.remove()

      await Promise.resolve()

      track.dispatchEvent(new Event('scroll'))

      return {
        init: ov.init,
        overflow: ov.overflow,
        track: ov.track,
        scrolled: (window.testOverflowScroll.ov ?? 0) > scrollCount,
        actionsRemoved: actions.get('resize')?.size === resizeActionsCount - 1
      }
    })

    expect(ovProps.init).toBe(false)
    expect(ovProps.overflow).toBe(false)
    expect(ovProps.track).toBeNull()
    expect(ovProps.scrolled).toBe(false)
    expect(ovProps.actionsRemoved).toBe(true)
  })
})
