/**
 * Objects - Slider Group Test
 */

import type { SliderGroup } from '../SliderGroup.js'
import type { SliderScrolledEventDetail } from '../SliderTypes.js'
import type { TabsEventDetail } from '../../Tabs/TabsTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

type SliderDetailKey = 'testSliderGroupActivate' | 'testSliderGroupActivated'

interface SliderDetail {
  source: string
  currentIndex: number
  panelIndex: number
  endIndex: number
  count: number
}

declare global {
  interface Window {
    testSliderGroupActivate: Record<string, SliderDetail>
    testSliderGroupActivated: Record<string, SliderDetail>
    testSliderGroupScrolled: Record<string, SliderScrolledEventDetail>
    testSliderGroupResize: number
  }
}

/* Tests */

test.describe('SliderGroup', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testSliderGroupActivate = {}
      window.testSliderGroupActivated = {}
      window.testSliderGroupScrolled = {}
      window.testSliderGroupResize = 0

      /* Listen on document so recording does not depend on when the elements init */

      const listen = (type: string, store: SliderDetailKey): void => {
        document.addEventListener(type, (e: Event) => {
          const { id } = e.target as HTMLElement
          const {
            source,
            currentIndex,
            panelIndex,
            endIndex
          } = (e as CustomEvent<TabsEventDetail>).detail

          window[store][id] = {
            source,
            currentIndex,
            panelIndex,
            endIndex,
            count: (window[store][id]?.count ?? 0) + 1
          }
        }, true)
      }

      listen('tabs:activate', 'testSliderGroupActivate')
      listen('tabs:activated', 'testSliderGroupActivated')

      document.addEventListener('slider:scrolled', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testSliderGroupScrolled[id] = (e as CustomEvent<SliderScrolledEventDetail>).detail
      }, true)
    })

    await page.goto('/spec/objects/Slider/__tests__/SliderGroup.html')

    await page.waitForFunction(() => { // Wait for init activated events
      return Object.keys(window.testSliderGroupActivated).length === 3
    })
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const sliders: SliderGroup[] = Array.from(document.querySelectorAll('frm-slider-group'))
      return sliders.map(slider => [slider.init, slider.subInit])
    })

    expect(sliderInit).toStrictEqual([ // Init and sub init
      [false, false], // #sld-group-empty
      [true, true],   // #sld-group
      [true, false],  // #sld-group-missing-visible
      [true, true],   // #sld-group-invalid-breakpoints
      [true, true]    // #sld-group-out-of-range
    ])
  })

  test('should not group or listen for resize if init fails', async ({ page }) => {
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated on the initialized slider
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const sliderMissing = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group-missing-visible') as SliderGroup

      return {
        activateCount: window.testSliderGroupActivate['sld-group-missing-visible']?.count ?? 0,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        panelDisplay: slider.panels.map(panel => panel.style.display),
        tabDisplay: slider.tabs.map(tab => tab.style.display)
      }
    })

    expect(sliderMissing.activateCount).toBe(0)
    expect(sliderMissing.itemIds).toStrictEqual([ // Items left in the panels they were authored in
      ['sld-group-missing-visible-item-1'],
      ['sld-group-missing-visible-item-2']
    ])
    expect(sliderMissing.panelDisplay).toStrictEqual(['', ''])
    expect(sliderMissing.tabDisplay).toStrictEqual(['', ''])
  })

  test('should skip invalid breakpoint and visible values on init', async ({ page }) => {
    const sliderInvalid = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group-invalid-breakpoints') as SliderGroup

      return {
        subInit: slider.subInit,
        breakpoints: slider.getAttribute('breakpoints'),
        visible: slider.getAttribute('visible'),
        parsed: Array.from(slider.breakpoints)
      }
    })

    expect(sliderInvalid.subInit).toBe(true)
    expect(sliderInvalid.breakpoints).toBe('1200,x,y,600,0')
    expect(sliderInvalid.visible).toBe('4,,2,0,3')
    // Skipped in order - unparsable next value, no visible value, unparsable low, less than one item
    expect(sliderInvalid.parsed).toStrictEqual([
      { low: 0, high: 99999, items: 3, panels: 2 }
    ])
  })

  test('should skip panels without a matching item when grouping', async ({ page }) => {
    const sliderInvalid = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group-invalid-breakpoints') as SliderGroup

      return {
        endIndex: window.testSliderGroupActivated['sld-group-invalid-breakpoints']?.endIndex,
        panelCount: slider.panels.length,
        itemCount: slider.items.length, // Fourth panel has no item
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        panelDisplay: slider.panels.map(panel => panel.style.display)
      }
    })

    expect(sliderInvalid.endIndex).toBe(1)
    expect(sliderInvalid.panelCount).toBe(4)
    expect(sliderInvalid.itemCount).toBe(3)
    expect(sliderInvalid.itemIds).toStrictEqual([
      [
        'sld-group-invalid-breakpoints-item-1',
        'sld-group-invalid-breakpoints-item-2',
        'sld-group-invalid-breakpoints-item-3'
      ],
      [], // Empty as four panels but only three items
      [],
      []
    ])
    expect(sliderInvalid.panelDisplay).toStrictEqual(['', '', 'none', 'none'])
  })

  test('should set props and elements on init', async ({ page }) => {
    const sliderProps = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        subInit: slider.subInit,
        duration: slider.duration,
        delay: slider.delay, // Duration plus buffer
        currentIndex: slider.currentIndex,
        trackId: slider.track?.id,
        prevId: slider.prev?.id,
        nextId: slider.next?.id,
        tabCount: slider.tabs.length,
        panelCount: slider.panels.length,
        itemCount: slider.items.length,
        breakpoints: Array.from(slider.breakpoints)
      }
    })

    expect(sliderProps.subInit).toBe(true)
    expect(sliderProps.duration).toBe(500)
    expect(sliderProps.delay).toBe(600)
    expect(sliderProps.currentIndex).toBe(0)
    expect(sliderProps.trackId).toBe('sld-group-track')
    expect(sliderProps.prevId).toBe('sld-group-prev')
    expect(sliderProps.nextId).toBe('sld-group-next')
    expect(sliderProps.tabCount).toBe(7)
    expect(sliderProps.panelCount).toBe(7)
    expect(sliderProps.itemCount).toBe(7)
    expect(sliderProps.breakpoints).toStrictEqual([ // Panels are the seven items divided by visible
      { low: 0, high: 600, items: 1, panels: 7 },
      { low: 600, high: 900, items: 2, panels: 4 },
      { low: 900, high: 1200, items: 3, panels: 3 },
      { low: 1200, high: 99999, items: 4, panels: 2 }
    ])
  })

  test('should group items in order and hide empty panels and tabs on init', async ({ page }) => {
    const sliderGroups = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.flatMap(panel => { // Groups depend on viewport width - order does not
          return Array.from(panel.children).map(item => item.id)
        }),
        groupCount: slider.panels.filter(panel => panel.style.display !== 'none').length,
        emptyCount: slider.panels.filter(panel => panel.children.length === 0).length,
        panelDisplay: slider.panels.map(panel => panel.style.display),
        tabDisplay: slider.tabs.map(tab => tab.style.display)
      }
    })

    expect(sliderGroups.itemIds).toStrictEqual([
      'sld-group-item-1',
      'sld-group-item-2',
      'sld-group-item-3',
      'sld-group-item-4',
      'sld-group-item-5',
      'sld-group-item-6',
      'sld-group-item-7'
    ])
    expect(sliderGroups.groupCount).toBe((sliderGroups.endIndex ?? 0) + 1)
    expect(sliderGroups.emptyCount).toBe(7 - sliderGroups.groupCount)
    expect(sliderGroups.panelDisplay).toStrictEqual(sliderGroups.tabDisplay)
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const sliderProps = await page.evaluate(async () => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      slider.parentElement?.insertAdjacentElement('beforeend', slider)

      await Promise.resolve()

      return {
        init: slider.init,
        subInit: slider.subInit,
        currentIndex: slider.currentIndex,
        trackId: slider.track?.id,
        breakpointCount: slider.breakpoints.size, // Breakpoints not added again
        activateCount: window.testSliderGroupActivate['sld-group']?.count
      }
    })

    expect(sliderProps.init).toBe(true)
    expect(sliderProps.subInit).toBe(true)
    expect(sliderProps.currentIndex).toBe(0)
    expect(sliderProps.trackId).toBe('sld-group-track')
    expect(sliderProps.breakpointCount).toBe(4)
    expect(sliderProps.activateCount).toBe(1)
  })

  test('should start at last group if selected tab is out of range', async ({ page }) => {
    // Two items per panel at every breakpoint leaves two groups with the third tab selected
    const sliderOutOfRange = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group-out-of-range') as SliderGroup

      return {
        subInit: slider.subInit,
        currentIndex: slider.currentIndex,
        panelIndex: window.testSliderGroupActivated['sld-group-out-of-range']?.panelIndex,
        endIndex: window.testSliderGroupActivated['sld-group-out-of-range']?.endIndex,
        scrolledSource: window.testSliderGroupScrolled['sld-group-out-of-range']?.source,
        scrolledPanelIndex: window.testSliderGroupScrolled['sld-group-out-of-range']?.panelIndex,
        scrollLeft: slider.track?.scrollLeft ?? 0,
        selected: slider.tabs.map(tab => tab.ariaSelected)
      }
    })

    expect(sliderOutOfRange.subInit).toBe(true)
    expect(sliderOutOfRange.currentIndex).toBe(1)
    expect(sliderOutOfRange.panelIndex).toBe(1) // Capped before activating so the track can scroll
    expect(sliderOutOfRange.endIndex).toBe(1)
    expect(sliderOutOfRange.scrolledSource).toBe('init')
    expect(sliderOutOfRange.scrolledPanelIndex).toBe(1)
    expect(sliderOutOfRange.scrollLeft).toBeGreaterThan(0) // Moved off the first group
    expect(sliderOutOfRange.selected).toStrictEqual([null, 'true', 'false'])
  })

  /* Test breakpoints */

  test('should group one item per panel below the second breakpoint', async ({ page }) => {
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 400,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const sliderGroups = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        panelDisplay: slider.panels.map(panel => panel.style.display),
        tabDisplay: slider.tabs.map(tab => tab.style.display)
      }
    })

    expect(sliderGroups.endIndex).toBe(6)
    expect(sliderGroups.itemIds).toStrictEqual([
      ['sld-group-item-1'],
      ['sld-group-item-2'],
      ['sld-group-item-3'],
      ['sld-group-item-4'],
      ['sld-group-item-5'],
      ['sld-group-item-6'],
      ['sld-group-item-7']
    ])
    expect(sliderGroups.panelDisplay).toStrictEqual(['', '', '', '', '', '', ''])
    expect(sliderGroups.tabDisplay).toStrictEqual(['', '', '', '', '', '', ''])
  })

  test('should group two items per panel at the second breakpoint', async ({ page }) => {
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const sliderGroups = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        panelDisplay: slider.panels.map(panel => panel.style.display),
        tabDisplay: slider.tabs.map(tab => tab.style.display)
      }
    })

    expect(sliderGroups.endIndex).toBe(3)
    expect(sliderGroups.itemIds).toStrictEqual([
      ['sld-group-item-1', 'sld-group-item-2'],
      ['sld-group-item-3', 'sld-group-item-4'],
      ['sld-group-item-5', 'sld-group-item-6'],
      ['sld-group-item-7'],
      [],
      [],
      []
    ])
    expect(sliderGroups.panelDisplay).toStrictEqual(['', '', '', '', 'none', 'none', 'none'])
    expect(sliderGroups.tabDisplay).toStrictEqual(['', '', '', '', 'none', 'none', 'none'])
  })

  test('should group three items per panel at the third breakpoint', async ({ page }) => {
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 900,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const sliderGroups = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        panelDisplay: slider.panels.map(panel => panel.style.display),
        tabDisplay: slider.tabs.map(tab => tab.style.display)
      }
    })

    expect(sliderGroups.endIndex).toBe(2)
    expect(sliderGroups.itemIds).toStrictEqual([
      ['sld-group-item-1', 'sld-group-item-2', 'sld-group-item-3'],
      ['sld-group-item-4', 'sld-group-item-5', 'sld-group-item-6'],
      ['sld-group-item-7'],
      [],
      [],
      [],
      []
    ])
    expect(sliderGroups.panelDisplay).toStrictEqual(['', '', '', 'none', 'none', 'none', 'none'])
    expect(sliderGroups.tabDisplay).toStrictEqual(['', '', '', 'none', 'none', 'none', 'none'])
  })

  test('should group four items per panel at the last breakpoint', async ({ page }) => {
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 1200,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const sliderGroups = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        panelDisplay: slider.panels.map(panel => panel.style.display),
        tabDisplay: slider.tabs.map(tab => tab.style.display)
      }
    })

    expect(sliderGroups.endIndex).toBe(1)
    expect(sliderGroups.itemIds).toStrictEqual([
      ['sld-group-item-1', 'sld-group-item-2', 'sld-group-item-3', 'sld-group-item-4'],
      ['sld-group-item-5', 'sld-group-item-6', 'sld-group-item-7'],
      [],
      [],
      [],
      [],
      []
    ])
    expect(sliderGroups.panelDisplay).toStrictEqual(['', '', 'none', 'none', 'none', 'none', 'none'])
    expect(sliderGroups.tabDisplay).toStrictEqual(['', '', 'none', 'none', 'none', 'none', 'none'])
  })

  test('should ignore breakpoints without numbers when regrouping', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-group') as SliderGroup)

    await page.evaluate(slider => { // Breakpoints is public so entries are not guaranteed to be numbers
      slider.breakpoints.add({
        low: NaN,
        high: NaN,
        items: NaN,
        panels: NaN
      })
    }, sliderInstance)

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({ // Second breakpoint - two items per panel
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const sliderGroups = await page.evaluate(slider => {
      return {
        breakpointCount: slider.breakpoints.size,
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        })
      }
    }, sliderInstance)

    expect(sliderGroups.breakpointCount).toBe(5)
    expect(sliderGroups.endIndex).toBe(3) // Grouped by the valid breakpoint only
    expect(sliderGroups.itemIds).toStrictEqual([
      ['sld-group-item-1', 'sld-group-item-2'],
      ['sld-group-item-3', 'sld-group-item-4'],
      ['sld-group-item-5', 'sld-group-item-6'],
      ['sld-group-item-7'],
      [],
      [],
      []
    ])
  })

  /* Test navigation */

  test('should move to second group on second tab press', async ({ page }) => {
    await page.getByTestId('sld-group-tab-2').click()
    await page.waitForFunction(() => { // Wait for second group activated on click
      const activated = window.testSliderGroupActivated['sld-group']
      return activated?.currentIndex === 1 && activated.source === 'click'
    })

    await page.waitForFunction(() => {
      return window.testSliderGroupScrolled['sld-group']?.panelIndex === 1
    })

    const track = page.getByTestId('sld-group-track')
    const panel = page.getByTestId('sld-group-panel-2')

    const trackBox = await track.boundingBox() as { x: number }
    const panelBox = await panel.boundingBox() as { x: number }
    const offset = await track.evaluate(el => parseInt(getComputedStyle(el).scrollPaddingLeft, 10))

    const sliderSecond = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderSecond.currentIndex).toBe(1)
    // Second panel flush with track scroll start
    expect(Math.abs(panelBox.x - trackBox.x - offset)).toBeLessThanOrEqual(1)
    expect(sliderSecond.selected).toStrictEqual([
      'false', 'true', null, null, null, null, null
    ])
    expect(sliderSecond.tabIndexes).toStrictEqual([-1, 0, -1, -1, -1, -1, -1])
  })

  test('should move to next group on next button press', async ({ page }) => {
    // Nav buttons are hidden below container breakpoint so dispatch the click
    await page.getByTestId('sld-group-next').dispatchEvent('click')
    await page.waitForFunction(() => { // Wait for second group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 1
    })

    const sliderNext = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderNext.currentIndex).toBe(1)
    expect(sliderNext.selected).toStrictEqual([
      'false', 'true', null, null, null, null, null
    ])
    expect(sliderNext.tabIndexes).toStrictEqual([-1, 0, -1, -1, -1, -1, -1])
  })

  test('should move to previous group on previous button press', async ({ page }) => {
    await page.getByTestId('sld-group-tab-2').click()
    await page.waitForFunction(() => { // Wait for second group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 1
    })

    // Nav buttons are hidden below container breakpoint so dispatch the click
    await page.getByTestId('sld-group-prev').dispatchEvent('click')
    await page.waitForFunction(() => { // Wait for first group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 0
    })

    const sliderPrev = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderPrev.currentIndex).toBe(0)
    expect(sliderPrev.selected).toStrictEqual([
      'true', 'false', null, null, null, null, null
    ])
    expect(sliderPrev.tabIndexes).toStrictEqual([0, -1, -1, -1, -1, -1, -1])
  })

  test('should disable previous button on first group and next button on last group', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-group') as SliderGroup)

    const sliderFirst = await page.evaluate(slider => { // First group on init
      return {
        currentIndex: slider.currentIndex,
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    // Last group index depends on viewport width so move there with the end key
    await page.getByTestId('sld-group-tab-1').press('End')
    await page.waitForFunction(() => { // Wait for last group activated
      const activated = window.testSliderGroupActivated['sld-group']
      return activated?.currentIndex === activated?.endIndex
    })

    const sliderLast = await page.evaluate(slider => {
      return {
        currentIndex: slider.currentIndex,
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    expect(sliderFirst.currentIndex).toBe(0)
    expect(sliderFirst.prevDisabled).toBe(true)
    expect(sliderFirst.nextDisabled).toBe(false)
    expect(sliderLast.currentIndex).toBe(sliderLast.endIndex)
    expect(sliderLast.prevDisabled).toBe(false)
    expect(sliderLast.nextDisabled).toBe(true)
  })

  test('should wrap to first group on right arrow key from last group', async ({ page }) => {
    // Last group index depends on viewport width so move there with the end key
    await page.getByTestId('sld-group-tab-1').press('End')
    await page.waitForFunction(() => { // Wait for last group activated
      const activated = window.testSliderGroupActivated['sld-group']
      return activated?.currentIndex === activated?.endIndex
    })

    await page.keyboard.press('ArrowRight') // Focus moved to the last tab
    await page.waitForFunction(() => { // Wait for first group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 0
    })

    const sliderWrap = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        focused: document.activeElement?.getAttribute('aria-label'),
        selected: slider.tabs[0]?.ariaSelected,
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderWrap.currentIndex).toBe(0)
    expect(sliderWrap.focused).toBe('Panel 1')
    expect(sliderWrap.selected).toBe('true')
    expect(sliderWrap.tabIndexes).toStrictEqual([0, -1, -1, -1, -1, -1, -1])
  })

  test('should only allow focus in current group', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-group') as SliderGroup)

    const sliderFirst = await page.evaluate(slider => {
      return slider.panels.map(panel => panel.inert)
    }, sliderInstance)

    await page.getByTestId('sld-group-tab-2').click()
    await page.waitForFunction(() => { // Wait for second group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 1
    })

    const sliderSecond = await page.evaluate(slider => {
      return slider.panels.map(panel => panel.inert)
    }, sliderInstance)

    expect(sliderFirst).toStrictEqual([false, true, true, true, true, true, true])
    expect(sliderSecond).toStrictEqual([true, false, true, true, true, true, true])
  })

  test('should update current index and selected tab on swipe', async ({ page }) => {
    await page.evaluate(() => { // Scroll to second group
      document.querySelector('#sld-group-panel-2')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for second group activated on scroll
      const activated = window.testSliderGroupActivated['sld-group']
      return activated?.currentIndex === 1 && activated.source === 'scroll'
    })

    const track = page.getByTestId('sld-group-track')
    const panel = page.getByTestId('sld-group-panel-2')

    const trackBox = await track.boundingBox() as { x: number }
    const panelBox = await panel.boundingBox() as { x: number }
    const offset = await track.evaluate(el => parseInt(getComputedStyle(el).scrollPaddingLeft, 10))

    const sliderSwipe = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex),
        prevDisabled: slider.prev?.disabled
      }
    })

    expect(sliderSwipe.currentIndex).toBe(1)
    // Second panel stays flush with track scroll start - not scrolled again on swipe
    expect(Math.abs(panelBox.x - trackBox.x - offset)).toBeLessThanOrEqual(1)
    expect(sliderSwipe.selected).toStrictEqual([
      'false', 'true', null, null, null, null, null
    ])
    expect(sliderSwipe.tabIndexes).toStrictEqual([-1, 0, -1, -1, -1, -1, -1])
    expect(sliderSwipe.prevDisabled).toBe(false)
  })

  /* Test resize */

  test('should regroup items and stay on current group on resize', async ({ page }) => {
    await page.getByTestId('sld-group-tab-2').click()
    await page.waitForFunction(() => { // Wait for second group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 1
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({ // Second breakpoint - two items per panel
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    const track = page.getByTestId('sld-group-track')
    const panel = page.getByTestId('sld-group-panel-2')

    const trackBox = await track.boundingBox() as { x: number }
    const panelBox = await panel.boundingBox() as { x: number }
    const offset = await track.evaluate(el => parseInt(getComputedStyle(el).scrollPaddingLeft, 10))

    const sliderResize = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        }),
        selected: slider.tabs.map(tab => tab.ariaSelected),
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    })

    expect(sliderResize.currentIndex).toBe(1)
    expect(sliderResize.endIndex).toBe(3)
    expect(sliderResize.itemIds).toStrictEqual([
      ['sld-group-item-1', 'sld-group-item-2'],
      ['sld-group-item-3', 'sld-group-item-4'],
      ['sld-group-item-5', 'sld-group-item-6'],
      ['sld-group-item-7'],
      [],
      [],
      []
    ])
    // Second panel flush with track scroll start at the new width
    expect(Math.abs(panelBox.x - trackBox.x - offset)).toBeLessThanOrEqual(1)
    expect(sliderResize.selected).toStrictEqual([
      'false', 'true', null, null, null, null, null
    ])
    expect(sliderResize.prevDisabled).toBe(false)
    expect(sliderResize.nextDisabled).toBe(false)
  })

  test('should move to last group on resize if current group no longer exists', async ({ page }) => {
    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({ // Below the second breakpoint - one item per panel
      width: 400,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderGroupActivated['sld-group']?.source === 'resize'
    })

    await page.getByTestId('sld-group-tab-1').press('End')
    await page.waitForFunction(() => { // Wait for seventh group activated
      return window.testSliderGroupActivated['sld-group']?.currentIndex === 6
    })

    await page.setViewportSize({ // Last breakpoint - four items per panel leaves two groups
      width: 1200,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for second group activated on resize
      const activated = window.testSliderGroupActivated['sld-group']
      return activated?.currentIndex === 1 && activated.source === 'resize'
    })

    const sliderResize = await page.evaluate(() => {
      const slider = document.querySelector('#sld-group') as SliderGroup

      return {
        currentIndex: slider.currentIndex,
        endIndex: window.testSliderGroupActivated['sld-group']?.endIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    })

    expect(sliderResize.currentIndex).toBe(1)
    expect(sliderResize.endIndex).toBe(1)
    expect(sliderResize.selected).toStrictEqual([
      'false', 'true', null, null, null, null, 'false'
    ])
    expect(sliderResize.prevDisabled).toBe(false)
    expect(sliderResize.nextDisabled).toBe(true)
  })

  test('should not regroup items on resize if viewport height changes', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-group') as SliderGroup)

    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testSliderGroupResize += 1
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
      return window.testSliderGroupResize
    })

    const sliderBefore = await page.evaluate(slider => {
      return {
        count: window.testSliderGroupActivate['sld-group']?.count,
        resize: window.testSliderGroupResize,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        })
      }
    }, sliderInstance)

    await page.setViewportSize({ // Height only resize
      width,
      height: viewport.height - 100
    })

    await page.waitForFunction((resize: number) => { // Wait for resize
      return window.testSliderGroupResize > resize
    }, sliderBefore.resize)

    const sliderHeight = await page.evaluate(slider => {
      return {
        count: window.testSliderGroupActivate['sld-group']?.count,
        currentIndex: slider.currentIndex,
        itemIds: slider.panels.map(panel => {
          return Array.from(panel.children).map(item => item.id)
        })
      }
    }, sliderInstance)

    expect(sliderHeight.count).toBe(sliderBefore.count) // No activation on height change
    expect(sliderHeight.currentIndex).toBe(0)
    expect(sliderHeight.itemIds).toStrictEqual(sliderBefore.itemIds)
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const sliderProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const slider = document.querySelector('#sld-group') as SliderGroup
      const track = slider.track as HTMLElement
      const prev = slider.prev as HTMLButtonElement
      const next = slider.next as HTMLButtonElement
      const [, secondTab] = slider.tabs
      const resizeActionCount = actions.get('resize')?.size || 1

      slider.remove()

      await Promise.resolve()

      secondTab?.click()
      prev.dispatchEvent(new MouseEvent('click'))
      next.dispatchEvent(new MouseEvent('click'))
      track.dispatchEvent(new Event('scroll'))

      await new Promise(resolve => { setTimeout(resolve, 200) }) // Longer than scroll debounce

      return {
        init: slider.init,
        subInit: slider.subInit,
        currentIndex: slider.currentIndex,
        tabs: slider.tabs,
        panels: slider.panels,
        items: slider.items,
        track: slider.track,
        prev: slider.prev,
        next: slider.next,
        breakpointCount: slider.breakpoints.size,
        activatedCount: window.testSliderGroupActivated['sld-group']?.count,
        resizeActionRemoved: actions.get('resize')?.size === resizeActionCount - 1
      }
    })

    expect(sliderProps.init).toBe(false)
    expect(sliderProps.subInit).toBe(false)
    expect(sliderProps.currentIndex).toBe(0)
    expect(sliderProps.tabs).toStrictEqual([])
    expect(sliderProps.panels).toStrictEqual([])
    expect(sliderProps.items).toStrictEqual([])
    expect(sliderProps.track).toBe(null)
    expect(sliderProps.prev).toBe(null)
    expect(sliderProps.next).toBe(null)
    expect(sliderProps.breakpointCount).toBe(0)
    expect(sliderProps.activatedCount).toBe(1)
    expect(sliderProps.resizeActionRemoved).toBe(true)
  })
})
