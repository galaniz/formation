/**
 * Objects - Collapsible
 */

/* Imports */

import type {
  CollapsibleAccordionArgs,
  CollapsibleActionArgs,
  CollapsibleType
} from './CollapsibleTypes.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { addAction, doActions } from '../../utils/action/action.js'
import { getItem } from '../../utils/item/item.js'

/**
 * Custom event details.
 */
declare global {
  interface ElementEventMap {
    'collapsible:toggle': CustomEvent
  }
}

/**
 * Handles expansion and collapse of element.
 */
class Collapsible extends HTMLElement {
  /**
   * Element expands and collapses.
   *
   * @type {HTMLElement|null}
   */
  panel: HTMLElement | null = null

  /**
   * Button element initiates open and close.
   *
   * @type {HTMLButtonElement|null}
   */
  toggle: HTMLButtonElement | null = null

  /**
   * Open state.
   *
   * @type {boolean}
   */
  expanded: boolean = false

  /**
   * Respond to hover events.
   *
   * @type {boolean}
   */
  hoverable: boolean = false

  /**
   * Accordion group name.
   *
   * @type {string}
   */
  accordion: string = ''

  /**
   * Transition duration on open or close.
   *
   * @type {number}
   */
  duration: number = 300

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Type of collapsible.
   *
   * @private
   * @type {CollapsibleType}
   */
  #type: CollapsibleType = 'single'

  /**
   * Source of toggle.
   *
   * @private
   * @type {string}
   */
  #source: string = ''

  /**
   * ID for blur timeout.
   *
   * @private
   * @type {number}
   */
  #blurDelayId: number = 0

  /**
   * ID for expand timeout.
   *
   * @private
   * @type {number}
   */
  #delayId: number = 0

  /**
   * ID for height timeout.
   *
   * @private
   * @type {number}
   */
  #autoDelayId: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #clickHandler = this.#click.bind(this)
  #hoverHandler = this.#hover.bind(this)
  #blurHandler = this.#blur.bind(this)
  #keyHandler = this.#key.bind(this)

  /**
   * Create new instance.
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM.
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up after removed from DOM.
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Clear event listeners */

    this.toggle?.removeEventListener('click', this.#clickHandler)
    this.removeEventListener('keydown', this.#keyHandler)
    this.#setHover(false)

    /* Empty props */

    this.toggle = null
    this.panel = null
    this.init = false

    /* Clear timeouts */

    clearTimeout(this.#blurDelayId)
    clearTimeout(this.#autoDelayId)
    clearTimeout(this.#delayId)
  }

  /**
   * Init check required items and set props.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const toggle = getItem('[data-collapsible-toggle]', this)
    const panel = getItem('[data-collapsible-panel]', this)

    /* Check required items exist */

    if (!isHtmlElement(toggle, HTMLButtonElement) || !isHtmlElement(panel)) {
      return false
    }

    /* Element props */

    this.toggle = toggle
    this.panel = panel

    /* Duration */

    const duration = this.getAttribute('duration')

    if (isStringStrict(duration)) {
      const durationValue = parseInt(duration, 10)

      if (isNumber(durationValue)) {
        this.duration = durationValue
      }
    }

    /* Accordion group */

    const accordion = this.getAttribute('accordion')

    if (isStringStrict(accordion)) {
      this.accordion = accordion
      this.#type = 'accordion'

      addAction(`collapsible:accordion:${accordion}`, (args: CollapsibleAccordionArgs) => {
        if (args.element !== this && this.expanded) {
          this.#toggle(false)
        }
      })
    }

    /* Hoverable */

    const hoverable = this.hasAttribute('hoverable')

    if (hoverable) {
      this.hoverable = true
      this.#setHover(true)
    }

    /* Action */

    const action = this.getAttribute('action')

    if (isStringStrict(action)) {
      addAction(`collapsible:${action}`, (args: CollapsibleActionArgs) => {
        const { hoverable, expanded, type } = args

        if (hoverable != null) {
          this.hoverable = hoverable
          this.#setHover(hoverable)
        }

        if (expanded != null) {
          this.#toggle(expanded)
        }

        if (isStringStrict(type)) {
          this.#type = type
        }
      })
    }

    /* Event listeners */

    this.toggle.addEventListener('click', this.#clickHandler)
    this.addEventListener('keydown', this.#keyHandler)

    /* Open if expanded */

    const expanded = this.getAttribute('expanded')

    if (expanded === 'true') {
      this.#toggle(true)
    }

    /* Init successful */

    return true
  }

  /**
   * Handle hover events.
   *
   * @private
   * @param {boolean} [set=true]
   * @return {void}
   */
  #setHover (set: boolean = true): void {
    if (set) {
      this.addEventListener('mouseenter', this.#hoverHandler)
      this.addEventListener('mouseleave', this.#hoverHandler)
      this.addEventListener('focusout', this.#blurHandler)
    } else {
      this.removeEventListener('mouseenter', this.#hoverHandler)
      this.removeEventListener('mouseleave', this.#hoverHandler)
      this.removeEventListener('focusout', this.#blurHandler)
    }
  }

  /**
   * Open or close panel and update attributes.
   *
   * @private
   * @param {boolean} [open=true]
   * @return {void}
   */
  #toggle (open: boolean = true): void {
    /* Clear timeouts */

    clearTimeout(this.#autoDelayId)
    clearTimeout(this.#delayId)

    /* Panel and different state required */

    if (!isHtmlElement(this.panel) || open === this.expanded) {
      return
    }

    /* Height */

    let height = 'auto'

    if (!this.hoverable) { // Skip height setting if hoverable
      this.panel.style.height = 'auto'
      height = `${this.panel.clientHeight}px`
      this.panel.style.height = ''
    }

    /* Update attributes */

    this.#delayId = window.setTimeout(() => {
      this.toggle?.setAttribute('aria-expanded', open.toString())
      this.setAttribute('source', this.#source)
      this.setAttribute('expanded', open.toString())
      this.expanded = open
    }, 0)

    /* Height */

    this.style.setProperty('--clp-height', height)

    this.#autoDelayId = window.setTimeout(() => {
      this.style.setProperty('--clp-height', 'auto')
    }, this.duration)

    /* Emit toggle event */

    const onToggle = new CustomEvent('collapsible:toggle')
    this.dispatchEvent(onToggle)

    /* Accordion group action */

    if (this.#type === 'accordion' && open) {
      const accordionArgs: CollapsibleAccordionArgs = {
        element: this
      }

      doActions(`collapsible:accordion:${this.accordion}`, accordionArgs)
    }
  }

  /**
   * Click handler on container element to toggle.
   *
   * @private
   * @return {void}
   */
  #click (): void {
    this.#source = 'tap'
    this.#toggle(!this.expanded)
  }

  /**
   * Mouse handler on container element to toggle.
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  #hover (e: MouseEvent): void {
    this.#source = 'hover'
    this.#toggle(e.type === 'mouseenter')
  }

  /**
   * Key handler on container element for key source.
   *
   * @private
   * @return {void}
   */
  #key (): void {
    this.#source = 'key'
  }

  /**
   * Blur handler on container element to close.
   *
   * @private
   * @return {void}
   */
  #blur (): void {
    /* Clear timeout */

    clearTimeout(this.#blurDelayId)

    /* Wait for correct activeElement */

    this.#blurDelayId = window.setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.#toggle(false)
      }
    }, 100)
  }
}

/* Exports */

export { Collapsible }
