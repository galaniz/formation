/**
 * Components - Navigation
 */

/* Imports */

import { getItem } from '../../utils/item/item.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isNumber } from '../../utils/number/number.js'
import { isSet } from '../../utils/set/set.js'
import {
  toggleFocusability,
  getInnerFocusableItems,
  getOuterFocusableItems
} from '../../utils/focusability/focusability.js'
import { stopScroll } from '../../utils/scroll/scrollStop.js'
import { cascade } from '../../utils/cascade/cascade.js'
import { onResize, removeResize } from '../../utils/resize/resize.js'
import { onEscape, removeEscape } from '../../utils/escape/escape.js'
import { config } from '../../config/config.js'

/**
 * Custom event details
 */
declare global {
  interface ElementEventMap {
    'nav:reset': CustomEvent
    'nav:resetted': CustomEvent
    'nav:set': CustomEvent
    'nav:toggle': CustomEvent
    'nav:toggled': CustomEvent
  }
}

/**
 * Handles responsive navigation with modal support
 */
class Navigation extends HTMLElement {
  /**
   * Slot elements by name
   *
   * @type {Map<string, HTMLElement>}
   */
  slots: Map<string, HTMLElement> = new Map()

  /**
   * Item elements
   *
   * @type {HTMLElement[]}
   */
  items: HTMLElement[] = []

  /**
   * Modal element
   *
   * @type {HTMLElement|null}
   */
  modal: HTMLElement | null = null

  /**
   * Slot elements in modal by name
   *
   * @type {Map<string, HTMLElement>}
   */
  modalSlots: Map<string, HTMLElement> = new Map()

  /**
   * Button element opens modal
   *
   * @type {HTMLButtonElement|null}
   */
  opens: HTMLButtonElement | null = null

  /**
   * Element(s) close modal
   *
   * @type {HTMLElement[]}
   */
  closes: HTMLElement[] = []

  /**
   * Milliseconds to delay show attribute
   *
   * @type {number}
   */
  delay: number = 200

  /**
   * Breakpoint(s) to prompt "overflowing" state
   *
   * @type {Map<string, number>}
   */
  breakpoints: Map<string, number> = new Map([['0', 0]])

  /**
   * Initialize state
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Open state
   *
   * @type {boolean}
   */
  open: boolean = false

  /**
   * Overflow state
   *
   * @type {boolean}
   */
  overflow: boolean = false

  /**
   * Items by group attribute
   *
   * @private
   * @type {Map<string, Set<HTMLElement>>}
   */
  #itemGroups: Map<string, Set<HTMLElement>> = new Map()

  /**
   * Groups currently in modal
   *
   * @private
   * @type {Set<Set<HTMLElement>>}
   */
  #modalGroups: Set<Set<HTMLElement>> = new Set()

  /**
   * Slot names by group
   *
   * @private
   * @type {Map<string, Set<string>>}
   */
  #slotGroups: Map<string, Set<string>> = new Map()

  /**
   * Item group names
   *
   * @private
   * @type {Set<string>}
   */
  #groupNames: Set<string> = new Set()

  /**
   * Slot names
   *
   * @private
   * @type {Set<string>}
   */
  #slotNames: Set<string> = new Set()

  /**
   * First focusable element in modal
   *
   * @private
   * @type {HTMLElement|null}
   */
  #firstFocusable: HTMLElement | null = null

  /**
   * Viewport width to check breakpoint(s)
   *
   * @private
   * @type {number}
   */
  #viewportWidth: number = window.innerWidth

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  #openHandler = this.#open.bind(this)
  #closeHandler = this.#close.bind(this)
  #resizeHandler = this.#resize.bind(this)
  #escapeHandler = this.#escape.bind(this)

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up after removed from DOM
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Remove event listeners */

    this.opens?.removeEventListener('click', this.#openHandler)

    this.closes.forEach(close => {
      close.removeEventListener('click', this.#closeHandler)
    })

    removeResize(this.#resizeHandler)
    removeEscape(this.#escapeHandler)

    /* Empty/nullify props */

    this.slots.clear()
    this.items = []
    this.modal = null
    this.modalSlots.clear()
    this.breakpoints.clear()
    this.opens = null
    this.closes = []
    this.init = false
    this.#itemGroups.clear()
    this.#modalGroups.clear()
    this.#slotGroups.clear()
    this.#groupNames.clear()
    this.#slotNames.clear()
    this.#firstFocusable = null
  }

  /**
   * Init check required items exist and run set
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const slots = getItem(['[data-nav-slot]'], this)
    const items = getItem(['[data-nav-item]'], this)
    const modal = getItem('[data-nav-modal]', this)
    const modalSlots = getItem(['[data-nav-modal-slot]'], this)
    const opens = getItem('[data-nav-open]', this)
    const closes = getItem(['[data-nav-close]'], this)

    /* Check required items exist */

    if (
      !isHtmlElementArray(slots) ||
      !isHtmlElementArray(items) ||
      !isHtmlElement(modal) ||
      !isHtmlElementArray(modalSlots) ||
      !isHtmlElement(opens, HTMLButtonElement) ||
      !isHtmlElementArray(closes)
    ) {
      return false
    }

    /* Delay if it exists */

    const delay = this.getAttribute('delay')

    if (isStringStrict(delay)) {
      const delayValue = parseInt(delay, 10)

      if (isNumber(delayValue)) {
        this.delay = delayValue
      }
    }

    /* Breakpoint(s) if it exists */

    const { fontSizeMultiplier } = config

    const breakpoints = this.getAttribute('breakpoints')
    let breakpoint0: number | undefined

    if (isStringStrict(breakpoints)) {
      const breakpointsArr = breakpoints.split(',')
      const breakpointsLen = breakpointsArr.length

      breakpointsArr.forEach((breakpoint, i) => {
        const breakpointValue = isStringStrict(breakpoint) ? parseInt(breakpoint, 10) : 0
        const breakpointNum = isNumber(breakpointValue) ? breakpointValue * fontSizeMultiplier : 0

        if (breakpointsLen === 1) {
          breakpoint0 = breakpointNum
        }

        const slot = slots[i]
        let key: string | undefined = '0'

        if (isHtmlElement(slot) && breakpointsLen > 1) {
          key = slot.dataset.navSlot
        }

        if (!isStringStrict(key)) {
          return
        }

        this.breakpoints.set(key, breakpointNum)
      })
    }

    /* Element props */

    this.items = items
    this.modal = modal
    this.opens = opens
    this.closes = closes

    /* Event listeners */

    this.opens.addEventListener('click', this.#openHandler)

    this.closes.forEach(close => {
      close.addEventListener('click', this.#closeHandler)
    })

    onResize(this.#resizeHandler)
    onEscape(this.#escapeHandler)

    /* Slots by name */

    slots.forEach(slot => {
      const slotName = this.#getName(slot.dataset.navSlot)

      if (isNumber(breakpoint0)) {
        this.breakpoints.set(slotName, breakpoint0)
      }

      this.slots.set(slotName, slot)
    })

    modalSlots.forEach(slot => {
      this.modalSlots.set(this.#getName(slot.dataset.navModalSlot), slot)
    })

    /* Groups and slot names */

    this.items.forEach(item => {
      /* Group */

      const groupName = this.#getName(item.dataset.navGroup)

      /* Slot */

      const slotName = this.#getName(item.dataset.navItem)
      item.dataset.navItem = slotName

      /* Append items and names */

      if (!this.#itemGroups.has(groupName)) {
        this.#itemGroups.set(groupName, new Set())
      }

      if (!this.#slotGroups.has(groupName)) {
        this.#slotGroups.set(groupName, new Set())
      }

      this.#itemGroups.get(groupName)?.add(item)
      this.#slotGroups.get(groupName)?.add(slotName)
      this.#groupNames.add(groupName)
      this.#slotNames.add(slotName)
    })

    /* Check overflow and move elements accordingly */

    this.#set()

    /* Init successful */

    return true
  }

  /**
   * Slot or group name as string
   *
   * @private
   * @param {string} name
   * @return {string}
   */
  #getName (name?: string): string {
    const defaultName = '0'

    if (!isStringStrict(name)) {
      return defaultName
    }

    return name
  }

  /**
   * Return items to slots
   *
   * @private
   * @return {void}
   */
  #reset (): void {
    /* Emit reset event */

    const onReset = new CustomEvent('nav:reset')
    this.dispatchEvent(onReset)

    /* Reset attributes */

    this.setAttribute('overflow', 'false')

    /* No items in modal */

    if (!this.#modalGroups.size) {
      return
    }

    /* Create fragments for each slot */

    const frag: Map<string, DocumentFragment> = new Map()

    this.#slotNames.forEach(name => {
      frag.set(name, new DocumentFragment())
    })

    /* Append items to fragments and store names */

    const slotNames: Set<string> = new Set()

    this.items.forEach(item => {
      const slotName = this.#getName(item.dataset.navItem)
      const slotFrag = frag.get(slotName)

      slotFrag?.append(item)
      slotNames.add(slotName)
    })

    /* Append items to slots */

    slotNames.forEach(name => {
      const slot = this.slots.get(name)
      const fragSlot = frag.get(name)

      if (fragSlot instanceof DocumentFragment) {
        slot?.append(fragSlot)
      }
    })

    /* Clear current groups */

    this.#modalGroups.clear()
  }

  /**
   * Check if slots are horizontally overflowing
   *
   * @private
   * @param {Set<string>|undefined} slotNames
   * @return {boolean}
   */
  #overflowing (slotNames: Set<string> | undefined): boolean {
    /* Slot names required */

    if (!isSet(slotNames)) {
      return false
    }

    /* Assume no overflow */

    let overflow = false

    /* Check for breakpoint or scroll to determine overflow */

    slotNames.forEach(name => {
      /* Slot breakpoint check */

      const bk = this.breakpoints.get(name)

      if (isNumber(bk) && bk > 0) {
        overflow = this.#viewportWidth <= bk
        return
      }

      /* Slot scroll check */

      const slot = this.slots.get(name)
      const scroll = isHtmlElement(slot) ? slot.scrollWidth > slot.clientWidth : false

      if (scroll) {
        overflow = true
      }
    })

    /* Result */

    return overflow
  }

  /**
   * Reset, check overflow and move items if overflowing
   *
   * @private
   * @param {boolean} [resize]
   * @return {void}
   */
  #set (resize: boolean = false): void {
    /* Reset and emit event */

    this.#reset()

    const onResetted = new CustomEvent('nav:resetted')
    this.dispatchEvent(onResetted)

    /* Create fragments for each slot */

    const frag: Map<string, DocumentFragment> = new Map()

    this.#slotNames.forEach(name => {
      frag.set(name, new DocumentFragment())
    })

    /* Track overflow state */

    let overflowing = false

    /* Slot names to append later */

    const slotNames: Set<string> = new Set()

    /* Check overflow and move items until false */

    for (const [groupName, group] of this.#itemGroups) {
      /* Check group overflow */

      overflowing = this.#overflowing(this.#slotGroups.get(groupName))

      if (!overflowing) {
        continue
      }

      /* Move group items to fragment */

      group.forEach(item => {
        const slotName = this.#getName(item.dataset.navItem)
        const slotFrag = frag.get(slotName)

        slotFrag?.append(item)
        slotNames.add(slotName)
      })

      /* Add group to current */

      this.#modalGroups.add(group)
    }

    /* Append items to modal slots */

    slotNames.forEach(name => {
      const slot = this.modalSlots.get(name)
      const fragSlot = frag.get(name)

      if (fragSlot instanceof DocumentFragment) {
        slot?.append(fragSlot)
      }
    })

    /* Update overflow state */

    const modalGroupsLen = this.#modalGroups.size
    const overflow = modalGroupsLen > 0

    if (overflow) {
      this.setAttribute('overflow', 'true')
    }

    if (!overflow && resize) {
      this.#toggle(false, false)
    }

    this.overflow = overflow

    /* Emit set event */

    const onSet = new CustomEvent('nav:set')
    this.dispatchEvent(onSet)
  }

  /**
   * Open/close modal - handle attributes and toggle focusability
   *
   * @private
   * @param {boolean} open
   * @param {boolean} [focusOpens=true]
   * @return {void}
   */
  #toggle (open: boolean, focusOpens: boolean = true): void {
    /* Open state */

    this.open = open

    /* Emit on event */

    const onToggle = new CustomEvent('nav:toggle')
    this.dispatchEvent(onToggle)

    /* Items outside modal inert and save first focusable element */

    toggleFocusability(!this.open, getOuterFocusableItems(this.modal))

    if (!isHtmlElement(this.#firstFocusable)) {
      const innerFocusable = getInnerFocusableItems(this.modal)
      const [firstFocusable] = innerFocusable

      if (isHtmlElement(firstFocusable)) {
        this.#firstFocusable = firstFocusable
      }
    }

    /* Update attributes, modal focus and scroll */

    if (open) {
      cascade([
        {
          action: () => {
            stopScroll(true)

            this.setAttribute('show', '')
            this.setAttribute('open', 'true')
          }
        },
        {
          action: () => {
            this.setAttribute('show-modal', '')
          },
          delay: this.delay
        },
        {
          action: () => {
            this.setAttribute('show-modal', 'items')
            this.#firstFocusable?.focus()
          }
        }
      ])
    } else {
      cascade([
        {
          action: () => {
            this.setAttribute('show-modal', '')
          }
        },
        {
          action: () => {
            this.removeAttribute('show')
            this.removeAttribute('show-modal')
          },
          delay: this.delay
        },
        {
          action: () => {
            this.setAttribute('open', 'false')

            stopScroll(false)
          }
        },
        {
          action: () => {
            if (!focusOpens) {
              return
            }

            this.opens?.focus()
          },
          delay: 100
        },
        {
          action: () => {
            const onToggled = new CustomEvent('nav:toggled')
            this.dispatchEvent(onToggled)
          }
        }
      ])
    }
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
    this.#set(true)
  }

  /**
   * Escape hook callback
   *
   * @private
   * @return {void}
   */
  #escape (): void {
    if (this.open) {
      this.#toggle(false)
    }
  }

  /**
   * Click handler on close element(s) to close modal
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #close (e: Event): void {
    e.preventDefault()

    this.#toggle(false)
  }

  /**
   * Click handler on open button to open modal
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  #open (e: Event): void {
    e.preventDefault()

    this.#toggle(true)
  }
}

/* Exports */

export { Navigation }
