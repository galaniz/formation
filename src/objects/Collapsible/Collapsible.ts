/**
 * Objects - Collapsible
 */

import type { CollapsibleAccordionArgs, CollapsibleActionArgs } from './CollapsibleTypes.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isHtmlElement } from '../../utils/html/html.js'
import { addAction, doActions, removeAction } from '../../actions/actions.js'
import { getItem } from '../../items/items.js'

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
   * Button element identified by `data-collapsible-toggle`, initiates open and close.
   *
   * @type {HTMLButtonElement|null}
   */
  toggle: HTMLButtonElement | null = null

  /**
   * Open state, optionally set on init by `expanded="true"`.
   *
   * @type {boolean}
   */
  expanded: boolean = false

  /**
   * Optionally respond to hover events, set by the `hoverable` attribute.
   *
   * @type {boolean}
   */
  hoverable: boolean = false

  /**
   * Optional accordion group action name, set by `accordion="{name}"`.
   *
   * @type {string}
   */
  accordion: string = ''

  /**
   * Optional custom action name, set by `action="{name}"`.
   *
   * @type {string}
   */
  action: string = ''

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * ID for blur timeout.
   *
   * @private
   * @type {number}
   */
  #blurDelayId: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #clickHandler = this.#click.bind(this)
  #hoverHandler = this.#hover.bind(this)
  #blurHandler = this.#blur.bind(this)
  #actionHandler = this.#action.bind(this)
  #accordionHandler = this.#accordion.bind(this)

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
    this.#setHover(false)

    removeAction(this.action, this.#actionHandler)
    removeAction(this.accordion, this.#accordionHandler)

    /* Empty props */

    this.toggle = null
    this.init = false

    /* Clear timeout */

    clearTimeout(this.#blurDelayId)
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

    /* Check required items exist */

    if (!isHtmlElement(toggle, HTMLButtonElement)) {
      return false
    }

    /* Element props */

    this.toggle = toggle

    /* Expanded */

    this.expanded = this.getAttribute('expanded') === 'true'

    /* Accordion group */

    const accordion = this.getAttribute('accordion')

    if (isStringStrict(accordion)) {
      this.accordion = `collapsible:accordion:${accordion}`

      addAction(this.accordion, this.#accordionHandler)
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
      this.action = `collapsible:${action}`

      addAction(this.action, this.#actionHandler)
    }

    /* Event listeners */

    this.toggle.addEventListener('click', this.#clickHandler)

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
    /* Different state required */

    if (open === this.expanded) {
      return
    }

    /* Update attributes and emit event */

    this.toggle?.setAttribute('aria-expanded', open.toString())
    this.setAttribute('expanded', open.toString())
    this.expanded = open

    const onToggle = new CustomEvent('collapsible:toggle')
    this.dispatchEvent(onToggle)

    /* Accordion group action */

    if (this.accordion && open) {
      const accordionArgs: CollapsibleAccordionArgs = {
        element: this
      }

      doActions(this.accordion, accordionArgs)
    }
  }

  /**
   * Click handler on button element to toggle.
   *
   * @private
   * @return {void}
   */
  #click (): void {
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
    this.#toggle(e.type === 'mouseenter')
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

    /* Wait for correct active element */

    this.#blurDelayId = window.setTimeout(() => {
      if (!this.contains(document.activeElement)) {
        this.#toggle(false)
      }
    }, 0)
  }

  /**
   * Custom action callback.
   *
   * @private
   * @param {CollapsibleActionArgs} args
   * @return {void}
   */
  #action (args: CollapsibleActionArgs): void {
    const { hoverable, expanded } = args

    if (hoverable != null) {
      this.hoverable = hoverable
      this.#setHover(hoverable)
    }

    if (expanded != null) {
      this.#toggle(expanded)
    }
  }

  /**
   * Accordion action callback.
   *
   * @private
   * @param {CollapsibleAccordionArgs} args
   * @return {void}
   */
  #accordion (args: CollapsibleAccordionArgs): void {
    if (args.element !== this && this.expanded) {
      this.#toggle(false)
    }
  }
}

export { Collapsible }
