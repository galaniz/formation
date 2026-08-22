/**
 * Objects - Collapsible Test
 */

import type { Collapsible } from '../Collapsible.js'
import type { CollapsibleActionArgs } from '../CollapsibleTypes.js'
import { test, expect } from '@playwright/test'
import { doCoverage } from '@alanizcreative/formation-coverage/coverage.js'

/* Types */

declare global {
  interface Window {
    testCollapsibleToggle: string[]
  }
}

/* Tests */

test.describe('Collapsible', () => {
  /* Test page and coverage */

  test.beforeEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, true)

    await page.addInitScript(() => {
      window.testCollapsibleToggle = []

      /* Listen on document so recording does not depend on when the elements init */

      document.addEventListener('collapsible:toggle', (e: Event) => {
        const { id } = e.target as HTMLElement
        window.testCollapsibleToggle.push(id)
      }, true)
    })

    await page.goto('/spec/objects/Collapsible/__tests__/Collapsible.html')
  })

  test.afterEach(async ({ browserName, page }) => {
    await doCoverage(browserName, page, false)
  })

  /* Test init */

  test('should initialize if contains required elements', async ({ page }) => {
    const clpInit = await page.evaluate(() => {
      const clps: Collapsible[] = Array.from(document.querySelectorAll('frm-collapsible'))
      return clps.map(collapsible => collapsible.init)
    })

    expect(clpInit).toStrictEqual([
      false, // #clp-empty
      true,  // #clp-single
      true,  // #clp-hover
      true,  // #clp-accordion-1
      true,  // #clp-accordion-2
      true,  // #clp-accordion-3
      true   // #clp-action
    ])
  })

  test('should move instance and not reinitialize', async ({ page }) => {
    const clpProps = await page.evaluate(async () => {
      const clp = document.querySelector('#clp-single') as Collapsible

      clp.parentElement?.insertAdjacentElement('beforeend', clp)

      await Promise.resolve()

      return {
        init: clp.init,
        expanded: clp.expanded,
        duration: clp.duration,
        toggleTag: clp.toggle?.tagName,
        panelTag: clp.panel?.tagName
      }
    })

    expect(clpProps.init).toBe(true)
    expect(clpProps.expanded).toBe(true)
    expect(clpProps.duration).toBe(200)
    expect(clpProps.toggleTag).toBe('BUTTON')
    expect(clpProps.panelTag).toBe('DIV')
  })

  /* Test single */

  test('should close and open single collapsible', async ({ page }) => {
    const clpInstance = await page.evaluateHandle(() => document.querySelector('#clp-single') as Collapsible)

    const clpInit = await page.evaluate(clp => {
      return {
        expanded: clp.expanded,
        duration: clp.duration
      }
    }, clpInstance)

    await page.getByTestId('clp-single-toggle').click()
    await page.waitForFunction(clp => { // Wait for close
      return !clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpClose = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    await page.getByTestId('clp-single-toggle').click()
    await page.waitForFunction(clp => { // Wait for open
      return clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpOpen = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    const clpEvents = await page.evaluate(() => {
      return {
        toggle: window.testCollapsibleToggle
      }
    })

    expect(clpInit.expanded).toBe(true)
    expect(clpInit.duration).toBe(200)
    expect(clpClose.ariaExpanded).toStrictEqual(['false', 'false'])
    expect(clpClose.expanded).toStrictEqual([false, 'false'])
    expect(clpOpen.ariaExpanded).toStrictEqual(['true', 'true'])
    expect(clpOpen.expanded).toStrictEqual([true, 'true'])
    expect(clpEvents.toggle).toStrictEqual(['clp-single', 'clp-single'])
  })

  /* Test hover */

  test('should open and close hoverable collapsible', async ({ page }) => {
    const clpInstance = await page.evaluateHandle(() => document.querySelector('#clp-hover') as Collapsible)

    const clpInit = await page.evaluate(clp => {
      return {
        expanded: clp.expanded,
        duration: clp.duration
      }
    }, clpInstance)

    await page.getByTestId('clp-hover').hover() // Mouse enter
    await page.waitForFunction(clp => { // Wait for open
      return clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpOpen = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    await page.getByTestId('clp-single-toggle').hover() // Mouse leave
    await page.waitForFunction(clp => { // Wait for close
      return !clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpClose = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    const clpEvents = await page.evaluate(() => {
      return {
        toggle: window.testCollapsibleToggle
      }
    })

    expect(clpInit.expanded).toBe(false)
    expect(clpInit.duration).toBe(300)
    expect(clpOpen.ariaExpanded).toStrictEqual(['true', 'true'])
    expect(clpOpen.expanded).toStrictEqual([true, 'true'])
    expect(clpClose.ariaExpanded).toStrictEqual(['false', 'false'])
    expect(clpClose.expanded).toStrictEqual([false, 'false'])
    expect(clpEvents.toggle).toStrictEqual(['clp-hover', 'clp-hover'])
  })

  test('should open and close hoverable collapsible via keyboard', async ({ page }) => {
    const clpInstance = await page.evaluateHandle(() => document.querySelector('#clp-hover') as Collapsible)

    const clpInit = await page.evaluate(clp => {
      return {
        expanded: clp.expanded,
        duration: clp.duration
      }
    }, clpInstance)

    await page.getByTestId('clp-hover-toggle').focus() // Focus
    await page.keyboard.press('Enter')
    await page.waitForFunction(clp => { // Wait for open
      return clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpOpen = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    await page.keyboard.press('Tab')
    await page.waitForFunction(clp => { // Wait for close
      return !clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpClose = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    const clpEvents = await page.evaluate(() => {
      return {
        toggle: window.testCollapsibleToggle
      }
    })

    expect(clpInit.expanded).toBe(false)
    expect(clpInit.duration).toBe(300)
    expect(clpOpen.ariaExpanded).toStrictEqual(['true', 'true'])
    expect(clpOpen.expanded).toStrictEqual([true, 'true'])
    expect(clpClose.ariaExpanded).toStrictEqual(['false', 'false'])
    expect(clpClose.expanded).toStrictEqual([false, 'false'])
    expect(clpEvents.toggle).toStrictEqual(['clp-hover', 'clp-hover'])
  })

  /* Test accordion */

  test('should open and close accordion collapsibles', async ({ page }) => {
    const clp1Instance = await page.evaluateHandle(() => document.querySelector('#clp-accordion-1') as Collapsible)
    const clp2Instance = await page.evaluateHandle(() => document.querySelector('#clp-accordion-2') as Collapsible)
    const clp3Instance = await page.evaluateHandle(() => document.querySelector('#clp-accordion-3') as Collapsible)

    const clpInit = await page.evaluate(({ clp1, clp2, clp3 }) => {
      return {
        expanded: [
          clp1.expanded,
          clp2.expanded,
          clp3.expanded
        ]
      }
    }, { clp1: clp1Instance, clp2: clp2Instance, clp3: clp3Instance })

    await page.getByTestId('clp-accordion-1-toggle').click()
    await page.waitForFunction(clp1 => { // Wait for 1 open
      return clp1.expanded && clp1.style.getPropertyValue('--clp-height') === 'auto'
    }, clp1Instance)

    const clp1Open = await page.evaluate(({ clp1, clp2, clp3 }) => {
      return {
        ariaExpanded: [
          [
            clp1.toggle?.ariaExpanded,
            clp1.toggle?.getAttribute('aria-expanded')
          ],
          [
            clp2.toggle?.ariaExpanded,
            clp2.toggle?.getAttribute('aria-expanded')
          ],
          [
            clp3.toggle?.ariaExpanded,
            clp3.toggle?.getAttribute('aria-expanded')
          ]
        ],
        expanded: [
          [
            clp1.expanded,
            clp1.getAttribute('expanded')
          ],
          [
            clp2.expanded,
            clp2.getAttribute('expanded')
          ],
          [
            clp3.expanded,
            clp3.getAttribute('expanded')
          ]
        ]
      }
    }, { clp1: clp1Instance, clp2: clp2Instance, clp3: clp3Instance })

    await page.getByTestId('clp-accordion-2-toggle').click()
    await page.waitForFunction(clp2 => { // Wait for 2 open
      return clp2.expanded && clp2.style.getPropertyValue('--clp-height') === 'auto'
    }, clp2Instance)

    const clp2Open = await page.evaluate(({ clp1, clp2, clp3 }) => {
      return {
        ariaExpanded: [
          [
            clp1.toggle?.ariaExpanded,
            clp1.toggle?.getAttribute('aria-expanded')
          ],
          [
            clp2.toggle?.ariaExpanded,
            clp2.toggle?.getAttribute('aria-expanded')
          ],
          [
            clp3.toggle?.ariaExpanded,
            clp3.toggle?.getAttribute('aria-expanded')
          ]
        ],
        expanded: [
          [
            clp1.expanded,
            clp1.getAttribute('expanded')
          ],
          [
            clp2.expanded,
            clp2.getAttribute('expanded')
          ],
          [
            clp3.expanded,
            clp3.getAttribute('expanded')
          ]
        ]
      }
    }, { clp1: clp1Instance, clp2: clp2Instance, clp3: clp3Instance })

    await page.getByTestId('clp-accordion-3-toggle').click()
    await page.waitForFunction(clp3 => { // Wait for 3 open
      return clp3.expanded && clp3.style.getPropertyValue('--clp-height') === 'auto'
    }, clp3Instance)

    const clp3Open = await page.evaluate(({ clp1, clp2, clp3 }) => {
      return {
        ariaExpanded: [
          [
            clp1.toggle?.ariaExpanded,
            clp1.toggle?.getAttribute('aria-expanded')
          ],
          [
            clp2.toggle?.ariaExpanded,
            clp2.toggle?.getAttribute('aria-expanded')
          ],
          [
            clp3.toggle?.ariaExpanded,
            clp3.toggle?.getAttribute('aria-expanded')
          ]
        ],
        expanded: [
          [
            clp1.expanded,
            clp1.getAttribute('expanded')
          ],
          [
            clp2.expanded,
            clp2.getAttribute('expanded')
          ],
          [
            clp3.expanded,
            clp3.getAttribute('expanded')
          ]
        ]
      }
    }, { clp1: clp1Instance, clp2: clp2Instance, clp3: clp3Instance })

    const clpEvents = await page.evaluate(() => {
      return {
        toggle: window.testCollapsibleToggle
      }
    })

    expect(clpInit.expanded).toStrictEqual([false, false, false])
    expect(clpEvents.toggle).toStrictEqual([
      'clp-accordion-1',
      'clp-accordion-2',
      'clp-accordion-1',
      'clp-accordion-3',
      'clp-accordion-2'
    ])

    expect(clp1Open.ariaExpanded).toStrictEqual([
      ['true', 'true'],
      [null, null],
      [null, null]
    ])

    expect(clp1Open.expanded).toStrictEqual([
      [true, 'true'],
      [false, null],
      [false, null]
    ])

    expect(clp2Open.ariaExpanded).toStrictEqual([
      ['false', 'false'],
      ['true', 'true'],
      [null, null]
    ])

    expect(clp2Open.expanded).toStrictEqual([
      [false, 'false'],
      [true, 'true'],
      [false, null]
    ])

    expect(clp3Open.ariaExpanded).toStrictEqual([
      ['false', 'false'],
      ['false', 'false'],
      ['true', 'true']
    ])

    expect(clp3Open.expanded).toStrictEqual([
      [false, 'false'],
      [false, 'false'],
      [true, 'true']
    ])
  })

  /* Test action */

  test('should open and close collapsible with action', async ({ page }) => {
    const clpInstance = await page.evaluateHandle(() => document.querySelector('#clp-action') as Collapsible)

    const clpInit = await page.evaluate(clp => {
      return {
        expanded: clp.expanded
      }
    }, clpInstance)

    await page.waitForFunction(async clp => { // Wait for open
      const { doActions } = await import('../../../actions/actions.js')

      doActions('collapsible:action', { expanded: true })

      return clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpOpen = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    await page.waitForFunction(async clp => { // Wait for close
      const { doActions } = await import('../../../actions/actions.js')

      doActions('collapsible:action', { expanded: false })

      return !clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpClose = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    await page.evaluate(async () => { // Test different state required
      const { doActions } = await import('../../../actions/actions.js')

      doActions('collapsible:action', { expanded: false })
    })

    const clpEvents = await page.evaluate(() => {
      return {
        toggle: window.testCollapsibleToggle
      }
    })

    expect(clpInit.expanded).toBe(false)
    expect(clpOpen.ariaExpanded).toStrictEqual(['true', 'true'])
    expect(clpOpen.expanded).toStrictEqual([true, 'true'])
    expect(clpClose.ariaExpanded).toStrictEqual(['false', 'false'])
    expect(clpClose.expanded).toStrictEqual([false, 'false'])
    expect(clpEvents.toggle).toStrictEqual(['clp-action', 'clp-action'])
  })

  test('should open collapsible with hover via action', async ({ page }) => {
    const clpInstance = await page.evaluateHandle(() => document.querySelector('#clp-action') as Collapsible)

    const clpInit = await page.evaluate(clp => {
      return {
        expanded: clp.expanded,
        hoverable: clp.hoverable
      }
    }, clpInstance)

    await page.waitForFunction(async clp => { // Wait for hoverable
      const { doActions } = await import('../../../actions/actions.js')
      const args: CollapsibleActionArgs = { hoverable: true }

      doActions('collapsible:action', args)

      return clp.hoverable
    }, clpInstance)

    await page.getByTestId('clp-action-toggle').hover() // Mouse enter
    await page.waitForFunction(clp => { // Wait for open
      return clp.expanded && clp.style.getPropertyValue('--clp-height') === 'auto'
    }, clpInstance)

    const clpEnter = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    await page.waitForFunction(async clp => { // Wait for hoverable
      const { doActions } = await import('../../../actions/actions.js')
      const args: CollapsibleActionArgs = { hoverable: false }

      doActions('collapsible:action', args)

      return clp.hoverable
    }, clpInstance)

    await page.getByTestId('clp-single-toggle').hover() // Mouse leave

    const clpLeave = await page.evaluate(clp => {
      return {
        ariaExpanded: [
          clp.toggle?.ariaExpanded,
          clp.toggle?.getAttribute('aria-expanded')
        ],
        expanded: [
          clp.expanded,
          clp.getAttribute('expanded')
        ]
      }
    }, clpInstance)

    const clpEvents = await page.evaluate(() => {
      return {
        toggle: window.testCollapsibleToggle
      }
    })

    expect(clpInit.expanded).toBe(false)
    expect(clpInit.hoverable).toBe(false)
    expect(clpEnter.ariaExpanded).toStrictEqual(['true', 'true'])
    expect(clpEnter.expanded).toStrictEqual([true, 'true'])
    expect(clpLeave.ariaExpanded).toStrictEqual(['true', 'true'])
    expect(clpLeave.expanded).toStrictEqual([true, 'true'])
    expect(clpEvents.toggle).toStrictEqual(['clp-action'])
  })

  /* Test clean up */

  test('should remove accordion, action and hoverable instances and event listeners', async ({ page }) => {
    const clpProps = await page.evaluate(async () => {
      const { actions } = await import('../../../actions/actions.js')

      const clpAccordion = document.querySelector('#clp-accordion-1') as Collapsible
      const clpAction = document.querySelector('#clp-action') as Collapsible
      const clpHover = document.querySelector('#clp-hover') as Collapsible
      const accordion = 'collapsible:accordion:one'
      const action = 'collapsible:action'

      clpAccordion.remove()
      clpAction.remove()
      clpHover.remove()

      await Promise.resolve()

      clpAccordion.toggle?.click()
      clpAction.toggle?.click()
      clpHover.dispatchEvent(
        new MouseEvent('mouseenter', { bubbles: true })
      )

      return {
        init: [
          clpAccordion.init,
          clpAction.init,
          clpHover.init
        ],
        expanded: [
          clpAccordion.expanded,
          clpAction.expanded,
          clpHover.expanded
        ],
        toggle: [
          clpAccordion.toggle,
          clpAction.toggle,
          clpHover.toggle
        ],
        panel: [
          clpAccordion.panel,
          clpAction.panel,
          clpHover.panel
        ],
        toggleCount: window.testCollapsibleToggle.length,
        actionsRemoved:
          actions.get(accordion)?.size === 2 && actions.get(action)?.size === 0
      }
    })

    expect(clpProps.init).toStrictEqual([false, false, false])
    expect(clpProps.expanded).toStrictEqual([false, false, false])
    expect(clpProps.toggle).toStrictEqual([null, null, null])
    expect(clpProps.panel).toStrictEqual([null, null, null])
    expect(clpProps.toggleCount).toBe(0)
    expect(clpProps.actionsRemoved).toBe(true)
  })
})
