/**
 * Objects - Slider
 */

/* Imports */

import type { SliderTypes } from './SliderTypes.js'
import type { TabsEventDetail, TabsIndexArgs } from '../Tabs/TabsTypes.js'
import { Tabs } from '../Tabs/Tabs.js'
import { getItem } from '../../utils/item/item.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { focusSelector } from '../../utils/focusability/focusability.js'
import { onResize, removeResize } from '../../utils/resize/resize.js'
import { config } from '../../config/config.js'
import { isNumber } from '../../utils/number/number.js'

/**
 * Scroll based slider using panel and tab structure with layout and loop options
 */
class Slider extends Tabs {
  /**
   * Scrollable container element
   *
   * @type {HTMLElement|null}
   */
  track: HTMLElement | null = null

  /**
   * Elements within multi-item panels
   *
   * @type {HTMLElement[]}
   */
  items: HTMLElement[] = []

  /**
   * Target height element
   *
   * @type {HTMLElement|null}
   */
  heightItem: HTMLElement | null = null

  /**
   * Previous navigation button element
   *
   * @type {HTMLButtonElement|null}
   */
  prev: HTMLButtonElement | null = null

  /**
   * Next navigation button element
   *
   * @type {HTMLButtonElement|null}
   */
  next: HTMLButtonElement | null = null

  /**
   * Transition duration on scroll (tab or button click)
   *
   * @type {number}
   */
  duration: number = 500

  /**
   * Repeat panels to the left and right
   *
   * @type {boolean}
   */
  loop: boolean = false

  /**
   * Layout type
   *
   * single - single item panels
   * group - multi-item panels
   * flex - multi-item panels different widths
   *
   * @type {SliderTypes}
   */
  type: SliderTypes = 'single'

  /**
   * Number of visible items and panels by breakpoint for mult-item
   *
   * @type {Set<Record<string, number>>}
   */
  breakpoints: Set<Record<'low' | 'high' | 'items' | 'panels', number>> = new Set()

  /**
   * Panels parent element
   *
   * @private
   * @type {HTMLElement|null}
   */
  #insert: HTMLElement | null = null

  /**
   * Last panels index for groups (updated on resize)
   *
   * @private
   * @type {number}
   */
  #endGroupIndex: number = 0

  /**
   * Rearrange multi-item elements across breakpoints
   *
   * @private
   * @type {boolean}
   */
  #movable: boolean = false

  /**
   * Track focusable elements in current panel
   *
   * @private
   * @type {Element[]}
   */
  #focusableItems: Element[] = []

  /**
   * Scroll listener timeout id
   *
   * @private
   * @type {number}
   */
  #scrollId: number = 0

  /**
   * Timeout id to add scroll listener
   *
   * @private
   * @type {number}
   */
  #scrollEventId: number = 0

  /**
   * Scroll to animation id
   *
   * @private
   * @type {number}
   */
  #scrollAnimId: number = 0

  /**
   * Left panel offsets to scroll to
   *
   * @private
   * @type {number[]}
   */
  #scrollLeftOffsets: number[] = []

  /**
   * Right panel offsets to scroll to for flex type
   *
   * @private
   * @type {number[]}
   */
  #scrollRightOffsets: number[] = []

  /**
   * Account for track scroll padding
   *
   * @private
   * @type {number}
   */
  #offset: number = 0

  /**
   * Viewport width to check breakpoint(s)
   *
   * @private
   * @type {number}
   */
  #viewportWidth: number = window.innerWidth

  /**
   * Visible current tab index in loop
   *
   * @private
   * @type {number}
   */
  #loopCurrentIndex: number = 0

  /**
   * Track element width
   *
   * @private
   * @type {number}
   */
  #loopTrackWidth: number = 0

  /**
   * Initial number of panels in loop
   *
   * @private
   * @type {number}
   */
  #loopInitLength: number = 0

  /**
   * Number of panels in loop including cloned panels
   *
   * @private
   * @type {number}
   */
  #loopLength: number = 0

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #deactivateHandler = this.#deactivate.bind(this)
  #activateHandler = this.#activate.bind(this)
  #activatedHandler = this.#activated.bind(this)
  #prevHandler = this.#prev.bind(this)
  #nextHandler = this.#next.bind(this)
  #scrollHandler = this.#scroll.bind(this)
  #resizeHandler = this.#resize.bind(this)

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line

  /**
   * Init - each time added to DOM
   */
  override connectedCallback (): void {
    super.connectedCallback()

    /* Add event listeners */

    this.addEventListener('tabs:deactivate', this.#deactivateHandler as EventListener)
    this.addEventListener('tabs:activate', this.#activateHandler as EventListener)
    this.addEventListener('tabs:activated', this.#activatedHandler as EventListener)

    /* Initialize */

    this.init = this.#initialize()
  }

  /**
   * Clean up - each time removed from DOM
   */
  override disconnectedCallback (): void {
    super.disconnectedCallback()

    /* Remove event listeners */

    this.removeEventListener('tabs:deactivate', this.#deactivateHandler as EventListener)
    this.removeEventListener('tabs:activate', this.#activateHandler as EventListener)
    this.removeEventListener('tabs:activated', this.#activatedHandler as EventListener)

    this.track?.removeEventListener('scroll', this.#scrollHandler)
    this.prev?.removeEventListener('click', this.#prevHandler)
    this.next?.removeEventListener('click', this.#nextHandler)

    removeResize(this.#resizeHandler)

    /* Empty/nullify props */

    this.track = null
    this.items = []
    this.heightItem = null
    this.prev = null
    this.next = null
    this.breakpoints = new Set()
    this.#insert = null
    this.#focusableItems = []

    /* Clear timeout and animation */

    clearTimeout(this.#scrollId)
    clearTimeout(this.#scrollEventId)
    cancelAnimationFrame(this.#scrollAnimId)
  }

  /**
   * Initialize - check required items, set variables and activate
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Get items */

    const track = getItem('[data-slider-track]', this)
    const items = getItem(['[data-slider-item]'], this)
    const heightItem = getItem('[data-slider-height]', this)
    const prev = getItem('[data-slider-prev]', this)
    const next = getItem('[data-slider-next]', this)
    const [firstPanel] = this.panels
    const insert = firstPanel?.parentElement

    /* Check required items exist */

    if (!isHtmlElement(track) || !isHtmlElement(insert)) {
      return false
    }

    /* Set element props */

    this.track = track
    this.#insert = insert

    if (isHtmlElementArray(items)) {
      this.items = items
    }

    if (isHtmlElement(heightItem)) {
      this.heightItem = heightItem
    }

    if (this.hasAttribute('loop')) {
      this.loop = true
    }

    /* Delays */

    this.delay = this.duration + 100
    this.focusDelay = this.loop ? 50 : 0

    /* Type */

    const type = this.getAttribute('type')
    const isGroup = type === 'group'

    if (isStringStrict(type)) {
      this.type = type as SliderTypes
    }

    if (isGroup) {
      this.loop = false
    }

    /* Add event listeners */

    onResize(this.#resizeHandler)

    if (isHtmlElement(next, HTMLButtonElement) && isHtmlElement(prev, HTMLButtonElement)) {
      this.next = next
      this.prev = prev
      this.prev.addEventListener('click', this.#prevHandler)
      this.next.addEventListener('click', this.#nextHandler)
    }

    /* Set breakpoints */

    const breakpoints = this.getAttribute('breakpoints')
    const visible = this.getAttribute('visible')

    if (isStringStrict(breakpoints) && isStringStrict(visible)) {
      const breakpointsArr = breakpoints.split(',')
      const visibleArr = visible.split(',')
      const panelsLen = this.panels.length

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
          low,
          high,
          items,
          panels: Math.ceil(panelsLen / items)
        })
      })
    }

    /* Group variables */

    this.#movable = this.breakpoints.size > 0 && this.items.length > 0 && isGroup
    this.#endGroupIndex = this.panels.length - 1

    /* Current */

    let current = this.currentIndex

    /* Clone panels for loop */

    if (this.loop) {
      this.#loopInitLength = this.panels.length

      const panelsFrag = new DocumentFragment()
      panelsFrag.append(...this.panels)

      for (let i = 1; i < 3; i += 1) {
        this.panels.map((panel) => {
          const clone = panel.cloneNode(true) as HTMLElement

          clone.id = `${panel.id}-clone-${i}`
          clone.dataset.sliderSelected = 'false'

          panelsFrag.append(clone)

          return clone
        })
      }

      this.#insert.append(panelsFrag)
      this.panels = [...this.#insert.children] as HTMLElement[]
      this.#loopLength = this.panels.length

      current = this.currentIndex + this.#loopInitLength
    }

    /* Set dimension properties */

    this.#setDimensions()

    /* Cap current */

    if (isGroup && current > this.#endGroupIndex) {
      current = this.#endGroupIndex
    }

    /* Activate current */

    const init = this.activate({
      current,
      focus: false,
      source: 'init'
    })

    /* Init successful */

    return init
  }

  /**
   * Set offsets, loop width and optional height
   *
   * @private
   * @return {void}
   */
  #setDimensions (): void {
    /* Update height */

    if (isHtmlElement(this.heightItem)) {
      const height = Math.ceil(this.heightItem.clientHeight)

      this.style.setProperty('--sld-height', `${height}px`)
    }

    /* Track width and offset */

    if (isHtmlElement(this.track)) {
      this.#loopTrackWidth = this.loop ? this.track.clientWidth : 0

      const style = getComputedStyle(this.track)
      const left = style.getPropertyValue('scroll-padding-left')
      const leftNum = parseInt(left)
      this.#offset = isNumber(leftNum) ? leftNum : 0
    }

    /* Shift multi-item to different panels */

    this.#moveGroups()

    /* Reset offsets */

    this.#scrollLeftOffsets = []
    this.#scrollRightOffsets = []

    this.panels.forEach((panel, i) => {
      if (!this.loop && i > this.#endGroupIndex) {
        return
      }

      const offset = panel.offsetLeft - this.#offset

      this.#scrollLeftOffsets.push(offset)

      if (this.type === 'flex') {
        this.#scrollRightOffsets.push(offset + panel.clientWidth)
      }
    })
  }

  /**
   * Filter indexes for loop
   *
   * @private
   * @param {TabsIndexArgs} args
   * @param {boolean} moved
   * @return {TabsIndexArgs}
   */
  #getLoopIndexes (args: TabsIndexArgs, moved: boolean = false): TabsIndexArgs {
    let {
      currentIndex,
      lastIndex,
      panelIndex,
      lastPanelIndex,
      focus,
      source
    } = args

    if (source === 'click') {
      currentIndex = currentIndex + (this.#loopInitLength * this.#loopCurrentIndex)
    }

    lastPanelIndex = lastIndex + (this.#loopInitLength * this.#loopCurrentIndex)

    if (lastIndex === 0) {
      lastPanelIndex = 0
    }

    this.#loopCurrentIndex = Math.floor(currentIndex / this.#loopInitLength)
    currentIndex = currentIndex - (this.#loopInitLength * this.#loopCurrentIndex)

    if (source === 'init' || moved) {
      this.#loopCurrentIndex = 1
    }

    panelIndex = currentIndex + (this.#loopInitLength * this.#loopCurrentIndex)

    return {
      currentIndex,
      lastIndex,
      panelIndex,
      lastPanelIndex,
      focus,
      source
    }
  }

  /**
   * Filter indexes, update track scroll listener and button states
   *
   * @param {TabsIndexArgs} args
   * @return {TabsIndexArgs}
   */
  override getIndexes (args: TabsIndexArgs): TabsIndexArgs {
    const {
      currentIndex,
      lastIndex,
      source
    } = args

    /* Remove scroll listener */

    if (source !== 'scroll') {
      this.track?.removeEventListener('scroll', this.#scrollHandler)
    }

    /* Update prev and next state */

    if (isHtmlElement(this.prev) && isHtmlElement(this.next) && !this.loop) {
      let prevDisabled = false
      let nextDisabled = false

      if (currentIndex === 0) {
        prevDisabled = true
      }

      if (currentIndex === lastIndex) {
        nextDisabled = true
      }

      this.prev.disabled = prevDisabled
      this.next.disabled = nextDisabled
    }

    /* Update end index */

    if (this.type === 'group') {
      args.endIndex = this.#endGroupIndex
    }

    /* Not loop exit */

    if (!this.loop) {
      return args
    }

    /* Loop args */

    args = this.#getLoopIndexes(args)

    const newCurrentIndex = this.#moveLoopEnd(args)

    if (isNumber(newCurrentIndex)) {
      return this.#getLoopIndexes({
        ...args,
        currentIndex: newCurrentIndex
      }, true)
    }

    /* End args */

    return args
  }

  /**
   * Tabs deactivate handler - manage panel and descendent focus
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #deactivate (e: CustomEvent): void {
    const {
      source,
      panel,
      lastPanel
    } = e.detail as TabsEventDetail

    const isInit = source === 'init'

    if (isInit) {
      this.panels.forEach((p) => {
        if (panel === p) {
          return
        }

        const focusableItems = [
          p,
          ...p.querySelectorAll(focusSelector)
        ]

        this.#toggleFocusability(false, focusableItems)
      })
    }

    if (this.#focusableItems.length === 0 && !isInit) {
      this.#focusableItems = [
        lastPanel,
        ...lastPanel.querySelectorAll(focusSelector)
      ]
    }

    const currentFocusableItems = [
      panel,
      ...panel.querySelectorAll(focusSelector)
    ]

    this.#toggleFocusability(false, this.#focusableItems)
    this.#toggleFocusability(true, currentFocusableItems)

    this.#focusableItems = currentFocusableItems
  }

  /**
   * Tabs activate handler - move panels (click, init or resize)
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #activate (e: CustomEvent): void {
    const { source, panelIndex } = e.detail as TabsEventDetail

    console.log('ACTIVATE', this.type, e.detail)

    const offsets = this.#scrollLeftOffsets
    const target = offsets[panelIndex]

    if (!isNumber(target)) {
      return
    }

    if (source !== 'scroll') {
      requestAnimationFrame(() => {
        this.#scrollTo(target, source)
      })
    }
  }

  /**
   * Tabs activated handler - add scroll listener after panel activation
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #activated (e: CustomEvent): void {
    const { source } = e.detail as TabsEventDetail

    clearTimeout(this.#scrollEventId)

    if (!isHtmlElement(this.track) || source === 'scroll') {
      return
    }

    this.#scrollEventId = window.setTimeout(() => {
      this.track?.addEventListener('scroll', this.#scrollHandler)
    }, 0)
  }

  /**
   * Manage focus with tab index and aria hidden
   *
   * @private
   * @param {boolean} on
   * @param {Element[]} items
   * @return {boolean}
   */
  #toggleFocusability (on: boolean, items: Element[]): boolean {
    if (items.length === 0) {
      return false
    }

    items.forEach(item => {
      (item as HTMLElement).tabIndex = on ? 0 : -1
      item.ariaHidden = on ? 'false' : 'true'
    })

    return true
  }

  /**
   * Move items to corresponding panels by breakpoint
   *
   * @private
   * @return {void}
   */
  #moveGroups (): void {
    /* Check required */

    if (!this.#movable || !isHtmlElement(this.#insert)) {
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

    this.#endGroupIndex = numberOfPanels - 1

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

    const panelsLen = this.panels.length
    const panelsMap: number[][] = Array.from({ length: numberOfPanels }).map((_, i) => {
      const start = i * perPanel
      const panel = []

      for (let j = start; j < start + perPanel; j += 1) {
        if (j < panelsLen) {
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
   * Move panels if first or last panel visible
   *
   * @private
   * @param {TabsIndexArgs} args
   * @return {number|undefined}
   */
  #moveLoopEnd (args: TabsIndexArgs): number | undefined {
    /* Check required elements */

    if (!isHtmlElement(this.track) || !isHtmlElement(this.#insert)) {
      return
    }

    /* Args */

    const {
      currentIndex,
      panelIndex,
      lastIndex,
      source
    } = args

    const offsets = this.#scrollLeftOffsets
    const target = offsets[panelIndex]

    /* Target required */

    if (!isNumber(target)) {
      return
    }

    /* First and last offsets */

    const startBuffer = offsets[1]
    const endBuffer = offsets[this.#loopLength - 1]

    /* Move elements from end to start */

    let move = false
    let newIndex: number | undefined
    let diff = 0

    if (isNumber(startBuffer) && target <= startBuffer) {
      move = true
    }

    if (isNumber(endBuffer) && target + this.#loopTrackWidth >= endBuffer) {
      move = true
    }

    if (move) {
      const panelsFrag = new DocumentFragment()
      const start = this.#loopLength - this.#loopInitLength

      for (let i = start; i < this.#loopLength; i += 1) {
        const panel = this.panels[i]

        if (!isHtmlElement(panel)) {
          continue
        }

        panelsFrag.append(panel)
      }

      this.#insert.prepend(panelsFrag)
      this.panels = [...this.#insert.children] as HTMLElement[]

      newIndex = currentIndex + this.#loopInitLength
      diff = source === 'click' ? lastIndex - currentIndex : 0
    }

    /* Move track to new index offset */

    if (isNumber(newIndex)) {
      const left = this.#scrollLeftOffsets[newIndex + diff]

      if (isNumber(left)) {
        this.track.scrollLeft = left
      }
    }

    /* New index */

    return newIndex
  }

  /**
   * Sine ease in out
   *
   * @private
   * @param {number} elapsed
   * @param {number} from
   * @param {number} change
   * @return {number}
   */
  #ease (elapsed: number, from: number, change: number): number {
    return -change / 2 * (Math.cos(Math.PI * elapsed / this.duration) - 1) + from
  }

  /**
   * Move track immediately or smoothly
   *
   * @private
   * @param {number} to
   * @param {string} source
   * @return {void}
   */
  #scrollTo (to: number, source: string): void {
    /* Cancel any ongoing animation */

    cancelAnimationFrame(this.#scrollAnimId)

    /* Track required */

    if (!isHtmlElement(this.track)) {
      return
    }

    /* Move immediately if reduce motion, init or resize */

    if (config.reduceMotion || source !== 'click') {
      this.track.scrollLeft = to
      return
    }

    /* Initial animation values */

    let start: DOMHighResTimeStamp | undefined
    let done = false

    this.track.style.scrollSnapType = 'none'
    this.track.style.overscrollBehavior = 'none'

    const from = this.track.scrollLeft
    const dir = to > from ? 'right' : 'left'
    const change = to - from

    /* Move smoothly to new position */

    const animate = (timestamp: DOMHighResTimeStamp): void => {
      if (!isHtmlElement(this.track)) {
        cancelAnimationFrame(this.#scrollAnimId)
        return
      }

      if (!isNumber(start)) {
        start = timestamp
      }

      const elapsed = timestamp - start

      if (elapsed < this.duration) {
        const v = this.#ease(elapsed, from, change)

        this.track.scrollLeft = v

        if ((dir === 'right' && v >= to) || (dir === 'left' && v <= to)) {
          done = true
        }
      } else {
        done = true
      }

      if (done) {
        this.track.style.scrollSnapType = ''
        this.track.style.overscrollBehavior = ''
      } else {
        this.#scrollAnimId = requestAnimationFrame(animate)
      }
    }

    this.#scrollAnimId = requestAnimationFrame(animate)
  }

  /**
   * Click handler on prev button to display previous panel
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
   * Click handler on next button to display next panel
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
   * Scroll handler on track element
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
      const offsets = this.#scrollLeftOffsets

      /* Set new index to activate */

      let newIndex = this.currentIndex

      if (this.type === 'flex') {
        const lastIndex = this.panels.length - 1
        const secondLastIndex = this.panels.length - 2
        const lastOffset = offsets[lastIndex]
        const secondLastOffset = offsets[secondLastIndex]

        offsets.forEach((offset, i) => {
          const rightOffset = this.#scrollRightOffsets[i]

          if (!isNumber(rightOffset)) {
            return
          }

          if (target >= offset && target <= rightOffset) {
            newIndex = i
          }
        })

        if (newIndex === secondLastIndex && isNumber(lastOffset) && isNumber(secondLastOffset)) {
          const secondLastDistance = Math.abs(secondLastOffset - target)
          const lastDistance = Math.abs(lastOffset - target)

          newIndex = secondLastDistance < lastDistance ? newIndex : lastIndex
        }
      } else {
        const closestOffset = offsets.reduce((prev, curr) => {
          return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev)
        })

        newIndex = offsets.indexOf(closestOffset)
      }

      /* Move to new panel */

      if (newIndex > -1) {
        this.activate({
          current: newIndex,
          focus: false,
          source: 'scroll'
        })
      }
    }, 100)
  }

  /**
   * Resize hook callback
   *
   * @private
   * @return {void}
   */
  #resize (): void {
    const viewportWidth = window.innerWidth

    if (viewportWidth === this.#viewportWidth) {
      return
    }

    this.#viewportWidth = viewportWidth
    this.#setDimensions()
    this.activate({
      current: this.currentIndex,
      focus: false,
      source: 'resize'
    })
  }
}

/* Exports */

export { Slider }
