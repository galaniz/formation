/**
 * Objects - Collapsible
 */

/* Imports */

import type { CollapsibleArgs, CollapsibleAction } from './CollapsibleTypes'
import {
  addAction,
  removeAction,
  doActions,
  isString,
  isHTMLElement
} from '../../utils/utils'

/**
 * Class - get and set height to open and close element
 */
class Collapsible {
  /**
   * Element that contains collapsible
   *
   * @type {HTMLElement}
   */
  container!: HTMLElement // Init false otherwise

  /**
   * Element that opens and closes
   *
   * @type {HTMLElement}
   */
  collapsible!: HTMLElement // Init false otherwise

  /**
   * Clickable element that sets open and close
   *
   * @type {HTMLElement}
   */
  trigger!: HTMLElement // Init false otherwise

  /**
   * Collapsible open to start
   *
   * @type {boolean}
   */
  startOpen: boolean = false

  /**
   * Transition duration on open or close
   *
   * @type {number}
   */
  duration: number = 300

  /**
   * Control accordion with function or breakpoint
   *
   * @type {import('./CollapsibleTypes').CollapsibleAction}
   */
  doAccordion: CollapsibleAction = false

  /**
   * Control hover with function or breakpoint
   *
   * @type {import('./CollapsibleTypes').CollapsibleAction}
   */
  doHover: CollapsibleAction = false

  /**
   * Store initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Action name for accordion functionality
   *
   * @private
   * @type {string}
   */
  _doAccordionName: string = ''

  /**
   * Id to compare for accordion
   *
   * @private
   * @type {string}
   */
  _accordionId: string = ''

  /**
   * Set value from public method
   *
   * @private
   * @type {boolean}
   */
  _set: boolean = true

  /**
   * Keep track of state
   *
   * @private
   * @type {boolean}
   */
  _open: boolean = false

  /**
   * Keep track of source
   *
   * @private
   * @type {string}
   */
  _source: string = ''

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  _clickHandler = this._click.bind(this)
  _hoverHandler = this._hover.bind(this)
  _blurHandler = this._blur.bind(this)
  _keyHandler = this._key.bind(this)

  /**
   * Set properties and initialize
   *
   * @param {import('./CollapsibleTypes').CollapsibleArgs} args
   */
  constructor (args: CollapsibleArgs) {
    this.init = this._initialize(args)
  }

  /**
   * Initialize - check required props and set props
   *
   * @private
   * @param {import('./CollapsibleTypes').CollapsibleArgs} args
   * @return {boolean}
   */
  _initialize (args: CollapsibleArgs): boolean {
    const {
      container = null,
      collapsible = null,
      trigger = null,
      startOpen = false,
      duration = 300,
      doAccordion = false,
      doHover = false
    } = args

    /* Check that required items exist */

    if (!isHTMLElement(container) || !isHTMLElement(collapsible) || !isHTMLElement(trigger)) {
      return false
    }

    /* Set variables */

    this.container = container
    this.collapsible = collapsible
    this.trigger = trigger
    this.startOpen = startOpen
    this.duration = duration
    this.doAccordion = doAccordion
    this.doHover = doHover

    /* Accordion functionality */

    if (isString(this.doAccordion) || this.doAccordion === true) {
      this._accordionId =
        this.collapsible.id !== '' ? this.collapsible.id : performance.now().toString(36) + Math.random().toString(36).substr(2)
    }

    if (isString(this.doAccordion)) {
      addAction(this.doAccordion, (args: { state: boolean, group: string }) => {
        const { state, group } = args

        this._doAccordion(state, group)
      })
    }

    /* Add event listeners */

    this.trigger.addEventListener('click', this._clickHandler)
    this.container.addEventListener('keydown', this._keyHandler)

    /* Hover functionality */

    if (isString(this.doHover)) {
      addAction(this.doHover, (args: { state: boolean }) => {
        const { state } = args

        this._doHover(state)
      })
    }

    if (this.doHover === true) {
      this._doHover(true)
    }

    /* Expand if start open */

    if (this.startOpen) {
      this._toggle(true)
    }

    /* Init successful */

    return true
  }

  /**
   * Set/unset hover
   *
   * @private
   * @param {boolean} state
   * @return {void}
   */
  _doHover (state: boolean = false): void {
    if (state) {
      this.container.addEventListener('mouseenter', this._hoverHandler)
      this.container.addEventListener('mouseleave', this._hoverHandler)
      this.container.addEventListener('focusout', this._blurHandler)
    } else {
      this.container.removeEventListener('mouseenter', this._hoverHandler)
      this.container.removeEventListener('mouseleave', this._hoverHandler)
      this.container.removeEventListener('focusout', this._blurHandler)
    }
  }

  /**
   * Set/unset accordion
   *
   * @private
   * @param {boolean} state
   * @param {string} group
   * @return {void}
   */
  _doAccordion (state: boolean = false, group: string = ''): void {
    if (!isString(group)) {
      return
    }

    this._doAccordionName = `frm-collapsible-${group}`

    if (state) {
      addAction(this._doAccordionName, this._doAccordionAction)
    } else {
      removeAction(this._doAccordionName, this._doAccordionAction)
    }
  }

  /**
   * Action to create accordion functionality
   *
   * @private
   * @param {objects} args
   * @param {string} args.accordionId
   * @return {void}
   */
  _doAccordionAction = (args: { accordionId: string }): void => {
    const { accordionId } = args

    if (accordionId !== this._accordionId && this._open) {
      this._toggle(false)
    }
  }

  /**
   * Get and set height
   *
   * @private
   * @param {boolean} open
   * @return {void}
   */
  _setHeight (): void {
    this.collapsible.style.height = 'auto'

    const height = this.collapsible.clientHeight

    this.collapsible.style.height = ''
    this.collapsible.style.setProperty('--height', `${height}px`)

    setTimeout(() => {
      this.collapsible.style.setProperty('--height', 'auto')
    }, this.duration + 10)
  }

  /**
   * Open or close, update trigger and publish id for accordion
   *
   * @private
   * @param {boolean} open
   * @return {void}
   */
  _toggle (open: boolean = true): void {
    if (!this._set) {
      return
    }

    this._setHeight()
    this._open = open

    if (open) {
      if (this.trigger !== document.activeElement && this._source === 'tap') {
        this.trigger.focus() // iOS Safari not focusing on buttons
      }

      if (isString(this._doAccordionName)) {
        doActions(this._doAccordionName, {
          accordionId: this._accordionId
        })
      }
    }

    setTimeout(() => {
      this.trigger.setAttribute('aria-expanded', open.toString())
      this.container.setAttribute('data-collapsible-expanded', open.toString())
      this.container.setAttribute('data-collapsible-source', this._source)
    }, 10)
  }

  /**
   * Click handler on trigger element - open or close
   *
   * @private
   * @return {void}
   */
  _click (): void {
    const open = !this._open

    this._source = 'tap'
    this._toggle(open)
  }

  /**
   * Mouse handler on container element - open or close
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  _hover (e: MouseEvent): void {
    const enter = e.type === 'mouseenter'

    this._source = 'hover'
    this._toggle(enter)
  }

  /**
   * Key handler on container element - set source
   *
   * @private
   * @return {void}
   */
  _key (): void {
    this._source = 'key'
  }

  /**
   * Focusout handler on container element - close
   *
   * @private
   * @return {void}
   */
  _blur (): void {
    setTimeout(() => {
      if (!this.container.contains(document.activeElement)) {
        this._toggle(false)
      }
    }, 100) // Wait for correct activeElement
  }

  /**
   * Public method - set or unset main properties
   *
   * @param {boolean} set
   * @return {void}
   */
  set (set: boolean = true): void {
    this._set = set

    if (set) {
      this._toggle(this._open)
    } else {
      this.collapsible.style.setProperty('--height', '')
      this.collapsible.style.setProperty('--visibility', '')
      this.collapsible.style.setProperty('--overflow', '')
    }
  }

  /**
   * Public method - open or close
   *
   * @param {boolean} open
   * @return {void}
   */
  toggle (open: boolean = true): void {
    this._toggle(open)
  }
}

/* Exports */

export { Collapsible }
