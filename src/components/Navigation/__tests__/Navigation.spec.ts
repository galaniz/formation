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

  /* Test resize */

  test('should move some items into modal slots if 900px viewport', async ({ page }) => {
    await page.setViewportSize({
      width: 900,
      height: 900
    })

    await page.waitForTimeout(200)

    const navSlots = await page.evaluate(() => {
      const navGroups: Navigation | null = document.querySelector('#nav-slots-groups-breakpoints')

      return {
        groupsOne: navGroups?.slots.get('one')?.children.length,
        groupsTwo: navGroups?.slots.get('two')?.children.length,
        groupsModalOne: navGroups?.modalSlots.get('one')?.children.length,
        groupsModalTwo: navGroups?.modalSlots.get('two')?.children.length
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
    await page.setViewportSize({
      width: 600,
      height: 600
    })

    await page.waitForTimeout(200)

    const navSlots = await page.evaluate(() => {
      const nav: Navigation | null = document.querySelector('#nav-slots-breakpoint')
      const navGroups: Navigation | null = document.querySelector('#nav-slots-groups-breakpoints')

      return {
        one: nav?.slots.get('one')?.children.length,
        two: nav?.slots.get('two')?.children.length,
        modalOne: nav?.modalSlots.get('one')?.children.length,
        modalTwo: nav?.modalSlots.get('two')?.children.length,
        groupsOne: navGroups?.slots.get('one')?.children.length,
        groupsTwo: navGroups?.slots.get('two')?.children.length,
        groupsModalOne: navGroups?.modalSlots.get('one')?.children.length,
        groupsModalTwo: navGroups?.modalSlots.get('two')?.children.length
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

  /* Test modal */

  test('should open and close modal', async ({ page }) => {
    await page.setViewportSize({
      width: 600,
      height: 600
    })

    await page.waitForTimeout(200)
    await page.getByTestId('nav-slot-open').click()
    await page.waitForTimeout(300)

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
    await page.waitForTimeout(400)

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
    expect(navEvents.toggle).toStrictEqual(['nav-slot', 'nav-slot'])
    expect(navEvents.toggled).toStrictEqual(['nav-slot'])
  })
})
