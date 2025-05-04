/**
 * Objects - Tabs
 */

/* Imports */

import type { TabsActivateArgs, TabsIndexesFilterArgs, TabsEventDetail, TabsDirection } from './TabsTypes.js'
import { getItem } from '../../utils/item/item.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { getKey } from '../../utils/key/key.js'
import { applyFilters } from '../../utils/filter/filter.js'

/**
 * Custom event details
 */
declare global {
  interface ElementEventMap {
    'tabs:deactivate': CustomEvent<TabsEventDetail>
    'tabs:activate': CustomEvent<TabsEventDetail>
    'tabs:activated': CustomEvent<TabsEventDetail>
  }
}

/**
 * Handles display of tabs and corresponding panels
 */
class Tabs extends HTMLElement {
  /**
   * Tab elements
   *
   * @type {HTMLElement[]}
   */
  tabs: HTMLElement[] = []

  /**
   * Panel elements
   *
   * @type {HTMLElement[]}
   */
  panels: HTMLElement[] = []

  /**
   * Delay before displaying panel
   *
   * @type {number}
   */
  delay: number = 0

  /**
   * Layout for keyboard navigation
   *
   * @type {TabsDirection}
   */
  direction: TabsDirection = 'horizontal'

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Current tab index
   *
   * @type {number}
   */
  currentIndex: number = 0

  /**
   * Distinguish from derived classes
   *
   * @type {boolean}
   */
  #isTabs: boolean = false

  /**
   * Final tab/panel element index
   *
   * @private
   * @type {number}
   */
  #endIndex: number = 0

  /**
   * Id for delay timeout
   *
   * @private
   * @type {number}
   */
  #delayId: number = 0

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #clickHandler = this.#click.bind(this)
  #keyDownHandler = this.#keyDown.bind(this)
  #keyUpHandler = this.#keyUp.bind(this)

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up after removed from DOM
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Clear event listeners */

    this.tabs.forEach(tab => {
      tab.removeEventListener('click', this.#clickHandler)
      tab.removeEventListener('keydown', this.#keyDownHandler)
      tab.removeEventListener('keyup', this.#keyUpHandler)
    })

    /* Empty props */

    this.tabs = []
    this.panels = []
    this.init = false

    /* Clear timeouts */

    clearTimeout(this.#delayId)
  }

  /**
   * Init check required items exist and activate
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const tabs = getItem(['[role="tab"]'], this)
    const panels = getItem(['[role="tabpanel"]'], this)

    /* Check required items exist */

    if (!isHtmlElementArray(tabs) || !isHtmlElementArray(panels)) {
      return false
    }

    /* Element props */

    this.tabs = tabs
    this.panels = panels

    /* End index */

    this.#endIndex = tabs.length - 1

    /* Tabs class */

    this.#isTabs = this.constructor.name.toLowerCase() === 'tabs'

    /* Delay if it exists */

    const delay = this.getAttribute('delay')

    if (isStringStrict(delay)) {
      const delayValue = parseInt(delay, 10)

      if (isNumber(delayValue)) {
        this.delay = delayValue
      }
    }

    /* Direction if it exists */

    const direction = this.getAttribute('direction')

    if (direction === 'horizontal' || direction === 'vertical') {
      this.direction = direction
    }

    /* Window hash to set current */

    const hash = window.location.hash

    /* Current and event listeners */

    let current = 0

    this.tabs.forEach((tab, i) => {
      tab.addEventListener('click', this.#clickHandler)
      tab.addEventListener('keydown', this.#keyDownHandler)
      tab.addEventListener('keyup', this.#keyUpHandler)

      tab.dataset.tabIndex = i.toString()

      const selected = tab.ariaSelected === 'true'

      if (selected) {
        current = i
      }

      tab.tabIndex = selected ? 0 : -1

      if (isHtmlElement(tab, HTMLAnchorElement) && tab.hash === hash) {
        current = i
      }
    })

    this.currentIndex = current

    /* Go to current */

    if (this.#isTabs) {
      return this.activate({
        current,
        source: 'init'
      })
    }

    /* Init successful */

    return true
  }

  /**
   * Hide and show panels and tabs
   *
   * @param {TabsActivateArgs} args
   * @return {boolean}
   */
  activate (args: TabsActivateArgs): boolean {
    /* Clear timeouts */

    clearTimeout(this.#delayId)

    /* Args */

    const {
      current = 0,
      raw = current,
      source = ''
    } = args

    const lastIdx = this.currentIndex
    const endIdx = this.#endIndex
    const indexes: TabsIndexesFilterArgs = {
      rawIndex: raw,
      currentIndex: current,
      lastIndex: lastIdx,
      panelIndex: current,
      lastPanelIndex: lastIdx,
      endIndex: endIdx,
      source
    }

    const {
      currentIndex,
      lastIndex,
      panelIndex,
      lastPanelIndex,
      endIndex = endIdx
    } = applyFilters(`tabs:indexes:${this.id}`, indexes)

    this.currentIndex = currentIndex
    this.#endIndex = endIndex

    /* Elements */

    const lastTab = this.tabs[lastIndex]
    const lastPanel = this.panels[lastPanelIndex]
    const tab = this.tabs[currentIndex]
    const panel = this.panels[panelIndex]

    if (
      !isHtmlElement(lastTab) ||
      !isHtmlElement(lastPanel) ||
      !isHtmlElement(tab) ||
      !isHtmlElement(panel)
    ) {
      return false
    }

    /* Type */

    const isTabs = this.#isTabs

    /* Args to pass to events */

    const detail: TabsEventDetail = {
      currentIndex,
      lastIndex,
      panelIndex,
      lastPanelIndex,
      endIndex,
      panel,
      lastPanel,
      tab,
      lastTab,
      source
    }

    const details = { detail }

    /* Events */

    const onDeactivate = new CustomEvent('tabs:deactivate', details)
    const onActivate = new CustomEvent('tabs:activate', details)
    const onActivated = new CustomEvent('tabs:activated', details)

    /* Deactivate last tab */

    lastTab.tabIndex = -1
    lastTab.ariaSelected = 'false'
    lastPanel.removeAttribute('tabindex')

    /* Deactivate last panel */

    if (isTabs) {
      lastPanel.dataset.tabsSelected = 'false'
    }

    this.dispatchEvent(onDeactivate)

    /* Activate current tab */

    tab.tabIndex = 0
    tab.ariaSelected = 'true'
    panel.tabIndex = 0

    /* Activate current panel */

    if (isTabs) {
      panel.dataset.tabsSelected = 'true'
    }

    this.dispatchEvent(onActivate)

    this.#delayId = window.setTimeout(() => {
      if (isTabs) {
        lastPanel.hidden = true
        panel.hidden = false
      }

      this.dispatchEvent(onActivated)
    }, this.delay)

    return true
  }

  /**
   * Index from tab attribute
   *
   * @private
   * @param {Event} e
   * @return {number}
   */
  #getIndex (e: Event): number {
    const target = e.currentTarget
    const fallback = this.currentIndex

    if (!isHtmlElement(target)) {
      return fallback
    }

    const index = parseInt(target.dataset.tabIndex || '', 10)

    if (!isNumber(index)) {
      return fallback
    }

    return index
  }

  /**
   * Focus tab at specified index
   *
   * @private
   * @param {number} index
   * @return {void}
   */
  #focusTab (index: number): void {
    let newIndex = index

    if (index < 0) {
      newIndex = this.#endIndex
    }

    if (index > this.#endIndex) {
      newIndex = 0
    }

    const tab = this.tabs[newIndex]

    tab?.focus()

    this.activate({
      current: newIndex,
      raw: index,
      source: 'click'
    })
  }

  /**
   * Click handler on tab to display panel
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #click (e: Event): void {
    this.activate({
      current: this.#getIndex(e),
      source: 'click'
    })
  }

  /**
   * Key down handler on tab to change focus depending on key
   *
   * @private
   * @param {KeyboardEvent} e
   * @return {void}
   */
  #keyDown (e: KeyboardEvent): void {
    let index = this.#getIndex(e)

    switch (getKey(e)) {
      case 'END': // Last tab
        e.preventDefault()
        index = this.#endIndex
        break
      case 'HOME': // First tab
        e.preventDefault()
        index = 0
        break
      case 'UP': // Previous vertical tab
        if (this.direction === 'horizontal') {
          return
        }

        e.preventDefault()
        index -= 1
        break
      case 'DOWN': // Next vertical tab
        if (this.direction === 'horizontal') {
          return
        }

        e.preventDefault()
        index += 1
        break
      default:
        return
    }

    this.#focusTab(index)
  }

  /**
   * Key up handler on tab to change focus depending on key
   *
   * @private
   * @param {KeyboardEvent} e
   * @return {void}
   */
  #keyUp (e: KeyboardEvent): void {
    let index = this.#getIndex(e)

    switch (getKey(e)) {
      case 'LEFT': // Previous horizontal tab
        if (this.direction === 'vertical') {
          return
        }

        index -= 1
        break
      case 'RIGHT': // Next horizontal tab
        if (this.direction === 'vertical') {
          return
        }

        index += 1
        break
      default:
        return
    }

    this.#focusTab(index)
  }
}

/* Exports */

export { Tabs }
