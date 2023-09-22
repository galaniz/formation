/**
 * Objects - collapsible
 */

/* Imports */

import { addAction, doActions } from '../../utils/actions'

/**
 * Class - get and set height to open and close element
 */

interface CollapsibleArgs {
  container: HTMLElement
  collapsible: HTMLElement
  trigger: HTMLElement
  startOpen?: boolean
  duration?: number
  accordionName?: string
  doAccordion?: Function | boolean | number
  doHover?: Function | boolean | number
}

class Collapsible {
  /**
   * Element that contains collapsible
   *
   * @type {HTMLElement}
   */

  container!: HTMLElement // Init false when null

  /**
   * Element that opens and closes
   *
   * @type {HTMLElement}
   */

  collapsible!: HTMLElement // Init false when null

  /**
   * Clickable element that sets open and close
   *
   * @type {HTMLElement}
   */

  trigger!: HTMLElement // Init false when null

  /**
   * TEMP
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
   * Action name for accordion functionality
   *
   * @type {string}
   */

  accordionName: string = ''

  /**
   * TEMP
   *
   * @type {function|boolean|number}
   */

  doAccordion: Function | boolean | number = false

  /**
   * TEMP
   *
   * @type {function|boolean|number}
   */

  doHover: Function | boolean | number = false

  /**
   * Store initialize success
   *
   * @type {boolean}
   */

  init: boolean = false

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
   * @param {object} args
   * @param {HTMLElement} args.container
   * @param {HTMLElement} args.collapsible
   * @param {HTMLElement} args.trigger
   * @param {number} args.startOpen
   * @param {number} args.duration
   * @param {string} args.accordionName
   * @param {function|boolean|number} args.doAccordion
   * @param {function|boolean|number} args.doHover
   */

  constructor (args: CollapsibleArgs) {
    this.init = this._initialize(args)
  }

  /**
   * Initialize - check required props and set props
   *
   * @private
   * @param {object} args
   * @return {boolean}
   */

  _initialize (args: CollapsibleArgs): boolean {
    const {
      container = null,
      collapsible = null,
      trigger = null,
      startOpen = false,
      duration = 300,
      accordionName = '',
      doAccordion = false,
      doHover = false
    } = args

    /* Check that required items exist */

    if (container === null || collapsible === null || trigger === null) {
      return false
    }

    /* */

    this.container = container
    this.collapsible = collapsible
    this.trigger = trigger
    this.startOpen = startOpen
    this.duration = duration
    this.accordionName = accordionName
    this.doAccordion = doAccordion
    this.doHover = doHover

    /* Add action with accordion name to get accordion behaviour */

    if (this.accordionName !== '') {
      this.accordionName = `frm-collapsible-${this.accordionName}`
      this._accordionId = this.collapsible.id !== '' ? this.collapsible.id : performance.now().toString(36) + Math.random().toString(36).substr(2)

      addAction(this.accordionName, (args: { accordionId: string }) => {
        const { accordionId } = args

        if (accordionId !== this._accordionId && this._open) {
          this._toggle(false)
        }
      })
    }

    /* Add event listeners */

    this.trigger.addEventListener('click', this._clickHandler)
    this.container.addEventListener('keydown', this._keyHandler)

    if (typeof this.doHover === 'function') {
      this.doHover(() => {
        this.container.addEventListener('mouseenter', this._hoverHandler)
        this.container.addEventListener('mouseleave', this._hoverHandler)
        this.container.addEventListener('focusout', this._blurHandler)
      })
    }

    /* Expand if start open */

    if (this.startOpen) {
      this._toggle(true)
    }

    /* Init successful */

    return true
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
    this.trigger.setAttribute('aria-expanded', open.toString())

    if (open) {
      if (this.trigger !== document.activeElement && this._source === 'tap') {
        this.trigger.focus() // iOS Safari not focusing on buttons
      }

      if (this.accordionName !== '') {
        doActions(this.accordionName, {
          accordionId: this._accordionId
        })
      }
    }

    setTimeout(() => {
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

export default Collapsible
