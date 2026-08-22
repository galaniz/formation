/**
 * Objects - Slider Test
 */

import type { Slider } from '../Slider.js'
import type { SliderScrolledEventDetail } from '../SliderTypes.js'
import type { TabsEventDetail } from '../../Tabs/TabsTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

type SliderDetailKey = 'testSliderActivate' | 'testSliderActivated'

interface SliderDetail {
  source: string
  currentIndex: number
  panelIndex: number
  count: number
}

declare global {
  interface Window {
    testSliderActivate: Record<string, SliderDetail>
    testSliderActivated: Record<string, SliderDetail>
    testSliderScrolled: Record<string, SliderScrolledEventDetail>
    testSliderResize: number
  }
}

/* Tests */

test.describe('Slider', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testSliderActivate = {}
      window.testSliderActivated = {}
      window.testSliderScrolled = {}
      window.testSliderResize = 0

      /* Listen on document so recording does not depend on when the elements init */

      const listen = (type: string, store: SliderDetailKey): void => {
        document.addEventListener(type, (e: Event) => {
          const { id } = e.target as HTMLElement
          const { source, currentIndex, panelIndex } = (e as CustomEvent<TabsEventDetail>).detail

          window[store][id] = {
            source,
            currentIndex,
            panelIndex,
            count: (window[store][id]?.count || 0) + 1
          }
        }, true)
      }

      listen('tabs:activate', 'testSliderActivate')
      listen('tabs:activated', 'testSliderActivated')

      document.addEventListener('slider:scrolled', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testSliderScrolled[id] = (e as CustomEvent<SliderScrolledEventDetail>).detail
      }, true)
    })

    await page.goto('/spec/objects/Slider/__tests__/Slider.html')

    await page.waitForFunction(() => { // Wait for init activated events
      return Object.keys(window.testSliderActivated).length === 2
    })
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const sliderInit = await page.evaluate(() => {
      const sliders: Slider[] = Array.from(document.querySelectorAll('frm-slider'))
      return sliders.map(slider => [slider.init, slider.subInit])
    })

    expect(sliderInit).toStrictEqual([ // Init and sub init
      [false, false], // #sld-empty
      [true, true],   // #sld-single
      [true, true]    // #sld-loop
    ])
  })

  test('should set props and elements on init', async ({ page }) => {
    const sliderProps = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

      return {
        subInit: slider.subInit,
        duration: slider.duration,
        delay: slider.delay, // Duration plus buffer
        loop: slider.loop,
        currentIndex: slider.currentIndex,
        trackId: slider.track?.id,
        prevId: slider.prev?.id,
        nextId: slider.next?.id,
        tabCount: slider.tabs.length,
        panelCount: slider.panels.length
      }
    })

    expect(sliderProps.subInit).toBe(true)
    expect(sliderProps.duration).toBe(500)
    expect(sliderProps.delay).toBe(600)
    expect(sliderProps.loop).toBe(false)
    expect(sliderProps.currentIndex).toBe(0)
    expect(sliderProps.trackId).toBe('sld-single-track')
    expect(sliderProps.prevId).toBe('sld-single-prev')
    expect(sliderProps.nextId).toBe('sld-single-next')
    expect(sliderProps.tabCount).toBe(7)
    expect(sliderProps.panelCount).toBe(7)
  })

  test('should clone panels and start at selected tab on init', async ({ page }) => {
    const sliderLoop = await page.evaluate(() => {
      const slider = document.querySelector('#sld-loop') as Slider

      return {
        loop: slider.loop,
        currentIndex: slider.currentIndex, // Third tab is selected in markup
        panelIndex: window.testSliderActivated['sld-loop']?.panelIndex,
        tabCount: slider.tabs.length,
        panelCount: slider.panels.length, // Panels repeated twice
        panelIds: [
          slider.panels[0]?.id,
          slider.panels[7]?.id,
          slider.panels[14]?.id
        ],
        selected: slider.tabs.map(tab => tab.ariaSelected)
      }
    })

    expect(sliderLoop.loop).toBe(true)
    expect(sliderLoop.currentIndex).toBe(2)
    expect(sliderLoop.panelIndex).toBe(9) // Third panel of second set
    expect(sliderLoop.tabCount).toBe(7)
    expect(sliderLoop.panelCount).toBe(21)
    expect(sliderLoop.panelIds).toStrictEqual([
      'sld-loop-panel-1',
      'sld-loop-panel-1-clone-1',
      'sld-loop-panel-1-clone-2'
    ])
    expect(sliderLoop.selected).toStrictEqual([
      null, null, 'true', null, null, null, null
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const sliderProps = await page.evaluate(async () => {
      const slider = document.querySelector('#sld-single') as Slider
      const sliderLoop = document.querySelector('#sld-loop') as Slider

      slider.parentElement?.insertAdjacentElement('beforeend', slider)
      sliderLoop.parentElement?.insertAdjacentElement('beforeend', sliderLoop)

      await Promise.resolve()

      return {
        init: [slider.init, sliderLoop.init],
        subInit: [slider.subInit, sliderLoop.subInit],
        currentIndex: [slider.currentIndex, sliderLoop.currentIndex],
        trackId: [slider.track?.id, sliderLoop.track?.id],
        panelCount: [slider.panels.length, sliderLoop.panels.length] // Loop panels not cloned again
      }
    })

    expect(sliderProps.init).toStrictEqual([true, true])
    expect(sliderProps.subInit).toStrictEqual([true, true])
    expect(sliderProps.currentIndex).toStrictEqual([0, 2])
    expect(sliderProps.trackId).toStrictEqual(['sld-single-track', 'sld-loop-track'])
    expect(sliderProps.panelCount).toStrictEqual([7, 21])
  })

  /* Test navigation */

  test('should move to third slide on third tab press', async ({ page }) => {
    await page.getByTestId('sld-single-tab-3').click()
    await page.waitForFunction(() => { // Wait for third slide activated on click
      const activated = window.testSliderActivated['sld-single']
      return activated?.currentIndex === 2 && activated.source === 'click'
    })

    await page.waitForFunction(() => {
      return window.testSliderScrolled['sld-single']?.panelIndex === 2
    })

    const track = page.getByTestId('sld-single-track')
    const panel = page.getByTestId('sld-single-panel-3')

    const trackBox = await track.boundingBox() as { x: number }
    const panelBox = await panel.boundingBox() as { x: number }
    const offset = await track.evaluate(el => parseInt(getComputedStyle(el).scrollPaddingLeft, 10))

    const sliderThird = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderThird.currentIndex).toBe(2)
    // Third panel flush with track scroll start
    expect(Math.abs(panelBox.x - trackBox.x - offset)).toBeLessThanOrEqual(1)
    expect(sliderThird.selected).toStrictEqual([
      'false', null, 'true', null, null, null, null
    ])
    expect(sliderThird.tabIndexes).toStrictEqual([-1, -1, 0, -1, -1, -1, -1])
  })

  test('should move to next slide on next button press', async ({ page }) => {
    // Nav buttons are hidden below container breakpoint so dispatch the click
    await page.getByTestId('sld-single-next').dispatchEvent('click')
    await page.waitForFunction(() => { // Wait for second slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 1
    })

    const sliderNext = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

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

  test('should move to previous slide on previous button press', async ({ page }) => {
    await page.getByTestId('sld-single-tab-3').click()
    await page.waitForFunction(() => { // Wait for third slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 2
    })

    // Nav buttons are hidden below container breakpoint so dispatch the click
    await page.getByTestId('sld-single-prev').dispatchEvent('click')
    await page.waitForFunction(() => { // Wait for second slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 1
    })

    const sliderPrev = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderPrev.currentIndex).toBe(1)
    expect(sliderPrev.selected).toStrictEqual([
      'false', 'true', 'false', null, null, null, null
    ])
    expect(sliderPrev.tabIndexes).toStrictEqual([-1, 0, -1, -1, -1, -1, -1])
  })

  test('should disable previous button on first slide and next button on last slide', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-single') as Slider)

    const sliderFirst = await page.evaluate(slider => {
      return {
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    await page.getByTestId('sld-single-tab-4').click()
    await page.waitForFunction(() => { // Wait for fourth slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 3
    })

    const sliderMiddle = await page.evaluate(slider => {
      return {
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    await page.getByTestId('sld-single-tab-7').click()
    await page.waitForFunction(() => { // Wait for last slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 6
    })

    const sliderLast = await page.evaluate(slider => {
      return {
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    expect(sliderFirst.prevDisabled).toBe(true)
    expect(sliderFirst.nextDisabled).toBe(false)
    expect(sliderMiddle.prevDisabled).toBe(false)
    expect(sliderMiddle.nextDisabled).toBe(false)
    expect(sliderLast.prevDisabled).toBe(false)
    expect(sliderLast.nextDisabled).toBe(true)
  })

  test('should update current index and selected tab on swipe', async ({ page }) => {
    await page.evaluate(() => { // Scroll to fourth panel
      document.querySelector('#sld-single-panel-4')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for fourth slide activated on scroll
      const activated = window.testSliderActivated['sld-single']
      return activated?.currentIndex === 3 && activated.source === 'scroll'
    })

    const track = page.getByTestId('sld-single-track')
    const panel = page.getByTestId('sld-single-panel-4')

    const trackBox = await track.boundingBox() as { x: number }
    const panelBox = await panel.boundingBox() as { x: number }
    const offset = await track.evaluate(el => parseInt(getComputedStyle(el).scrollPaddingLeft, 10))

    const sliderSwipe = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex),
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    })

    expect(sliderSwipe.currentIndex).toBe(3)
    // Fourth panel stays flush with track scroll start - not scrolled again on swipe
    expect(Math.abs(panelBox.x - trackBox.x - offset)).toBeLessThanOrEqual(1)
    expect(sliderSwipe.selected).toStrictEqual([
      'false', null, null, 'true', null, null, null
    ])
    expect(sliderSwipe.tabIndexes).toStrictEqual([-1, -1, -1, 0, -1, -1, -1])
    expect(sliderSwipe.prevDisabled).toBe(false)
    expect(sliderSwipe.nextDisabled).toBe(false)
  })

  test('should only allow focus in current slide', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-single') as Slider)

    const sliderFirst = await page.evaluate(slider => {
      return {
        disabled: slider.panels.map(panel => panel.getAttribute('aria-disabled')),
        panelIndexes: slider.panels.map(panel => panel.tabIndex),
        linkIndexes: slider.panels.map(panel => panel.querySelector('a')?.tabIndex)
      }
    }, sliderInstance)

    await page.getByTestId('sld-single-tab-2').click()
    await page.waitForFunction(() => { // Wait for second slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 1
    })

    const sliderSecond = await page.evaluate(slider => {
      return {
        disabled: slider.panels.map(panel => panel.getAttribute('aria-disabled')),
        panelIndexes: slider.panels.map(panel => panel.tabIndex),
        linkIndexes: slider.panels.map(panel => panel.querySelector('a')?.tabIndex)
      }
    }, sliderInstance)

    expect(sliderFirst.disabled).toStrictEqual([null, 'true', 'true', 'true', 'true', 'true', 'true'])
    expect(sliderFirst.panelIndexes).toStrictEqual([0, -1, -1, -1, -1, -1, -1])
    expect(sliderFirst.linkIndexes).toStrictEqual([0, -1, -1, -1, -1, -1, -1])
    expect(sliderSecond.disabled).toStrictEqual(['true', null, 'true', 'true', 'true', 'true', 'true'])
    expect(sliderSecond.panelIndexes).toStrictEqual([-1, 0, -1, -1, -1, -1, -1])
    expect(sliderSecond.linkIndexes).toStrictEqual([-1, 0, -1, -1, -1, -1, -1])
  })

  test('should stay on current slide on resize', async ({ page }) => {
    await page.getByTestId('sld-single-tab-3').click()
    await page.waitForFunction(() => { // Wait for third slide activated
      return window.testSliderActivated['sld-single']?.currentIndex === 2
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: viewport.width + 100,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize activated
      return window.testSliderActivated['sld-single']?.source === 'resize'
    })

    const track = page.getByTestId('sld-single-track')
    const panel = page.getByTestId('sld-single-panel-3')

    const trackBox = await track.boundingBox() as { x: number }
    const panelBox = await panel.boundingBox() as { x: number }
    const offset = await track.evaluate(el => parseInt(getComputedStyle(el).scrollPaddingLeft, 10))

    const sliderResize = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

      return {
        currentIndex: slider.currentIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected)
      }
    })

    expect(sliderResize.currentIndex).toBe(2)
    // Third panel flush with track scroll start at the new width
    expect(Math.abs(panelBox.x - trackBox.x - offset)).toBeLessThanOrEqual(1)
    expect(sliderResize.selected).toStrictEqual([
      'false', null, 'true', null, null, null, null
    ])
  })

  test('should not update on resize if viewport height changes', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testSliderResize += 1
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
      return window.testSliderResize
    })

    const sliderBefore = await page.evaluate(() => {
      return {
        count: window.testSliderActivate['sld-single']?.count,
        resize: window.testSliderResize
      }
    })

    await page.setViewportSize({ // Height only resize
      width,
      height: viewport.height - 100
    })

    await page.waitForFunction((resize: number) => { // Wait for resize
      return window.testSliderResize > resize
    }, sliderBefore.resize)

    const sliderHeight = await page.evaluate(() => {
      const slider = document.querySelector('#sld-single') as Slider

      return {
        count: window.testSliderActivate['sld-single']?.count,
        currentIndex: slider.currentIndex
      }
    })

    expect(sliderHeight.count).toBe(sliderBefore.count) // No activation on height change
    expect(sliderHeight.currentIndex).toBe(0)
  })

  /* Test loop */

  test('should loop to first item after swiping to right of last slide', async ({ page }) => {
    await page.evaluate(() => { // Scroll to last panel of second set
      document.querySelector('#sld-loop-panel-7-clone-1')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for last slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 6
    })

    await page.evaluate(() => { // Scroll to first panel of third set
      document.querySelector('#sld-loop-panel-1-clone-2')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for first slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 0
    })

    const sliderLoop = await page.evaluate(() => {
      const slider = document.querySelector('#sld-loop') as Slider

      return {
        currentIndex: slider.currentIndex,
        panelIndex: window.testSliderActivated['sld-loop']?.panelIndex,
        panelCount: slider.panels.length,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderLoop.currentIndex).toBe(0)
    expect(sliderLoop.panelIndex).toBe(14)
    expect(sliderLoop.panelCount).toBe(21)
    expect(sliderLoop.selected).toStrictEqual([
      'true', null, 'false', null, null, null, 'false'
    ])
    expect(sliderLoop.tabIndexes).toStrictEqual([0, -1, -1, -1, -1, -1, -1])
  })

  test('should loop to last item after swiping to left of first slide', async ({ page }) => {
    await page.evaluate(() => { // Scroll to first panel of second set
      document.querySelector('#sld-loop-panel-1-clone-1')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for first slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 0
    })

    await page.evaluate(() => { // Scroll to last panel of first set
      document.querySelector('#sld-loop-panel-7')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for last slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 6
    })

    const sliderLoop = await page.evaluate(() => {
      const slider = document.querySelector('#sld-loop') as Slider

      return {
        currentIndex: slider.currentIndex,
        panelIndex: window.testSliderActivated['sld-loop']?.panelIndex,
        panelCount: slider.panels.length,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        tabIndexes: slider.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(sliderLoop.currentIndex).toBe(6)
    expect(sliderLoop.panelIndex).toBe(6)
    expect(sliderLoop.panelCount).toBe(21)
    expect(sliderLoop.selected).toStrictEqual([
      'false', null, 'false', null, null, null, 'true'
    ])
    expect(sliderLoop.tabIndexes).toStrictEqual([-1, -1, -1, -1, -1, -1, 0])
  })

  test('should move panels and track to middle set at loop start', async ({ page }) => {
    await page.evaluate(() => { // Scroll to second panel of first set
      document.querySelector('#sld-loop-panel-2')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for second panel of middle set activated
      return window.testSliderActivated['sld-loop']?.panelIndex === 8
    })

    const sliderLoop = await page.evaluate(() => {
      const slider = document.querySelector('#sld-loop') as Slider
      const track = slider.track as HTMLElement
      const offset = parseInt(getComputedStyle(track).scrollPaddingLeft, 10)
      const trackLeft = track.getBoundingClientRect().left
      const panelLeft = slider.panels[8]?.getBoundingClientRect().left || 0

      return {
        currentIndex: slider.currentIndex,
        panelCount: slider.panels.length,
        panelIds: [ // Last set moved to start
          slider.panels[0]?.id,
          slider.panels[7]?.id,
          slider.panels[14]?.id
        ],
        panelStart: panelLeft - trackLeft - offset,
        selected: slider.tabs.map(tab => tab.ariaSelected)
      }
    })

    expect(sliderLoop.currentIndex).toBe(1)
    expect(sliderLoop.panelCount).toBe(21)
    expect(sliderLoop.panelIds).toStrictEqual([
      'sld-loop-panel-1-clone-2',
      'sld-loop-panel-1',
      'sld-loop-panel-1-clone-1'
    ])
    // Second panel of middle set flush with track scroll start after the move
    expect(Math.abs(sliderLoop.panelStart)).toBeLessThanOrEqual(1)
    expect(sliderLoop.selected).toStrictEqual([
      null, 'true', 'false', null, null, null, null
    ])
  })

  test('should move panels and track to middle set at loop end', async ({ page }) => {
    await page.evaluate(() => { // Scroll to first panel of last set
      document.querySelector('#sld-loop-panel-1-clone-2')?.scrollIntoView({
        inline: 'start',
        block: 'nearest'
      })
    })

    await page.waitForFunction(() => { // Wait for first panel of last set activated
      return window.testSliderActivated['sld-loop']?.panelIndex === 14
    })

    await page.getByTestId('sld-loop-tab-7').click()
    await page.waitForFunction(() => { // Wait for last panel of middle set scrolled to
      return window.testSliderScrolled['sld-loop']?.panelIndex === 13
    })

    const sliderLoop = await page.evaluate(() => {
      const slider = document.querySelector('#sld-loop') as Slider
      const track = slider.track as HTMLElement
      const offset = parseInt(getComputedStyle(track).scrollPaddingLeft, 10)
      const trackLeft = track.getBoundingClientRect().left
      const panelLeft = slider.panels[13]?.getBoundingClientRect().left || 0

      return {
        currentIndex: slider.currentIndex,
        panelCount: slider.panels.length,
        panelIds: [ // Last set moved to start
          slider.panels[0]?.id,
          slider.panels[7]?.id,
          slider.panels[14]?.id
        ],
        panelStart: panelLeft - trackLeft - offset,
        selected: slider.tabs.map(tab => tab.ariaSelected)
      }
    })

    expect(sliderLoop.currentIndex).toBe(6)
    expect(sliderLoop.panelCount).toBe(21)
    expect(sliderLoop.panelIds).toStrictEqual([
      'sld-loop-panel-1-clone-2',
      'sld-loop-panel-1',
      'sld-loop-panel-1-clone-1'
    ])
    // Last panel of middle set flush with track scroll start after the move
    expect(Math.abs(sliderLoop.panelStart)).toBeLessThanOrEqual(1)
    expect(sliderLoop.selected).toStrictEqual([
      'false', null, 'false', null, null, null, 'true'
    ])
  })

  test('should loop and not disable buttons on next and previous button press', async ({ page }) => {
    const sliderInstance = await page.evaluateHandle(() => document.querySelector('#sld-loop') as Slider)

    await page.getByTestId('sld-loop-tab-1').click()
    await page.waitForFunction(() => { // Wait for first slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 0
    })

    // Nav buttons are hidden below the container breakpoint so dispatch the click
    await page.getByTestId('sld-loop-prev').dispatchEvent('click')
    await page.waitForFunction(() => { // Wait for last slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 6
    })

    const sliderPrev = await page.evaluate(slider => {
      return {
        currentIndex: slider.currentIndex,
        panelIndex: window.testSliderActivated['sld-loop']?.panelIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    await page.getByTestId('sld-loop-next').dispatchEvent('click')
    await page.waitForFunction(() => { // Wait for first slide activated
      return window.testSliderActivated['sld-loop']?.currentIndex === 0
    })

    const sliderNext = await page.evaluate(slider => {
      return {
        currentIndex: slider.currentIndex,
        panelIndex: window.testSliderActivated['sld-loop']?.panelIndex,
        selected: slider.tabs.map(tab => tab.ariaSelected),
        prevDisabled: slider.prev?.disabled,
        nextDisabled: slider.next?.disabled
      }
    }, sliderInstance)

    expect(sliderPrev.currentIndex).toBe(6)
    expect(sliderPrev.panelIndex).toBe(6)
    expect(sliderPrev.selected).toStrictEqual([
      'false', null, 'false', null, null, null, 'true'
    ])
    expect(sliderPrev.prevDisabled).toBe(false)
    expect(sliderPrev.nextDisabled).toBe(false)
    expect(sliderNext.currentIndex).toBe(0)
    expect(sliderNext.panelIndex).toBe(7)
    expect(sliderNext.selected).toStrictEqual([
      'true', null, 'false', null, null, null, 'false'
    ])
    expect(sliderNext.prevDisabled).toBe(false)
    expect(sliderNext.nextDisabled).toBe(false)
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const sliderProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const slider = document.querySelector('#sld-single') as Slider
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
        track: slider.track,
        prev: slider.prev,
        next: slider.next,
        activatedCount: window.testSliderActivated['sld-single']?.count,
        resizeActionRemoved: actions.get('resize')?.size === resizeActionCount - 1
      }
    })

    expect(sliderProps.init).toBe(false)
    expect(sliderProps.subInit).toBe(false)
    expect(sliderProps.currentIndex).toBe(0)
    expect(sliderProps.tabs).toStrictEqual([])
    expect(sliderProps.panels).toStrictEqual([])
    expect(sliderProps.track).toBe(null)
    expect(sliderProps.prev).toBe(null)
    expect(sliderProps.next).toBe(null)
    expect(sliderProps.activatedCount).toBe(1)
    expect(sliderProps.resizeActionRemoved).toBe(true)
  })
})
