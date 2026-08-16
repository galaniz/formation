/**
 * Objects - Modal Test
 */

import type { Modal } from '../Modal.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testModalToggle: string[]
  }
}

/* Tests */

test.describe('Modal', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testModalToggle = []

      /* Listen on document so recording does not depend on when the elements init */

      document.addEventListener('modal:toggle', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testModalToggle.push(id)
      }, true)
    })

    await page.goto('/spec/objects/Modal/__tests__/Modal.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const modInit = await page.evaluate(() => {
      const mods: Modal[] = Array.from(document.querySelectorAll('frm-modal'))
      return mods.map(mod => mod.init)
    })

    expect(modInit).toStrictEqual([
      false, // #mod-empty
      false, // #mod-invalid-opens
      false, // #mod-no-closes
      true   // #mod
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const modProps = await page.evaluate(async () => {
      const mod = document.querySelector('#mod') as Modal

      mod.parentElement?.insertAdjacentElement('beforeend', mod)

      await Promise.resolve()

      return {
        init: mod.init,
        open: mod.open,
        opensIds: mod.opens.map(open => open.id),
        closesIds: mod.closes.map(close => close.id)
      }
    })

    expect(modProps.init).toBe(true)
    expect(modProps.open).toBe(false)
    expect(modProps.opensIds).toStrictEqual(['mod-open-1', 'mod-open-2'])
    expect(modProps.closesIds).toStrictEqual(['mod-overlay', 'mod-close'])
  })

  /* Test open */

  test('should open modal, focus first focusable and disable outside', async ({ page }) => {
    const modBefore = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        scroll: document.documentElement.dataset.scroll
      }
    })

    await page.getByTestId('mod-open-1').click()
    await expect(page.getByTestId('mod-link')).toBeFocused()

    const modOpen = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal
      const open1 = document.querySelector('#mod-open-1') as HTMLButtonElement
      const open2 = document.querySelector('#mod-open-2') as HTMLButtonElement

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        inert: [
          open1.inert,
          open2.inert
        ],
        scroll: document.documentElement.dataset.scroll,
        toggle: window.testModalToggle
      }
    })

    expect(modBefore.open).toStrictEqual([false, null])
    expect(modBefore.scroll).toBeUndefined()
    expect(modOpen.open).toStrictEqual([true, 'true'])
    expect(modOpen.inert).toStrictEqual([true, true])
    expect(modOpen.scroll).toBe('off')
    expect(modOpen.toggle).toStrictEqual(['mod'])
  })

  /* Test close */

  test('should close modal, restore focus and enable outside', async ({ page }) => {
    const opens = page.getByTestId('mod-open-1')

    await opens.click()
    await page.waitForFunction(() => { // Wait for open focus delay
      return document.activeElement?.id === 'mod-link'
    })

    await page.getByTestId('mod-close').click()
    await expect(opens).toBeFocused()

    const modClose = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal
      const open1 = document.querySelector('#mod-open-1') as HTMLButtonElement
      const open2 = document.querySelector('#mod-open-2') as HTMLButtonElement

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        inert: [
          open1.inert,
          open2.inert
        ],
        scroll: document.documentElement.dataset.scroll,
        toggle: window.testModalToggle
      }
    })

    expect(modClose.open).toStrictEqual([false, 'false'])
    expect(modClose.inert).toStrictEqual([false, false])
    expect(modClose.scroll).toBeUndefined()
    expect(modClose.toggle).toStrictEqual(['mod', 'mod'])
  })

  test('should close modal on overlay click', async ({ page }) => {
    const opens = page.getByTestId('mod-open-1')

    await opens.click()
    await page.waitForFunction(() => { // Wait for open focus delay
      return document.activeElement?.id === 'mod-link'
    })

    await page.getByTestId('mod-overlay-close').click()
    await expect(opens).toBeFocused()

    const modClose = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal
      const open1 = document.querySelector('#mod-open-1') as HTMLButtonElement

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        inert: open1.inert,
        scroll: document.documentElement.dataset.scroll,
        toggle: window.testModalToggle
      }
    })

    expect(modClose.open).toStrictEqual([false, 'false'])
    expect(modClose.inert).toBe(false)
    expect(modClose.scroll).toBeUndefined()
    expect(modClose.toggle).toStrictEqual(['mod', 'mod'])
  })

  test('should restore focus to last open button used', async ({ page }) => {
    const opens = page.getByTestId('mod-open-2')

    await opens.click()
    await page.waitForFunction(() => { // Wait for open focus delay
      return document.activeElement?.id === 'mod-link'
    })

    await page.getByTestId('mod-close').click()
    await expect(opens).toBeFocused()

    const modClose = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        toggle: window.testModalToggle
      }
    })

    expect(modClose.open).toStrictEqual([false, 'false'])
    expect(modClose.toggle).toStrictEqual(['mod', 'mod'])
  })

  /* Test escape */

  test('should close modal on escape key', async ({ page }) => {
    const opens = page.getByTestId('mod-open-1')

    await opens.click()
    await page.waitForFunction(() => { // Wait for open focus delay
      return document.activeElement?.id === 'mod-link'
    })

    await page.keyboard.press('Escape')
    await expect(opens).toBeFocused()

    const modClose = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal
      const open1 = document.querySelector('#mod-open-1') as HTMLButtonElement

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        inert: open1.inert,
        scroll: document.documentElement.dataset.scroll,
        toggle: window.testModalToggle
      }
    })

    expect(modClose.open).toStrictEqual([false, 'false'])
    expect(modClose.inert).toBe(false)
    expect(modClose.scroll).toBeUndefined()
    expect(modClose.toggle).toStrictEqual(['mod', 'mod'])
  })

  test('should ignore escape key if modal closed', async ({ page }) => {
    await page.keyboard.press('Escape')

    const modProps = await page.evaluate(() => {
      const mod = document.querySelector('#mod') as Modal

      return {
        open: [
          mod.open,
          mod.getAttribute('open')
        ],
        scroll: document.documentElement.dataset.scroll,
        toggle: window.testModalToggle
      }
    })

    expect(modProps.open).toStrictEqual([false, null])
    expect(modProps.scroll).toBeUndefined()
    expect(modProps.toggle).toStrictEqual([])
  })

  /* Test clean up */

  test('should remove instance and event listeners', async ({ page }) => {
    const modProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const mod = document.querySelector('#mod') as Modal
      const open1 = document.querySelector('#mod-open-1') as HTMLButtonElement
      const close = document.querySelector('#mod-close') as HTMLButtonElement
      const escapeActionsCount = actions.get('escape')?.size || 1

      mod.remove()

      await Promise.resolve()

      open1.click()
      close.click()

      return {
        init: mod.init,
        opensCount: mod.opens.length,
        closesCount: mod.closes.length,
        toggleCount: window.testModalToggle.length,
        actionsRemoved: actions.get('escape')?.size === escapeActionsCount - 1
      }
    })

    expect(modProps.init).toBe(false)
    expect(modProps.opensCount).toBe(0)
    expect(modProps.closesCount).toBe(0)
    expect(modProps.toggleCount).toBe(0)
    expect(modProps.actionsRemoved).toBe(true)
  })
})
