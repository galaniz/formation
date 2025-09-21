/**
 * Objects - Slider
 */

/* Imports */

import type { SliderAnimRef } from './SliderTypes.js'
import type { TabsEventDetail, TabsIndexesFilterArgs } from '../Tabs/TabsTypes.js'
import type { ResizeActionArgs } from '../../utils/resize/resizeTypes.js'
import { Tabs } from '../Tabs/Tabs.js'
import { getItem } from '../../utils/item/item.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { onResize, removeResize } from '../../utils/resize/resize.js'
import { getInnerFocusableItems } from '../../utils/focusability/focusability.js'
import { addFilter, removeFilter } from '../../utils/filter/filter.js'
import { sliderScrollTo } from './sliderUtils.js'

/**
 * Handles scroll based slider with single item panels.
 */
class Slider extends Tabs {
  /**
   * Scrollable container element.
   *
   * @type {HTMLElement|null}
   */
  track: HTMLElement | null = null

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
   * Repeat panels to the left and right.
   *
   * @type {boolean}
   */
  loop: boolean = false

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
   * Scroll to animation id.
   *
   * @private
   * @type {SliderAnimRef}
   */
  #animRef: SliderAnimRef = { id: 0 }

  /**
   * Scroll listener timeout id.
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
   * Visible current tab index in loop.
   *
   * @private
   * @type {number}
   */
  #loopCurrentIndex: number = 0

  /**
   * Track element width.
   *
   * @private
   * @type {number}
   */
  #loopTrackWidth: number = 0

  /**
   * Initial number of panels in loop.
   *
   * @private
   * @type {number}
   */
  #loopInitLength: number = 0

  /**
   * Number of panels in loop including cloned panels.
   *
   * @private
   * @type {number}
   */
  #loopLength: number = 0

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

    this.addEventListener('tabs:deactivate', this.#deactivateHandler as EventListener)
    this.addEventListener('tabs:activate', this.#activateHandler as EventListener)
    this.addEventListener('tabs:activated', this.#activatedHandler as EventListener)

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

    this.removeEventListener('tabs:deactivate', this.#deactivateHandler as EventListener)
    this.removeEventListener('tabs:activate', this.#activateHandler as EventListener)
    this.removeEventListener('tabs:activated', this.#activatedHandler as EventListener)

    this.track?.removeEventListener('scroll', this.#scrollHandler)
    this.prev?.removeEventListener('click', this.#prevHandler)
    this.next?.removeEventListener('click', this.#nextHandler)

    removeResize(this.#resizeHandler)

    /* Remove filters */

    removeFilter(`tabs:indexes:${this.id}`, this.#indexesHandler)

    /* Empty props */

    this.track = null
    this.prev = null
    this.next = null
    this.subInit = false
    this.#insert = null

    /* Clear timeout and animation */

    clearTimeout(this.#scrollId)
    cancelAnimationFrame(this.#animRef.id)
  }

  /**
   * Init check required items, set variables and activate.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const track = getItem('[data-slider-track]', this)
    const prev = getItem('[data-slider-prev]', this)
    const next = getItem('[data-slider-next]', this)
    const [firstPanel] = this.panels
    const insert = firstPanel?.parentElement

    /* Check required items exist */

    if (!isHtmlElement(track) || !isHtmlElement(insert)) {
      return false
    }

    /* Element props */

    this.track = track
    this.#insert = insert

    if (this.hasAttribute('loop')) {
      this.loop = true
    }

    /* Delays */

    this.delay = this.duration + 100

    /* Event listeners */

    onResize(this.#resizeHandler)

    if (isHtmlElement(next, HTMLButtonElement) && isHtmlElement(prev, HTMLButtonElement)) {
      this.next = next
      this.prev = prev
      this.prev.addEventListener('click', this.#prevHandler)
      this.next.addEventListener('click', this.#nextHandler)
    }

    /* Current */

    let current = this.currentIndex

    /* Clone panels for loop */

    if (this.loop) {
      this.#loopInitLength = this.panels.length

      const panelsFrag = new DocumentFragment()
      panelsFrag.append(...this.panels)

      for (let i = 1; i < 3; i += 1) {
        this.panels.map(panel => {
          const clone = panel.cloneNode(true) as HTMLElement

          clone.id = `${panel.id}-clone-${i}`

          panelsFrag.append(clone)

          return clone
        })
      }

      this.#insert.append(panelsFrag)
      this.panels = [...this.#insert.children] as HTMLElement[]
      this.#loopLength = this.panels.length

      current = this.currentIndex + this.#loopInitLength
    }

    /* Dimension properties */

    this.#setDimensions()

    /* Activate current */

    const init = this.activate({
      current,
      source: 'init'
    })

    /* Init successful */

    return init
  }

  /**
   * Offsets, loop and viewport width.
   *
   * @private
   * @return {void}
   */
  #setDimensions (): void {
    /* Track width and offset */

    let offset = 0

    if (isHtmlElement(this.track)) {
      this.#loopTrackWidth = this.loop ? this.track.clientWidth : 0

      const left = getComputedStyle(this.track).getPropertyValue('scroll-padding-left')
      const leftNum = parseInt(left, 10)

      offset = isNumber(leftNum) ? leftNum : 0
    }

    /* Reset offsets */

    this.#leftOffsets = []
    const endIndex = this.panels.length - 1

    this.panels.forEach((panel, i) => {
      if (!this.loop && i > endIndex) {
        return
      }

      this.#leftOffsets.push(panel.offsetLeft - offset)
    })
  }

  /**
   * Filter indexes for loop.
   *
   * @private
   * @param {TabsIndexesFilterArgs} args
   * @param {boolean} [moved=false]
   * @return {TabsIndexesFilterArgs}
   */
  #getLoopIndexes (args: TabsIndexesFilterArgs, moved: boolean = false): TabsIndexesFilterArgs {
    const { lastIndex, source } = args

    let {
      currentIndex,
      lastPanelIndex,
      panelIndex
    } = args

    const { rawIndex = currentIndex } = args // Raw index needed for tab keydown

    currentIndex = rawIndex
    panelIndex = rawIndex

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
      source
    }
  }

  /**
   * Filter indexes, update track scroll listener and button states.
   *
   * @param {TabsIndexesFilterArgs} args
   * @return {TabsIndexesFilterArgs}
   */
  #indexes (args: TabsIndexesFilterArgs): TabsIndexesFilterArgs {
    const {
      currentIndex,
      lastIndex,
      source
    } = args

    /* Remove scroll listener */

    if (source !== 'scroll') {
      this.track?.removeEventListener('scroll', this.#scrollHandler)
      clearTimeout(this.#scrollId)
      cancelAnimationFrame(this.#animRef.id)
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
   * Tabs deactivate handler manages panel focus.
   *
   * @private
   * @param {CustomEvent} e
   * @return {void}
   */
  #deactivate (e: CustomEvent): void {
    const { panel } = e.detail as TabsEventDetail

    this.panels.forEach(p => {
      const fakeInert = p !== panel
      const focusable = getInnerFocusableItems(p)

      focusable.forEach(f => {
        (f as HTMLElement).tabIndex = fakeInert ? -1 : 0
      })

      if (fakeInert) {
        p.setAttribute('aria-disabled', 'true')
        p.removeAttribute('tabindex')
      } else {
        p.removeAttribute('aria-disabled')
      }
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
   * Move panels if first or last panel visible.
   *
   * @private
   * @param {TabsIndexesFilterArgs} args
   * @return {number|undefined}
   */
  #moveLoopEnd (args: TabsIndexesFilterArgs): number | undefined {
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

    const offsets = this.#leftOffsets
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
      const left = this.#leftOffsets[newIndex + diff]

      if (isNumber(left)) {
        this.track.scrollLeft = left
      }
    }

    /* New index */

    return newIndex
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
   * Resize hook callback.
   *
   * @private
   * @param {ResizeActionArgs} args
   * @return {void}
   */
  #resize (args: ResizeActionArgs): void {
    const [oldViewportWidth, newViewportWidth] = args

    if (oldViewportWidth === newViewportWidth) {
      return
    }

    this.#setDimensions()
    this.activate({
      current: this.currentIndex,
      source: 'resize'
    })
  }
}

/* Exports */

export { Slider }
