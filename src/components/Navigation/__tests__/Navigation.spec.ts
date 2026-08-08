/**
 * Components - Navigation Test
 */

import type { Navigation } from '../Navigation.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testNavReset: string[]
    testNavResetted: string[]
    testNavSet: string[]
    testNavToggle: string[]
    testNavToggled: string[]
    testNavResize: number
  }
}

/* Ids of navs that emit events on init */

const expectedIds = [
  'nav-slot',
  'nav-slots',
  'nav-slots-breakpoint',
  'nav-slots-groups',
  'nav-slots-groups-breakpoints'
]

/* Ids of all navs on test page */

const navIds = [
  'nav-empty',
  ...expectedIds
]

/* Tests */

test.describe('Navigation', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript((ids: string[]) => {
      window.testNavReset = []
      window.testNavResetted = []
      window.testNavSet = []
      window.testNavToggle = []
      window.testNavToggled = []
      window.testNavResize = 0

      /* Listen on document so recording does not depend on when the elements init */

      const idSet = new Set(ids)

      const listen = (type: string, store: () => string[]): void => {
        document.addEventListener(type, (e: Event) => {
          const { id } = e.target as HTMLElement

          if (!idSet.has(id)) {
            return
          }

          store().push(id)
        }, true)
      }

      listen('nav:reset', () => window.testNavReset)
      listen('nav:resetted', () => window.testNavResetted)
      listen('nav:set', () => window.testNavSet)
      listen('nav:toggle', () => window.testNavToggle)
      listen('nav:toggled', () => window.testNavToggled)
    }, navIds)

    await page.goto('/spec/components/Navigation/__tests__/Navigation.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should not initialize if missing required elements', async ({ page }) => {
    const navInit = await page.evaluate(() => {
      const nav = document.querySelector('#nav-empty') as Navigation
      return nav.init
    })

    expect(navInit).toBe(false)
  })

  test('should initialize if contains required elements and emit set events', async ({ page }) => {
    const navInit = await page.evaluate(() => {
      const navs: Navigation[] = Array.from(document.querySelectorAll('frm-navigation'))
      return navs.map(nav => nav.init)
    })

    await page.waitForFunction((count: number) => { // Wait for set
      return window.testNavSet.length >= count
    }, expectedIds.length)

    const navEvents = await page.evaluate((count: number) => {
      return {
        reset: window.testNavReset.slice(0, count),
        resetted: window.testNavResetted.slice(0, count),
        set: window.testNavSet.slice(0, count),
        toggle: window.testNavToggle,
        toggled: window.testNavToggled
      }
    }, expectedIds.length)

    expect(navInit).toStrictEqual([
      false, // #nav-empty
      true,  // #nav-slot
      true,  // #nav-slots
      true,  // #nav-slots-breakpoint
      true,  // #nav-slots-groups
      true   // #nav-slots-groups-breakpoints
    ])

    expect(navEvents.reset).toStrictEqual(expectedIds)
    expect(navEvents.resetted).toStrictEqual(expectedIds)
    expect(navEvents.set).toStrictEqual(expectedIds)
    expect(navEvents.toggle).toStrictEqual([])
    expect(navEvents.toggled).toStrictEqual([])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const navProps = await page.evaluate(async () => {
      const nav = document.querySelector('#nav-slot') as Navigation

      nav.parentElement?.insertAdjacentElement('beforeend', nav)

      await Promise.resolve()

      return {
        init: nav.init,
        slotsSize: nav.slots.size,
        itemsCount: nav.items.length,
        modalRole: nav.modal?.role,
        modalSlotsSize: nav.modalSlots.size,
        breakpoints: Array.from(nav.breakpoints.keys()).join(','),
        closesCount: nav.closes.length
      }
    })

    expect(navProps.init).toBe(true)
    expect(navProps.slotsSize).toBe(1)
    expect(navProps.itemsCount).toBe(6)
    expect(navProps.modalRole).toBe('dialog')
    expect(navProps.modalSlotsSize).toBe(1)
    expect(navProps.breakpoints).toBe('0')
    expect(navProps.closesCount).toBe(1)
  })

  /* Test resize */

  test('should move some items into modal slots if 900px viewport', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 900,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    const navSlots = await page.evaluate(() => {
      const navGroups = document.querySelector('#nav-slots-groups-breakpoints') as Navigation

      return {
        groupsOne: navGroups.slots.get('one')?.children.length,
        groupsTwo: navGroups.slots.get('two')?.children.length,
        groupsModalOne: navGroups.modalSlots.get('one')?.children.length,
        groupsModalTwo: navGroups.modalSlots.get('two')?.children.length
      }
    })

    const {
      groupsOne,
      groupsTwo,
      groupsModalOne,
      groupsModalTwo
    } = navSlots

    expect(groupsOne).toBe(6)
    expect(groupsTwo).toBe(0)
    expect(groupsModalOne).toBe(0)
    expect(groupsModalTwo).toBe(5)
  })

  test('should move all items into modal slots if 600px viewport', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    const navSlots = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slots-breakpoint') as Navigation
      const navGroups = document.querySelector('#nav-slots-groups-breakpoints') as Navigation

      return {
        one: nav.slots.get('one')?.children.length,
        two: nav.slots.get('two')?.children.length,
        modalOne: nav.modalSlots.get('one')?.children.length,
        modalTwo: nav.modalSlots.get('two')?.children.length,
        groupsOne: navGroups.slots.get('one')?.children.length,
        groupsTwo: navGroups.slots.get('two')?.children.length,
        groupsModalOne: navGroups.modalSlots.get('one')?.children.length,
        groupsModalTwo: navGroups.modalSlots.get('two')?.children.length
      }
    })

    const {
      one,
      two,
      modalOne,
      modalTwo,
      groupsOne,
      groupsTwo,
      groupsModalOne,
      groupsModalTwo
    } = navSlots

    expect(one).toBe(0)
    expect(two).toBe(0)
    expect(modalOne).toBe(6)
    expect(modalTwo).toBe(4)
    expect(groupsOne).toBe(0)
    expect(groupsTwo).toBe(0)
    expect(groupsModalOne).toBe(6)
    expect(groupsModalTwo).toBe(5)
  })

  test('should not reset if viewport height change', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }
    const width = viewport.width - 1 // Must differ to fire resize

    /**
     * Mobile emulation reports an unstable innerWidth while the page loads, so
     * the width navs record on init can be stale and read as a width change on
     * the next resize - resize the width first so only the height changes below.
     */

    await page.setViewportSize({
      width,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    const navEventsBefore = await page.evaluate(() => {
      return {
        reset: window.testNavReset.length,
        resetted: window.testNavResetted.length,
        set: window.testNavSet.length,
        resize: window.testNavResize
      }
    })

    await page.setViewportSize({
      width,
      height: viewport.height - 100
    })

    await page.waitForFunction((count: number) => { // Wait for resize
      return window.testNavResize > count
    }, navEventsBefore.resize)

    const navEvents = await page.evaluate(() => {
      return {
        reset: window.testNavReset.length,
        resetted: window.testNavResetted.length,
        set: window.testNavSet.length
      }
    })

    expect(navEventsBefore.set).toBeGreaterThanOrEqual(expectedIds.length) // Events recorded
    expect(navEvents.reset).toBe(navEventsBefore.reset) // No new events
    expect(navEvents.resetted).toBe(navEventsBefore.resetted)
    expect(navEvents.set).toBe(navEventsBefore.set)
  })

  test('should not overflow if slots undefined', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    await page.evaluate(() => {
      const nav = document.querySelector('#nav-slot') as Navigation
      nav.slots.clear()
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    const navProps = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slot') as Navigation

      return {
        overflow: nav.overflow,
        overflowAttr: nav.getAttribute('overflow')
      }
    })

    expect(navProps.overflow).toBe(false)
    expect(navProps.overflowAttr).toBe('false')
  })

  /* Test modal */

  test('should open and close modal', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    const navEventsBefore = await page.evaluate(() => { // Events before resize
      return {
        reset: window.testNavReset.length,
        resetted: window.testNavResetted.length,
        set: window.testNavSet.length
      }
    })

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    await page.getByTestId('nav-slot-open').click()
    await page.waitForFunction(() => { // Wait for open
      const nav = document.querySelector('#nav-slot') as Navigation
      return nav.getAttribute('show-modal') === 'items'
    })

    const navOpen = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slot') as Navigation

      return {
        show: nav.hasAttribute('show'),
        open: nav.getAttribute('open'),
        showModal: nav.getAttribute('show-modal'),
        lastActive: document.activeElement?.textContent.trim()
      }
    })

    await page.getByTestId('nav-slot-close').click()
    await page.waitForFunction(() => { // Wait for close
      return window.testNavToggled.filter(id => id === 'nav-slot').length === 1
    })

    const navClose = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slot') as Navigation

      return {
        show: nav.hasAttribute('show'),
        open: nav.getAttribute('open'),
        showModal: nav.hasAttribute('show-modal'),
        lastActive: document.activeElement?.textContent.trim()
      }
    })

    const navEvents = await page.evaluate((before: typeof navEventsBefore) => { // Events since resize
      return {
        reset: window.testNavReset.slice(before.reset),
        resetted: window.testNavResetted.slice(before.resetted),
        set: window.testNavSet.slice(before.set),
        toggle: window.testNavToggle,
        toggled: window.testNavToggled
      }
    }, navEventsBefore)

    expect(navOpen.show).toBe(true)
    expect(navOpen.open).toBe('true')
    expect(navOpen.showModal).toBe('items')
    expect(navOpen.lastActive).toBe('Close')
    expect(navClose.show).toBe(false)
    expect(navClose.open).toBe('false')
    expect(navClose.showModal).toBe(false)
    expect(navClose.lastActive).toBe('Open')
    expect(navEvents.reset).toStrictEqual(expectedIds) // Once for resize
    expect(navEvents.resetted).toStrictEqual(expectedIds) // Once for resize
    expect(navEvents.set).toStrictEqual(expectedIds) // Once for resize
    expect(navEvents.toggle).toStrictEqual(['nav-slot', 'nav-slot']) // Twice for open and close click
    expect(navEvents.toggled).toStrictEqual(['nav-slot'])
  })

  test('should close modal on escape', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    await page.getByTestId('nav-slots-open').click()
    await page.waitForFunction(() => { // Wait for open
      const nav = document.querySelector('#nav-slots') as Navigation
      return nav.getAttribute('show-modal') === 'items'
    })

    await page.keyboard.press('Escape')
    await page.waitForFunction(() => { // Wait for close
      return window.testNavToggled.filter(id => id === 'nav-slots').length === 1
    })

    const navClose = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slots') as Navigation

      return {
        show: nav.hasAttribute('show'),
        open: nav.getAttribute('open'),
        showModal: nav.hasAttribute('show-modal'),
        lastActive: document.activeElement?.textContent.trim()
      }
    })

    expect(navClose.show).toBe(false)
    expect(navClose.open).toBe('false')
    expect(navClose.showModal).toBe(false)
    expect(navClose.lastActive).toBe('Open')
  })

  test('should close modal on resize', async ({ page }) => {
    await page.evaluate(async () => { // Resize flag
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize += 1
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 600,
      height: viewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    await page.getByTestId('nav-slot-open').click()
    await page.waitForFunction(() => { // Wait for open
      const nav = document.querySelector('#nav-slot') as Navigation
      return nav.getAttribute('show-modal') === 'items'
    })

    const newViewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: 1280,
      height: newViewport.height
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    await page.waitForFunction(() => { // Wait for close
      return window.testNavToggled.filter(id => id === 'nav-slot').length === 1
    })

    const navProps = await page.evaluate(() => {
      const nav = document.querySelector('#nav-slot') as Navigation

      return {
        slot: nav.slots.get('0')?.children.length,
        modalSlot: nav.modalSlots.get('0')?.children.length,
        show: nav.hasAttribute('show'),
        open: nav.getAttribute('open'),
        showModal: nav.hasAttribute('show-modal'),
        lastActive: document.activeElement?.tagName
      }
    })

    const {
      slot,
      modalSlot,
      show,
      open,
      showModal,
      lastActive
    } = navProps

    expect(slot).toBe(6)
    expect(modalSlot).toBe(0)
    expect(show).toBe(false)
    expect(open).toBe('false')
    expect(showModal).toBe(false)
    expect(lastActive).toBe('BODY')
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const navProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const nav = document.querySelector('#nav-slot') as Navigation
      const resizeActionsCount = actions.get('resize')?.size || 1
      const escapeActionsCount = actions.get('escape')?.size || 1

      nav.remove()

      await Promise.resolve()

      nav.opens?.click()
      nav.closes[0]?.click()

      return {
        init: nav.init,
        slotsSize: nav.slots.size,
        itemsCount: nav.items.length,
        modal: nav.modal,
        modalSlotsSize: nav.modalSlots.size,
        breakpointsSize: nav.breakpoints.size,
        opens: nav.opens,
        closesCount: nav.closes.length,
        toggleCount: window.testNavToggle.length,
        actionsRemoved:
          actions.get('resize')?.size === resizeActionsCount - 1 && actions.get('escape')?.size === escapeActionsCount - 1
      }
    })

    expect(navProps.init).toBe(false)
    expect(navProps.slotsSize).toBe(0)
    expect(navProps.itemsCount).toBe(0)
    expect(navProps.modal).toBe(null)
    expect(navProps.modalSlotsSize).toBe(0)
    expect(navProps.breakpointsSize).toBe(0)
    expect(navProps.opens).toBe(null)
    expect(navProps.closesCount).toBe(0)
    expect(navProps.toggleCount).toBe(0)
    expect(navProps.actionsRemoved).toBe(true)
  })
})
