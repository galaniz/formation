/**
 * Objects - Tabs
 */

/* Imports */

import type { TabsActivateArgs, TabsIndexArgs, TabsEventDetail, TabsDirection } from './TabsTypes.js'
import { getItem } from '../../utils/item/item.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { getKey } from '../../utils/key/key.js'

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
 * Display tabs and corresponding panels with click and keyboard navigation
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
   * Delay before focusing panels
   *
   * @type {number}
   */
  focusDelay: number = 0

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
   * Base or derived class name
   *
   * @type {string}
   */
  #className: string = 'tabs'

  /**
   * Tab elements indexes
   *
   * @type {Map<HTMLElement, number>}
   */
  #indexes: Map<HTMLElement, number> = new Map()

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
   * Id for focus delay timeout
   *
   * @private
   * @type {number}
   */
  #focusDelayId: number = 0

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
   * Init - each time added to DOM
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up - each time removed from DOM
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Remove event listeners */

    this.tabs.forEach(tab => {
      tab.removeEventListener('click', this.#clickHandler)
      tab.removeEventListener('keydown', this.#keyDownHandler)
      tab.removeEventListener('keyup', this.#keyUpHandler)
    })

    /* Empty/nullify props */

    this.tabs = []
    this.panels = []
    this.init = false
    this.#indexes.clear()

    /* Clear timeouts */

    clearTimeout(this.#delayId)
    clearTimeout(this.#focusDelayId)
  }

  /**
   * Initialize - check required items exist and activate
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

    /* Set item props */

    this.tabs = tabs
    this.panels = panels

    /* End index */

    this.#endIndex = tabs.length - 1

    /* Class name */

    this.#className = this.constructor.name.toLowerCase()

    /* Set delay if it exists */

    const delay = this.getAttribute('delay')

    if (isStringStrict(delay)) {
      const delayValue = parseInt(delay, 10)

      if (isNumber(delayValue)) {
        this.delay = delayValue
      }
    }

    /* Set direction if it exists */

    const direction = this.getAttribute('direction')

    if (direction === 'horizontal' || direction === 'vertical') {
      this.direction = direction
    }

    /* Window hash to set current */

    const hash = window.location.hash

    /* Set current and add event listeners */

    let current = 0

    this.tabs.forEach((tab, i) => {
      tab.addEventListener('click', this.#clickHandler)
      tab.addEventListener('keydown', this.#keyDownHandler)
      tab.addEventListener('keyup', this.#keyUpHandler)

      this.#indexes.set(tab, i)

      const selected = tab.ariaSelected

      if (selected === 'true') {
        current = i
      }

      if (isHtmlElement(tab, HTMLAnchorElement) && tab.hash === hash) {
        current = i
      }
    })

    this.currentIndex = current

    /* Go to current */

    if (this.#className === 'tabs') {
      return this.activate({
        current,
        focus: false,
        source: 'init'
      })
    }

    /* Init successful */

    return true
  }

  /**
   * Filter indexes on activation
   *
   * @param {TabsIndexArgs} args
   * @return {TabsIndexArgs}
   */
  getIndexes (args: TabsIndexArgs): TabsIndexArgs {
    return args
  }

  /**
   * Hide, show and focus panels and tabs
   *
   * @param {TabsActivateArgs} args
   * @return {boolean}
   */
  activate (args: TabsActivateArgs): boolean {
    /* Clear timeouts */

    clearTimeout(this.#delayId)
    clearTimeout(this.#focusDelayId)

    /* Set args */

    const {
      current = 0,
      focus = true,
      source = ''
    } = args

    const lastIdx = this.currentIndex
    const endIdx = this.#endIndex
    const currentIdx = current > endIdx ? endIdx : current

    this.currentIndex = currentIdx

    const {
      currentIndex = currentIdx,
      lastIndex = lastIdx,
      panelIndex = currentIdx,
      lastPanelIndex = lastIdx,
      endIndex = endIdx
    } = this.getIndexes({
      currentIndex: current,
      lastIndex: lastIdx,
      panelIndex: current,
      lastPanelIndex: lastIdx,
      endIndex: endIdx,
      focus,
      source
    })

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

    const type = this.#className
    const displayType = type === 'tabs' ? 'hidden' : 'aria-hidden'

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
      focus,
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

    /* Deactivate last panel */

    lastPanel.dataset[`${type}Selected`] = 'false'
    this.dispatchEvent(onDeactivate)

    /* Activate current tab */

    tab.tabIndex = 0
    tab.ariaSelected = 'true'

    /* Activate current panel */

    panel.dataset[`${type}Selected`] = 'true'
    this.dispatchEvent(onActivate)

    this.#delayId = window.setTimeout(() => {
      if (displayType === 'hidden') {
        lastPanel.hidden = true
        panel.hidden = false
      } else {
        lastPanel.ariaHidden = 'true'
        panel.ariaHidden = 'false'
      }

      if (focus) {
        this.#focusDelayId = window.setTimeout(() => {
          panel.focus()
          this.dispatchEvent(onActivated)
        }, this.focusDelay)
      } else {
        this.dispatchEvent(onActivated)
      }
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

    const index = this.#indexes.get(target)

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
    if (index < 0) {
      index = this.#endIndex
    }

    if (index > this.#endIndex) {
      index = 0
    }

    const tab = this.tabs[index]

    if (!isHtmlElement(tab)) {
      return
    }

    tab.focus()
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
