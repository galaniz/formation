/**
 * Objects - Slider
 */

import type { SliderAnimRef } from './SliderTypes.js'
import type { TabsEventDetail, TabsIndexesFilterArgs } from '../Tabs/TabsTypes.js'
import type { ActionResizeArgs } from '../../actions/actionsTypes.js'
import { Tabs } from '../Tabs/Tabs.js'
import { getItem } from '../../items/items.js'
import { getInnerFocusableItems } from '../../items/itemsFocusability.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { onResize, removeResize } from '../../actions/actionResize.js'
import { addFilter, removeFilter } from '../../filters/filters.js'
import {
  sliderClosestIndex,
  sliderPanelOffsets,
  sliderScrollTo
} from './sliderUtils.js'

/**
 * Number of panel sets in loop.
 *
 * @type {number}
 */
const loopSets: number = 3

/**
 * Handles scroll based slider with single item panels.
 */
class Slider extends Tabs {
  /**
   * Scrollable container element identified by `data-slider-track`.
   *
   * @type {HTMLElement|null}
   */
  track: HTMLElement | null = null

  /**
   * Optional previous navigation button element identified by `data-slider-prev`.
   *
   * @type {HTMLButtonElement|null}
   */
  prev: HTMLButtonElement | null = null

  /**
   * Optional next navigation button element identified by `data-slider-next`.
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
   * Optionally repeat panels to the left and right, set by the `loop` attribute.
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
   * Initial number of panels in loop.
   *
   * @private
   * @type {number}
   */
  #loopInitCount: number = 0

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

    /* Skip if moved */

    if (this.subInit) {
      return
    }

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
    this.prev = null
    this.next = null
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

    /* Nav buttons */

    if (isHtmlElement(next, HTMLButtonElement) && isHtmlElement(prev, HTMLButtonElement)) {
      this.next = next
      this.prev = prev
    }

    /* Current */

    let current = this.currentIndex

    /* Clone panels for loop */

    if (this.loop) {
      this.#loopInitCount = this.panels.length

      const panelsFrag = new DocumentFragment()
      panelsFrag.append(...this.panels)

      for (let i = 1; i < loopSets; i += 1) {
        this.panels.map(panel => {
          const clone = panel.cloneNode(true) as HTMLElement

          clone.id = `${panel.id}-clone-${i}`

          panelsFrag.append(clone)

          return clone
        })
      }

      this.#insert.append(panelsFrag)
      this.panels = [...this.#insert.children] as HTMLElement[]

      current = this.currentIndex + this.#loopInitCount
    }

    /* Dimension properties */

    this.#setDimensions()

    /* Activate current */

    const init = this.activate({
      current,
      source: 'init'
    })

    /* Event listeners only if init */

    if (init) {
      onResize(this.#resizeHandler)

      this.prev?.addEventListener('click', this.#prevHandler)
      this.next?.addEventListener('click', this.#nextHandler)
    }

    /* Init successful */

    return init
  }

  /**
   * Offsets.
   *
   * @private
   * @return {void}
   */
  #setDimensions (): void {
    this.#leftOffsets = sliderPanelOffsets(this.track, this.panels.length) || []
  }

  /**
   * Filter indexes for loop, always landing on the middle panel set.
   *
   * @private
   * @param {TabsIndexesFilterArgs} args
   * @return {TabsIndexesFilterArgs}
   */
  #getLoopIndexes (args: TabsIndexesFilterArgs): TabsIndexesFilterArgs {
    const { lastIndex, source } = args
    const { rawIndex = args.currentIndex } = args // Raw index needed for tab keydown
    const count = this.#loopInitCount

    /* A click gives an index inside the middle set, every other source
    gives one that already spans all three */

    const absolute = source === 'click' ? rawIndex + count : rawIndex

    /* Put it back on a panel, then onto the middle set */

    const currentIndex = ((absolute % count) + count) % count

    return {
      rawIndex,
      currentIndex,
      lastIndex,
      panelIndex: currentIndex + count,
      lastPanelIndex: lastIndex + count,
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
      endIndex,
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

      if (currentIndex === endIndex) {
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

    const loopArgs = this.#getLoopIndexes(args)

    this.#alignLoop(loopArgs)

    return loopArgs
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
    const { source, currentIndex, panelIndex } = e.detail as TabsEventDetail

    const offsets = this.#leftOffsets
    const target = offsets[panelIndex]

    if (!isNumber(target)) {
      return
    }

    if (source !== 'scroll') {
      sliderScrollTo({
        to: target,
        source,
        animRef: this.#animRef,
        track: this.track,
        slider: this,
        duration: this.duration,
        currentIndex,
        panelIndex
      })
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
   * Move track to the middle panel set before it is scrolled to.
   *
   * @private
   * @param {TabsIndexesFilterArgs} args
   * @return {void}
   */
  #alignLoop (args: TabsIndexesFilterArgs): void {
    /* Check required elements */

    if (!isHtmlElement(this.track)) {
      return
    }

    /* Args */

    const {
      rawIndex = 0,
      panelIndex,
      lastPanelIndex,
      source
    } = args

    const offsets = this.#leftOffsets
    const count = this.#loopInitCount

    /* A drag can end in a cloned set, so snap to its middle set copy */

    if (source === 'scroll') {
      const target = offsets[panelIndex]

      if (rawIndex !== panelIndex && isNumber(target)) {
        this.track.scrollLeft = target
      }

      return
    }

    /* Only prev, next or tab keydown wraps go out of range */

    if (source !== 'click') {
      return
    }

    /* Start from the current panel's copy in the neighboring set so wraps
    scroll the way the user pressed */

    let shift = 0

    if (rawIndex < 0) {
      shift = count
    }

    if (rawIndex >= count) {
      shift = -count
    }

    const from = offsets[lastPanelIndex + shift]

    if (shift !== 0 && isNumber(from)) {
      this.track.scrollLeft = from
    }
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

      /* New index to activate */

      const newIndex = sliderClosestIndex(this.#leftOffsets, this.track.scrollLeft)

      /* Current panel index in the track, offset to the middle set if looping */

      const panelIndex = this.loop
        ? this.currentIndex + this.#loopInitCount
        : this.currentIndex

      /* Move to new panel */

      if (newIndex > -1 && newIndex !== panelIndex) {
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

    this.#setDimensions()
    this.activate({
      current: this.currentIndex,
      source: 'resize'
    })
  }
}

export { Slider }
