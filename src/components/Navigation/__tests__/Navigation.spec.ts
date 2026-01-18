/**
 * Components - Navigation Test
 */

/* Imports */

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
    testNavResize: boolean
  }
}

/* Tests */

test.describe('Navigation', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testNavReset = []
      window.testNavResetted = []
      window.testNavSet = []
      window.testNavToggle = []
      window.testNavToggled = []
      window.testNavResize = false

      requestAnimationFrame(() => {
        const ids = [
          'nav-empty',
          'nav-slot',
          'nav-slots',
          'nav-slots-breakpoint',
          'nav-slots-groups',
          'nav-slots-groups-breakpoints'
        ]

        ids.forEach(id => {
          const nav = document.getElementById(id)

          if (!nav) {
            return
          }

          nav.addEventListener('nav:reset', (e) => {
            window.testNavReset.push((e.target as HTMLElement).id)
          })

          nav.addEventListener('nav:resetted', (e) => {
            window.testNavResetted.push((e.target as HTMLElement).id)
          })

          nav.addEventListener('nav:set', (e) => {
            window.testNavSet.push((e.target as HTMLElement).id)
          })

          nav.addEventListener('nav:toggle', (e) => {
            window.testNavToggle.push((e.target as HTMLElement).id)
          })

          nav.addEventListener('nav:toggled', (e) => {
            window.testNavToggled.push((e.target as HTMLElement).id)
          })
        })
      })
    })

    await page.goto('/spec/components/Navigation/__tests__/Navigation.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)

    await page.addInitScript(() => {
      window.testNavReset = []
      window.testNavResetted = []
      window.testNavSet = []
      window.testNavToggle = []
      window.testNavToggled = []
      window.testNavResize = false
    })
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

    const navEvents = await page.evaluate(() => {
      return {
        reset: window.testNavReset,
        resetted: window.testNavResetted,
        set: window.testNavSet,
        toggle: window.testNavToggle,
        toggled: window.testNavToggled
      }
    })

    const expectedIds = [
      'nav-slot',
      'nav-slots',
      'nav-slots-breakpoint',
      'nav-slots-groups',
      'nav-slots-groups-breakpoints'
    ]

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
        itemsLen: nav.items.length,
        modalRole: nav.modal?.role,
        modalSlotsSize: nav.modalSlots.size,
        breakpoints: Array.from(nav.breakpoints.keys()).join(','),
        opensPopup: nav.opens?.ariaHasPopup,
        closesLen: nav.closes.length
      }
    })

    expect(navProps.init).toBe(true)
    expect(navProps.slotsSize).toBe(1)
    expect(navProps.itemsLen).toBe(6)
    expect(navProps.modalRole).toBe('dialog')
    expect(navProps.modalSlotsSize).toBe(1)
    expect(navProps.breakpoints).toBe('0')
    expect(navProps.opensPopup).toBe('true')
    expect(navProps.closesLen).toBe(1)
  })

  /* Test resize */

  test('should move some items into modal slots if 960px viewport', async ({ page }) => {
    await page.setViewportSize({
      width: 960,
      height: 960
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slots-groups-breakpoints').length === 2
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

  test('should move all items into modal slots if 640px viewport', async ({ page }) => {
    await page.setViewportSize({
      width: 640,
      height: 640
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slots-groups-breakpoints').length === 2
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
    await page.evaluate(async () => {
      const { onResize } = await import('../../../actions/actionResize.js')

      onResize(() => {
        window.testNavResize = true
      })
    })

    const viewport = page.viewportSize() as { width: number, height: number }

    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height - 100
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavResize
    })

    const navEvents = await page.evaluate(() => {
      return {
        reset: window.testNavReset,
        resetted: window.testNavResetted,
        set: window.testNavSet
      }
    })

    const expectedIds = [
      'nav-slot',
      'nav-slots',
      'nav-slots-breakpoint',
      'nav-slots-groups',
      'nav-slots-groups-breakpoints'
    ]

    expect(navEvents.reset).toStrictEqual([...expectedIds])
    expect(navEvents.resetted).toStrictEqual([...expectedIds])
    expect(navEvents.set).toStrictEqual([...expectedIds])
  })

  test('should not overflow if slots undefined', async ({ page }) => {
    await page.evaluate(() => {
      const nav = document.querySelector('#nav-slot') as Navigation
      nav.slots.clear()
    })

    await page.setViewportSize({
      width: 640,
      height: 640
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slot').length === 2
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
    await page.setViewportSize({
      width: 640,
      height: 640
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slot').length === 2
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

    const navEvents = await page.evaluate(() => {
      return {
        reset: window.testNavReset,
        resetted: window.testNavResetted,
        set: window.testNavSet,
        toggle: window.testNavToggle,
        toggled: window.testNavToggled
      }
    })

    const expectedIds = [
      'nav-slot',
      'nav-slots',
      'nav-slots-breakpoint',
      'nav-slots-groups',
      'nav-slots-groups-breakpoints'
    ]

    expect(navOpen.show).toBe(true)
    expect(navOpen.open).toBe('true')
    expect(navOpen.showModal).toBe('items')
    expect(navOpen.lastActive).toBe('Close')
    expect(navClose.show).toBe(false)
    expect(navClose.open).toBe('false')
    expect(navClose.showModal).toBe(false)
    expect(navClose.lastActive).toBe('Open')
    expect(navEvents.reset).toStrictEqual([...expectedIds, ...expectedIds]) // Twice for init and resize
    expect(navEvents.resetted).toStrictEqual([...expectedIds, ...expectedIds]) // Twice for init and resize
    expect(navEvents.set).toStrictEqual([...expectedIds, ...expectedIds]) // Twice for init and resize
    expect(navEvents.toggle).toStrictEqual(['nav-slot', 'nav-slot']) // Twice for resize and click
    expect(navEvents.toggled).toStrictEqual(['nav-slot'])
  })

  test('should close modal on escape', async ({ page }) => {
    await page.setViewportSize({
      width: 640,
      height: 640
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slots').length === 2
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
    await page.setViewportSize({
      width: 640,
      height: 640
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slot').length === 2
    })

    await page.getByTestId('nav-slot-open').click()
    await page.waitForFunction(() => { // Wait for open
      const nav = document.querySelector('#nav-slot') as Navigation
      return nav.getAttribute('show-modal') === 'items'
    })

    await page.setViewportSize({
      width: 1280,
      height: 1280
    })

    await page.waitForFunction(() => { // Wait for resize
      return window.testNavSet.filter(id => id === 'nav-slot').length === 3
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
      const resizeActionsLen = actions.get('resize')?.size || 1
      const escapeActionsLen = actions.get('escape')?.size || 1

      nav.remove()

      await Promise.resolve()

      nav.opens?.click()
      nav.closes[0]?.click()

      return {
        init: nav.init,
        slotsSize: nav.slots.size,
        itemsLen: nav.items.length,
        modal: nav.modal,
        modalSlotsSize: nav.modalSlots.size,
        breakpointsSize: nav.breakpoints.size,
        opens: nav.opens,
        closesLen: nav.closes.length,
        toggleLen: window.testNavToggle.length,
        actionsRemoved:
          actions.get('resize')?.size === resizeActionsLen - 1 && actions.get('escape')?.size === escapeActionsLen - 1
      }
    })

    expect(navProps.init).toBe(false)
    expect(navProps.slotsSize).toBe(0)
    expect(navProps.itemsLen).toBe(0)
    expect(navProps.modal).toBe(null)
    expect(navProps.modalSlotsSize).toBe(0)
    expect(navProps.breakpointsSize).toBe(0)
    expect(navProps.opens).toBe(null)
    expect(navProps.closesLen).toBe(0)
    expect(navProps.toggleLen).toBe(0)
    expect(navProps.actionsRemoved).toBe(true)
  })
})
