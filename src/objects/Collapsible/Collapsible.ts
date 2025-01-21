/**
 * Objects - Collapsible
 */

/* Imports */

import type {
  CollapsibleAccordionArgs,
  CollapsibleActiveArgs,
  CollapsibleToggleDetail,
  CollapsibleTypes
} from './CollapsibleTypes.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { addAction, doActions } from '../../utils/action/action.js'
import { getItem } from '../../utils/item/item.js'

/**
 * Get and set height to open/close element
 */
class Collapsible extends HTMLElement {
  /**
   * Element that opens and closes
   *
   * @type {HTMLElement|null}
   */
  panel: HTMLElement | null = null

  /**
   * Element that triggers open and close
   *
   * @type {HTMLButtonElement|null}
   */
  trigger: HTMLButtonElement | null = null

  /**
   * Open state
   *
   * @type {boolean}
   */
  expanded: boolean = false

  /**
   * Respond to hover events
   *
   * @type {boolean}
   */
  hoverable: boolean = false

  /**
   * Accordion group name
   *
   * @type {string}
   */
  accordion: string = ''

  /**
   * Transition duration on open or close
   *
   * @type {number}
   */
  duration: number = 300

  /**
   * Initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Type of collapsible
   *
   * @private
   * @type {CollapsibleTypes}
   */
  #type: CollapsibleTypes = 'single'

  /**
   * Source of trigger
   *
   * @private
   * @type {string}
   */
  #source: string = ''

  /**
   * Id for blur timeout
   *
   * @private
   * @type {number}
   */
  #blurDelayId: number = 0

  /**
   * Id for transition timeout
   *
   * @private
   * @type {number}
   */
  #delayId: number = 0

  /**
   * Id for attribute timeout
   *
   * @private
   * @type {number}
   */
  #attrDelayId: number = 0

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #clickHandler = this.#click.bind(this)
  #hoverHandler = this.#hover.bind(this)
  #blurHandler = this.#blur.bind(this)
  #keyHandler = this.#key.bind(this)

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

    this.trigger?.removeEventListener('click', this.#clickHandler)
    this.removeEventListener('keydown', this.#keyHandler)
    this.#setHover(false)

    /* Empty/nullify props */

    this.trigger = null
    this.panel = null
    this.init = false

    /* Clear timeouts */

    clearTimeout(this.#blurDelayId)
    clearTimeout(this.#delayId)
    clearTimeout(this.#attrDelayId)
  }

  /**
   * Initialize - check required items and set properties
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Get items */

    const trigger = getItem('[data-collapsible-trigger]', this)
    const panel = getItem('[data-collapsible-panel]', this)

    /* Check that required items exist */

    if (!isHtmlElement(trigger, HTMLButtonElement) || !isHtmlElement(panel)) {
      return false
    }

    /* Set props */

    this.trigger = trigger
    this.panel = panel

    /* Set duration */

    const duration = this.getAttribute('duration')

    if (isStringStrict(duration)) {
      const durationValue = parseInt(duration, 10)

      if (isNumber(durationValue)) {
        this.duration = durationValue
      }
    }

    /* Set accordion group */

    const accordion = this.getAttribute('accordion')

    if (isStringStrict(accordion)) {
      this.accordion = accordion
      this.#type = 'accordion'

      addAction(`clp:accordion:${accordion}`, (args: CollapsibleAccordionArgs) => {
        if (args.element !== this && this.expanded) {
          this.#toggle(false)
        }
      })

      addAction('clp:accordion', (args: CollapsibleActiveArgs) => {
        this.#type = args.active ? 'accordion' : 'single'
      })
    }

    /* Set hoverable */

    const hoverable = this.hasAttribute('hoverable')

    if (hoverable) {
      this.hoverable = true

      addAction('clp:hoverable', (args: CollapsibleActiveArgs) => {  
        this.#setHover(args.active)
      })
    }

    /* Add event listeners */

    this.trigger.addEventListener('click', this.#clickHandler)
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
   * Set and unset hover events
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
   * Open or close panel and update attributes
   *
   * @private
   * @param {boolean} [open=true]
   * @return {void}
   */
  #toggle (open: boolean = true): void {
    /* Panel and different state required */

    if (!isHtmlElement(this.panel) || open === this.expanded) {
      return
    }

    /* Get height */

    this.panel.style.height = 'auto'
    const height = this.panel.clientHeight
    this.panel.style.height = ''

    /* Set height */

    this.style.setProperty('--clp-height', `${height}px`)

    this.#delayId = window.setTimeout(() => {
      this.style.setProperty('--clp-height', 'auto')

      clearTimeout(this.#delayId)
    }, this.duration + 10)

    /* Focus if tap */

    if (open && this.trigger !== document.activeElement && this.#source === 'tap') {
      this.trigger?.focus() // iOS Safari not focusing on buttons
    }

    /* Update attributes */

    this.#attrDelayId = window.setTimeout(() => {
      this.trigger?.setAttribute('aria-expanded', open.toString())
      this.setAttribute('data-collapsible-source', this.#source)
      this.setAttribute('expanded', open.toString())
      this.expanded = open

      clearTimeout(this.#attrDelayId)
    }, 10)

    /* Emit toggle event */

    const toggleDetails: CollapsibleToggleDetail = {
      open,
      type: this.#type,
      group: this.accordion
    }

    const onToggle = new CustomEvent('clp:toggle', {
      detail: toggleDetails
    })

    this.dispatchEvent(onToggle)

    /* Accordion group action */

    if (this.#type === 'accordion' && open) {
      doActions(`clp:accordion:${this.accordion}`, {
        element: this
      })
    }
  }

  /**
   * Click handler on container element to toggle
   *
   * @private
   * @return {void}
   */
  #click (): void {
    this.#source = 'tap'
    this.#toggle(!this.expanded)
  }

  /**
   * Mouse handler on container element to toggle
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
   * Key handler on container element for key source
   *
   * @private
   * @return {void}
   */
  #key (): void {
    this.#source = 'key'
  }

  /**
   * Focusout handler on container element to close
   *
   * @private
   * @return {void}
   */
  #blur (): void {
    /* Clear timeouts */

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
