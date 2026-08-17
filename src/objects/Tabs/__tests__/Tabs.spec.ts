/**
 * Objects - Tabs Test
 */

import type { Tabs } from '../Tabs.js'
import type { TabsEventDetail, TabsIndexesFilterArgs } from '../TabsTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

type TabsDetailKey = 'testTabsDeactivate' | 'testTabsActivate' | 'testTabsActivated'

interface TabsDetail extends TabsEventDetail {
  hidden: boolean
  now: number
}

declare global {
  interface Window {
    testTabsDeactivate: TabsDetail | null
    testTabsActivate: TabsDetail | null
    testTabsActivated: TabsDetail | null
  }
}

/* Tests */

test.describe('Tabs', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testTabsDeactivate = null
      window.testTabsActivate = null
      window.testTabsActivated = null

      /* Listen on document so recording does not depend on when the elements init */

      const listen = (type: string, store: TabsDetailKey): void => {
        document.addEventListener(type, (e: Event) => {
          const detail = (e as CustomEvent<TabsEventDetail>).detail

          if (detail.source === 'init') {
            return
          }

          window[store] = {
            ...detail,
            hidden: detail.panel.hidden === true, // State when event dispatched
            now: performance.now()
          }
        }, true)
      }

      listen('tabs:deactivate', 'testTabsDeactivate')
      listen('tabs:activate', 'testTabsActivate')
      listen('tabs:activated', 'testTabsActivated')
    })

    await page.goto('/spec/objects/Tabs/__tests__/Tabs.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const tabsInit = await page.evaluate(() => {
      const tabs: Tabs[] = Array.from(document.querySelectorAll('frm-tabs'))
      return tabs.map(instance => instance.init)
    })

    expect(tabsInit).toStrictEqual([
      false, // #tabs-empty
      true,  // #tabs
      true,  // #tabs-delay
      true,  // #tabs-vertical
      true,  // #tabs-anchor
      false  // #tabs-mismatch
    ])
  })

  test('should not initialize if tabs and panels do not correspond', async ({ page }) => {
    const tabsInstance = await page.evaluateHandle(() => document.querySelector('#tabs-mismatch') as Tabs)

    const tabsMismatch = await page.evaluate(tabs => {
      return {
        init: tabs.init,
        tabs: tabs.tabs, // Props left empty
        panels: tabs.panels,
        tabCount: tabs.querySelectorAll('[role="tab"]').length,
        panelCount: tabs.querySelectorAll('[role="tabpanel"]').length
      }
    }, tabsInstance)

    await page.getByTestId('tabs-mismatch-tab-2').click()

    const tabsMismatchClick = await page.evaluate(tabs => {
      return {
        activate: window.testTabsActivate, // No click listeners
        currentIndex: tabs.currentIndex,
        selected: Array.from(tabs.querySelectorAll('[role="tab"]')).map(tab => tab.ariaSelected),
        hidden: Array.from(tabs.querySelectorAll('[role="tabpanel"]')).map(panel => {
          return (panel as HTMLElement).hidden
        })
      }
    }, tabsInstance)

    expect(tabsMismatch.init).toBe(false)
    expect(tabsMismatch.tabs).toStrictEqual([])
    expect(tabsMismatch.panels).toStrictEqual([])
    expect(tabsMismatch.tabCount).toBe(3)
    expect(tabsMismatch.panelCount).toBe(2)
    expect(tabsMismatchClick.activate).toBe(null)
    expect(tabsMismatchClick.currentIndex).toBe(0)
    expect(tabsMismatchClick.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsMismatchClick.hidden).toStrictEqual([false, true])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const tabsProps = await page.evaluate(async () => {
      const tabs = document.querySelector('#tabs') as Tabs

      tabs.parentElement?.insertAdjacentElement('beforeend', tabs)

      await Promise.resolve()

      return {
        init: tabs.init,
        currentIndex: tabs.currentIndex,
        delay: tabs.delay,
        direction: tabs.direction,
        tabCount: tabs.tabs.length,
        panelCount: tabs.panels.length
      }
    })

    expect(tabsProps.init).toBe(true)
    expect(tabsProps.currentIndex).toBe(0)
    expect(tabsProps.delay).toBe(0)
    expect(tabsProps.direction).toBe('horizontal')
    expect(tabsProps.tabCount).toBe(3)
    expect(tabsProps.panelCount).toBe(3)
  })

  /* Test activate */

  test('should not activate if index out of range', async ({ page }) => {
    const tabsOutOfRange = await page.evaluate(() => {
      const tabs = document.querySelector('#tabs') as Tabs

      return {
        activated: tabs.activate({ current: 3 }),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    })

    expect(tabsOutOfRange.activated).toBe(false)
    expect(tabsOutOfRange.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsOutOfRange.tabIndexes).toStrictEqual([0, -1, -1])
    expect(tabsOutOfRange.panelSelected).toStrictEqual(['true', null, null])
    expect(tabsOutOfRange.panelHidden).toStrictEqual([false, true, true])
  })

  test('should filter indexes on activate', async ({ page }) => {
    const tabsFiltered = await page.evaluate(async () => {
      const { addFilter } = await import('../../../filters/filters.js')
      const tabs = document.querySelector('#tabs') as Tabs
      const currentIndex = tabs.currentIndex

      addFilter('tabs:indexes:tabs', (indexes: TabsIndexesFilterArgs) => {
        return {
          ...indexes,
          currentIndex: 2 // Last tab instead of requested
        }
      })

      tabs.activate({ current: 1 })

      return {
        currentIndex,
        filteredIndex: tabs.currentIndex,
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex)
      }
    })

    expect(tabsFiltered.currentIndex).toBe(0)
    expect(tabsFiltered.filteredIndex).toBe(2)
    expect(tabsFiltered.selected).toStrictEqual(['false', 'false', 'true'])
    expect(tabsFiltered.tabIndexes).toStrictEqual([-1, -1, 0])
  })

  /* Test delay */

  test('should set and use specified delay on activate', async ({ page }) => {
    await page.getByTestId('tabs-delay-tab-2').click()
    await page.waitForFunction(() => { // Wait for activated
      return window.testTabsActivated?.tab.id === 'tabs-delay-tab-2'
    })

    const tabsDelay = await page.evaluate(() => {
      const tabs = document.querySelector('#tabs-delay') as Tabs
      const activate = window.testTabsActivate
      const activated = window.testTabsActivated

      return {
        delay: tabs.delay,
        elapsed: (activated?.now || 0) - (activate?.now || 0),
        activateHidden: activate?.hidden, // Panel hidden until delay elapses
        hidden: tabs.panels.map(panel => panel.hidden),
        selected: tabs.tabs.map(tab => tab.ariaSelected)
      }
    })

    expect(tabsDelay.delay).toBe(100)
    expect(tabsDelay.elapsed).toBeGreaterThanOrEqual(100)
    expect(tabsDelay.activateHidden).toBe(true)
    expect(tabsDelay.hidden).toStrictEqual([true, false, true])
    expect(tabsDelay.selected).toStrictEqual(['false', 'true', 'false'])
  })

  /* Test navigation */

  test('should show second panel on second tab press', async ({ page }) => {
    const tabsInstance = await page.evaluateHandle(() => document.querySelector('#tabs') as Tabs)

    await page.getByTestId('tabs-tab-2').click()
    await page.waitForFunction(() => { // Wait for second tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-2'
    })

    const tabsSecond = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.getByTestId('tabs-tab-1').click()
    await page.waitForFunction(() => { // Wait for first tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-1'
    })

    const tabsFirst = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    expect(tabsSecond.currentIndex).toBe(1)
    expect(tabsSecond.selected).toStrictEqual(['false', 'true', 'false'])
    expect(tabsSecond.tabIndexes).toStrictEqual([-1, 0, -1])
    expect(tabsSecond.panelSelected).toStrictEqual(['false', 'true', null])
    expect(tabsSecond.panelHidden).toStrictEqual([true, false, true])
    expect(tabsFirst.currentIndex).toBe(0)
    expect(tabsFirst.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsFirst.tabIndexes).toStrictEqual([0, -1, -1])
    expect(tabsFirst.panelSelected).toStrictEqual(['true', 'false', null])
    expect(tabsFirst.panelHidden).toStrictEqual([false, true, true])
  })

  test('should show current panel on tab press without index', async ({ page }) => {
    const tabsInstance = await page.evaluateHandle(() => document.querySelector('#tabs') as Tabs)

    await page.evaluate(tabs => {
      tabs.tabs[1]?.removeAttribute('data-tab-index')
    }, tabsInstance)

    await page.getByTestId('tabs-tab-2').click()
    await page.waitForFunction(() => { // Wait for first tab activated - current index fallback
      return window.testTabsActivated?.tab.id === 'tabs-tab-1'
    })

    const tabsFallback = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    expect(tabsFallback.currentIndex).toBe(0)
    expect(tabsFallback.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsFallback.tabIndexes).toStrictEqual([0, -1, -1])
    expect(tabsFallback.panelSelected).toStrictEqual(['true', null, null])
    expect(tabsFallback.panelHidden).toStrictEqual([false, true, true])
  })

  test('should show corresponding horizontal panel on left or right arrow key press', async ({ page }) => {
    const tabsInstance = await page.evaluateHandle(() => document.querySelector('#tabs') as Tabs)

    await page.getByTestId('tabs-tab-1').focus()
    await page.keyboard.press('ArrowUp') // Ignored - vertical key
    await page.keyboard.press('ArrowDown') // Ignored - vertical key

    const tabsIgnore = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(() => { // Wait for second tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-2'
    })

    const tabsRight = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowRight')
    await page.waitForFunction(() => { // Wait for third tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-3'
    })

    await page.keyboard.press('ArrowRight') // Past last tab wraps to first
    await page.waitForFunction(() => { // Wait for first tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-1'
    })

    const tabsRightWrap = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowLeft') // Before first tab wraps to last
    await page.waitForFunction(() => { // Wait for third tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-3'
    })

    const tabsLeftWrap = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowLeft')
    await page.waitForFunction(() => { // Wait for second tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-2'
    })

    const tabsLeft = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    expect(tabsIgnore.currentIndex).toBe(0)
    expect(tabsIgnore.focusIndex).toBe(0)
    expect(tabsIgnore.panelHidden).toStrictEqual([false, true, true])
    expect(tabsRight.currentIndex).toBe(1)
    expect(tabsRight.focusIndex).toBe(1)
    expect(tabsRight.selected).toStrictEqual(['false', 'true', 'false'])
    expect(tabsRight.tabIndexes).toStrictEqual([-1, 0, -1])
    expect(tabsRight.panelHidden).toStrictEqual([true, false, true])
    expect(tabsRightWrap.currentIndex).toBe(0)
    expect(tabsRightWrap.focusIndex).toBe(0)
    expect(tabsRightWrap.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsRightWrap.panelHidden).toStrictEqual([false, true, true])
    expect(tabsLeftWrap.currentIndex).toBe(2)
    expect(tabsLeftWrap.focusIndex).toBe(2)
    expect(tabsLeftWrap.selected).toStrictEqual(['false', 'false', 'true'])
    expect(tabsLeftWrap.panelHidden).toStrictEqual([true, true, false])
    expect(tabsLeft.currentIndex).toBe(1)
    expect(tabsLeft.focusIndex).toBe(1)
    expect(tabsLeft.selected).toStrictEqual(['false', 'true', 'false'])
    expect(tabsLeft.panelHidden).toStrictEqual([true, false, true])
  })

  test('should show corresponding vertical panel on up or down arrow key press', async ({ page }) => {
    const tabsInstance = await page.evaluateHandle(() => document.querySelector('#tabs-vertical') as Tabs)

    await page.getByTestId('tabs-vertical-tab-1').focus()
    await page.keyboard.press('ArrowLeft') // Ignored - horizontal key
    await page.keyboard.press('ArrowRight') // Ignored - horizontal key

    const tabsIgnore = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowDown')
    await page.waitForFunction(() => { // Wait for second tab activated
      return window.testTabsActivated?.tab.id === 'tabs-vertical-tab-2'
    })

    const tabsDown = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowDown')
    await page.waitForFunction(() => { // Wait for third tab activated
      return window.testTabsActivated?.tab.id === 'tabs-vertical-tab-3'
    })

    await page.keyboard.press('ArrowDown') // Past last tab wraps to first
    await page.waitForFunction(() => { // Wait for first tab activated
      return window.testTabsActivated?.tab.id === 'tabs-vertical-tab-1'
    })

    const tabsDownWrap = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowUp') // Before first tab wraps to last
    await page.waitForFunction(() => { // Wait for third tab activated
      return window.testTabsActivated?.tab.id === 'tabs-vertical-tab-3'
    })

    const tabsUpWrap = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    await page.keyboard.press('ArrowUp')
    await page.waitForFunction(() => { // Wait for second tab activated
      return window.testTabsActivated?.tab.id === 'tabs-vertical-tab-2'
    })

    const tabsUp = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    expect(tabsIgnore.currentIndex).toBe(0)
    expect(tabsIgnore.focusIndex).toBe(0)
    expect(tabsIgnore.panelHidden).toStrictEqual([false, true, true])
    expect(tabsDown.currentIndex).toBe(1)
    expect(tabsDown.focusIndex).toBe(1)
    expect(tabsDown.selected).toStrictEqual(['false', 'true', 'false'])
    expect(tabsDown.tabIndexes).toStrictEqual([-1, 0, -1])
    expect(tabsDown.panelHidden).toStrictEqual([true, false, true])
    expect(tabsDownWrap.currentIndex).toBe(0)
    expect(tabsDownWrap.focusIndex).toBe(0)
    expect(tabsDownWrap.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsDownWrap.panelHidden).toStrictEqual([false, true, true])
    expect(tabsUpWrap.currentIndex).toBe(2)
    expect(tabsUpWrap.focusIndex).toBe(2)
    expect(tabsUpWrap.selected).toStrictEqual(['false', 'false', 'true'])
    expect(tabsUpWrap.panelHidden).toStrictEqual([true, true, false])
    expect(tabsUp.currentIndex).toBe(1)
    expect(tabsUp.focusIndex).toBe(1)
    expect(tabsUp.selected).toStrictEqual(['false', 'true', 'false'])
    expect(tabsUp.panelHidden).toStrictEqual([true, false, true])
  })

  test('should show first panel on home key press', async ({ page }) => {
    await page.getByTestId('tabs-tab-3').focus()
    await page.keyboard.press('Home')
    await page.waitForFunction(() => { // Wait for first tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-1'
    })

    const tabsHome = await page.evaluate(() => {
      const tabs = document.querySelector('#tabs') as Tabs

      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    })

    expect(tabsHome.currentIndex).toBe(0)
    expect(tabsHome.focusIndex).toBe(0)
    expect(tabsHome.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsHome.tabIndexes).toStrictEqual([0, -1, -1])
    expect(tabsHome.panelSelected).toStrictEqual(['true', null, null])
    expect(tabsHome.panelHidden).toStrictEqual([false, true, true])
  })

  test('should show last panel on end key press', async ({ page }) => {
    await page.getByTestId('tabs-tab-1').focus()
    await page.keyboard.press('End')
    await page.waitForFunction(() => { // Wait for third tab activated
      return window.testTabsActivated?.tab.id === 'tabs-tab-3'
    })

    const tabsEnd = await page.evaluate(() => {
      const tabs = document.querySelector('#tabs') as Tabs

      return {
        currentIndex: tabs.currentIndex,
        focusIndex: tabs.tabs.indexOf(document.activeElement as HTMLElement),
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    })

    expect(tabsEnd.currentIndex).toBe(2)
    expect(tabsEnd.focusIndex).toBe(2)
    expect(tabsEnd.selected).toStrictEqual(['false', 'false', 'true'])
    expect(tabsEnd.tabIndexes).toStrictEqual([-1, -1, 0])
    expect(tabsEnd.panelSelected).toStrictEqual(['false', null, 'true'])
    expect(tabsEnd.panelHidden).toStrictEqual([true, true, false])
  })

  test('should show panel corresponding with anchor tab hash', async ({ page }) => {
    const tabsNoHash = await page.evaluate(() => {
      const tabs = document.querySelector('#tabs-anchor') as Tabs

      return {
        currentIndex: tabs.currentIndex,
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    })

    // Query differs so hash is not a same document navigation
    await page.goto('/spec/objects/Tabs/__tests__/Tabs.html?anchor#panel-anchor-2')

    const tabsInstance = await page.evaluateHandle(() => document.querySelector('#tabs-anchor') as Tabs)

    await page.waitForFunction(tabs => { // Wait for second panel
      return tabs.panels[1]?.hidden === false
    }, tabsInstance)

    const tabsHash = await page.evaluate(tabs => {
      return {
        currentIndex: tabs.currentIndex,
        selected: tabs.tabs.map(tab => tab.ariaSelected),
        tabIndexes: tabs.tabs.map(tab => tab.tabIndex),
        panelSelected: tabs.panels.map(panel => panel.getAttribute('data-tabs-selected')),
        panelHidden: tabs.panels.map(panel => panel.hidden)
      }
    }, tabsInstance)

    expect(tabsNoHash.currentIndex).toBe(0)
    expect(tabsNoHash.selected).toStrictEqual(['true', 'false', 'false'])
    expect(tabsNoHash.panelHidden).toStrictEqual([false, true, true])
    expect(tabsHash.currentIndex).toBe(1)
    expect(tabsHash.selected).toStrictEqual(['false', 'true', 'false'])
    expect(tabsHash.tabIndexes).toStrictEqual([-1, 0, -1])
    expect(tabsHash.panelSelected).toStrictEqual([null, 'true', null])
    expect(tabsHash.panelHidden).toStrictEqual([true, false, true])
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const tabsProps = await page.evaluate(async () => {
      const tabs = document.querySelector('#tabs') as Tabs
      const [firstTab, secondTab] = tabs.tabs
      const [firstPanel, secondPanel] = tabs.panels

      tabs.remove()

      await Promise.resolve()

      secondTab?.click()
      secondTab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }))
      secondTab?.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowRight' }))

      return {
        init: tabs.init,
        tabs: tabs.tabs,
        panels: tabs.panels,
        selected: [firstTab?.ariaSelected, secondTab?.ariaSelected],
        hidden: [firstPanel?.hidden, secondPanel?.hidden]
      }
    })

    expect(tabsProps.init).toBe(false)
    expect(tabsProps.tabs).toStrictEqual([])
    expect(tabsProps.panels).toStrictEqual([])
    expect(tabsProps.selected).toStrictEqual(['true', 'false'])
    expect(tabsProps.hidden).toStrictEqual([false, true])
  })
})
