/**
 * Objects - Slider
 */

/* Imports */

import type { SliderAnimRef } from './SliderTypes.js'
import type { TabsEventDetail, TabsIndexesFilterArgs } from '../Tabs/TabsTypes.js'
import type { ActionResizeArgs } from '../../actions/actionsTypes.js'
import { Tabs } from '../Tabs/Tabs.js'
import { getItem } from '../../items/items.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { onResize, removeResize } from '../../actions/actionResize.js'
import { addFilter, removeFilter } from '../../filters/filters.js'
import { config } from '../../config/config.js'
import { sliderScrollTo } from './sliderUtils.js'

/**
 * Handles scroll based slider with multiple items in panels.
 */
class SliderGroup extends Tabs {
  /**
   * Scrollable container element.
   *
   * @type {HTMLElement|null}
   */
  track: HTMLElement | null = null

  /**
   * Elements within panels.
   *
   * @type {HTMLElement[]}
   */
  items: HTMLElement[] = []

  /**
   * Previous navigation button element.
   *
   * @type {HTMLButtonElement|null}
   */
  prev: HTMLButtonElement | null = null

  /**
   * Next navigation button element.
   *
   * @type {HTMLButtonElement|null}
   */
  next: HTMLButtonElement | null = null

  /**
   * Transition duration on scroll (tab or button click).
   *
   * @type {number}
   */
  duration: number = 500

  /**
   * Number of visible items and panels by breakpoint.
   *
   * @type {Set<Record<string, number>>}
   */
  breakpoints: Set<Record<'low' | 'high' | 'items' | 'panels', number>> = new Set()

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  subInit: boolean = false

  /**
   * Panels parent element.
   *
   * @private
   * @type {HTMLElement|null}
   */
  #insert: HTMLElement | null = null

  /**
   * Last panels index.
   *
   * @private
   * @type {number}
   */
  #endIndex: number = 0

  /**
   * Scroll to animation ID.
   *
   * @private
   * @type {SliderAnimRef}
   */
  #animRef: SliderAnimRef = { id: 0 }

  /**
   * Scroll listener timeout ID.
   *
   * @private
   * @type {number}
   */
  #scrollId: number = 0

  /**
   * Left panel offsets to scroll to.
   *
   * @private
   * @type {number[]}
   */
  #leftOffsets: number[] = []

  /**
   * Viewport width to check breakpoint(s).
   *
   * @private
   * @type {number}
   */
  #viewportWidth: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #deactivateHandler = this.#deactivate.bind(this)
  #activateHandler = this.#activate.bind(this)
  #activatedHandler = this.#activated.bind(this)
  #indexesHandler = this.#indexes.bind(this)
  #prevHandler = this.#prev.bind(this)
  #nextHandler = this.#next.bind(this)
  #scrollHandler = this.#scroll.bind(this)
  #resizeHandler = this.#resize.bind(this)

  /**
   * Create new instance.
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM.
   */
  override connectedCallback (): void {
    /* Inherit */

    super.connectedCallback()

    /* Event listeners */

    this.addEventListener('tabs:deactivate', this.#deactivateHandler)
    this.addEventListener('tabs:activate', this.#activateHandler)
    this.addEventListener('tabs:activated', this.#activatedHandler)

    /* Filters */

    addFilter(`tabs:indexes:${this.id}`, this.#indexesHandler)

    /* Initialize */

    this.subInit = this.#initialize()
  }

  /**
   * Clean up after removed from DOM.
   */
  override async disconnectedCallback (): Promise<void> {
    /* Inherit */

    await super.disconnectedCallback()

    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.subInit) {
      return
    }

    /* Clear event listeners */

    this.removeEventListener('tabs:deactivate', this.#deactivateHandler)
    this.removeEventListener('tabs:activate', this.#activateHandler)
    this.removeEventListener('tabs:activated', this.#activatedHandler)

    this.track?.removeEventListener('scroll', this.#scrollHandler)
    this.prev?.removeEventListener('click', this.#prevHandler)
    this.next?.removeEventListener('click', this.#nextHandler)

    removeResize(this.#resizeHandler)

    /* Remove filters */

    removeFilter(`tabs:indexes:${this.id}`, this.#indexesHandler)

    /* Empty props */

    this.track = null
    this.items = []
    this.prev = null
    this.next = null
    this.breakpoints = new Set()
    this.subInit = false
    this.#insert = null

    /* Clear timeout and animation */

    clearTimeout(this.#scrollId)
    cancelAnimationFrame(this.#animRef.id)
  }

  /**
   * Init check required items, set props and activate.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const track = getItem('[data-slider-track]', this)
    const items = getItem(['[data-slider-item]'], this)
    const prev = getItem('[data-slider-prev]', this)
    const next = getItem('[data-slider-next]', this)
    const [firstPanel] = this.panels
    const insert = firstPanel?.parentElement

    /* Check required items exist */

    if (!isHtmlElement(track) || !isHtmlElement(insert) || !isHtmlElementArray(items)) {
      return false
    }

    /* Element props */

    this.track = track
    this.#insert = insert

    if (isHtmlElementArray(items)) {
      this.items = items
    }

    /* Delays */

    this.delay = this.duration + 100

    /* Event listeners */

    const viewportWidth = onResize(this.#resizeHandler)

    if (isHtmlElement(next, HTMLButtonElement) && isHtmlElement(prev, HTMLButtonElement)) {
      this.next = next
      this.prev = prev
      this.prev.addEventListener('click', this.#prevHandler)
      this.next.addEventListener('click', this.#nextHandler)
    }

    /* Breakpoints required */

    const { fontSizeMultiplier } = config

    const breakpoints = this.getAttribute('breakpoints')
    const visible = this.getAttribute('visible')

    if (isStringStrict(breakpoints) && isStringStrict(visible)) {
      const breakpointsArr = breakpoints.split(',')
      const visibleArr = visible.split(',')
      const panelsCount = this.panels.length

      breakpointsArr.forEach((b, i) => {
        const v = visibleArr[i]

        if (!isStringStrict(v)) {
          return
        }

        const low = parseInt(b, 10)
        const items = parseInt(v, 10)

        if (!isNumber(low) || !isNumber(items)) {
          return
        }

        const next = breakpointsArr[i + 1]
        const high = !isStringStrict(next) ? 99999 : parseInt(next, 10)

        if (!isNumber(high)) {
          return
        }

        this.breakpoints.add({
          low: low * fontSizeMultiplier,
          high: high * fontSizeMultiplier,
          items,
          panels: Math.ceil(panelsCount / items)
        })
      })
    }

    if (!this.breakpoints.size) {
      return false
    }

    /* Last group */

    this.#endIndex = this.panels.length - 1

    /* Current */

    let current = this.currentIndex

    /* Dimension properties */

    this.#setDimensions(viewportWidth)

    /* Cap current */

    if (current > this.#endIndex) {
      current = this.#endIndex
    }

    /* Activate current */

    const init = this.activate({
      current,
      source: 'init'
    })

    /* Init successful */

    return init
  }

  /**
   * Offsets and viewport width.
   *
   * @private
   * @param {number} viewportWidth
   * @return {void}
   */
  #setDimensions (viewportWidth: number): void {
    /* Viewport width */

    this.#viewportWidth = viewportWidth

    /* Track width and offset */

    let offset = 0

    if (isHtmlElement(this.track)) {
      const left = getComputedStyle(this.track).getPropertyValue('scroll-padding-left')
      const leftNum = parseInt(left, 10)

      offset = isNumber(leftNum) ? leftNum : 0
    }

    /* Shift items to different panels */

    this.#moveGroups()

    /* Reset offsets */

    this.#leftOffsets = []

    this.panels.forEach((panel, i) => {
      if (i > this.#endIndex) {
        return
      }

      this.#leftOffsets.push(panel.offsetLeft - offset)
    })
  }

  /**
   * Filter indexes, update track scroll listener and button states.
   *
   * @param {TabsIndexesFilterArgs} args
   * @return {TabsIndexesFilterArgs}
   */
  #indexes (args: TabsIndexesFilterArgs): TabsIndexesFilterArgs {
    const { currentIndex, source } = args
    const isEnd = currentIndex >= this.#endIndex

    /* Remove scroll listener */

    if (source !== 'scroll') {
      this.track?.removeEventListener('scroll', this.#scrollHandler)
      clearTimeout(this.#scrollId)
      cancelAnimationFrame(this.#animRef.id)
    }

    /* Update prev and next state */

    if (isHtmlElement(this.prev) && isHtmlElement(this.next)) {
      let prevDisabled = false
      let nextDisabled = false

      if (currentIndex <= 0) {
        prevDisabled = true
      }

      if (isEnd) {
        nextDisabled = true
      }

      this.prev.disabled = prevDisabled
      this.next.disabled = nextDisabled
    }

    /* Update end index */

    if (isEnd) {
      args.currentIndex = this.#endIndex
    }

    args.endIndex = this.#endIndex

    /* End args */

    return args
  }

  /**
   * Tabs deactivate handler manages panel focus.
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #deactivate (e: CustomEvent): void {
    const { currentIndex } = e.detail as TabsEventDetail

    this.panels.forEach((panel, i) => {
      panel.inert = i !== currentIndex
    })
  }

  /**
   * Tabs activate handler moves panels (click, init or resize).
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #activate (e: CustomEvent): void {
    const { source, panelIndex } = e.detail as TabsEventDetail

    const offsets = this.#leftOffsets
    const target = offsets[panelIndex]

    if (!isNumber(target)) {
      return
    }

    if (source !== 'scroll') {
      sliderScrollTo(target, source, this.#animRef, this.track, this.duration)
    }
  }

  /**
   * Tabs activated handler adds scroll listener after panel activation.
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #activated (e: CustomEvent): void {
    const { source } = e.detail as TabsEventDetail

    if (source === 'scroll') {
      return
    }

    this.track?.addEventListener('scroll', this.#scrollHandler)
  }

  /**
   * Move items to corresponding panels by breakpoint.
   *
   * @private
   * @return {void}
   */
  #moveGroups (): void {
    /* Check required */

    if (!isHtmlElement(this.#insert)) {
      return
    }

    /* Number of panels and visible items */

    let numberOfPanels = 1
    let perPanel = 1

    for (const b of this.breakpoints.values()) {
      const { low, high, items, panels } = b

      if (!isNumber(low) || !isNumber(high) || !isNumber(items) || !isNumber(panels)) {
        continue
      }

      if (this.#viewportWidth >= low && this.#viewportWidth < high) {
        numberOfPanels = panels
        perPanel = items
      }
    }

    this.#endIndex = numberOfPanels - 1

    /* Update tabs */

    this.tabs.forEach((tab, i) => {
      const hide = i >= numberOfPanels
      const panel = this.panels[i]

      tab.style.display = hide ? 'none' : ''

      if (isHtmlElement(panel)) {
        panel.style.display = hide ? 'none' : ''
      }
    })

    /* Create fragment and map for new groups */

    const panelsFrag = new DocumentFragment()
    panelsFrag.append(...this.panels)

    const panelsCount = this.panels.length
    const panelsMap: number[][] = Array.from({ length: numberOfPanels }).map((_, i) => {
      const start = i * perPanel
      const panel = []

      for (let j = start; j < start + perPanel; j += 1) {
        if (j < panelsCount) {
          panel.push(j)
        }
      }

      return panel
    })

    /* Insert panels into new map formation */

    panelsMap.forEach((indices, i) => {
      const panel = panelsFrag.children[i]

      if (!isHtmlElement(panel)) {
        return
      }

      indices.forEach(j => {
        const item = this.items[j]

        if (!isHtmlElement(item)) {
          return
        }

        panel.append(item)
      })
    })

    this.#insert.prepend(panelsFrag)
  }

  /**
   * Click handler on prev button to display previous panel.
   *
   * @private
   * @return {void}
   */
  #prev (): void {
    this.activate({
      current: this.currentIndex - 1,
      source: 'click'
    })
  }

  /**
   * Click handler on next button to display next panel.
   *
   * @private
   * @return {void}
   */
  #next (): void {
    this.activate({
      current: this.currentIndex + 1,
      source: 'click'
    })
  }

  /**
   * Scroll handler on track element.
   *
   * @private
   * @return {void}
   */
  #scroll (): void {
    /* Clear timeout */

    clearTimeout(this.#scrollId)

    /* Debounce */

    this.#scrollId = window.setTimeout(() => {
      /* Track required and leave if already scrolling */

      if (!isHtmlElement(this.track)) {
        return
      }

      /* Target and offset */

      const target = this.track.scrollLeft
      const offsets = this.#leftOffsets

      /* New index to activate */

      let newIndex = this.currentIndex

      const closestOffset = offsets.reduce((prev, curr) => {
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev)
      })

      newIndex = offsets.indexOf(closestOffset)

      /* Move to new panel */

      if (newIndex > -1) {
        this.activate({
          current: newIndex,
          source: 'scroll'
        })
      }
    }, 100)
  }

  /**
   * Resize action callback.
   *
   * @private
   * @param {ActionResizeArgs} args
   * @return {void}
   */
  #resize (args: ActionResizeArgs): void {
    const [oldViewportWidth, newViewportWidth] = args

    if (oldViewportWidth === newViewportWidth) {
      return
    }

    this.#setDimensions(newViewportWidth)
    this.activate({
      current: this.currentIndex,
      source: 'resize'
    })
  }
}

/* Exports */

export { SliderGroup }
