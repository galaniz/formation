/**
 * Components - Navigation
 */

/* Imports */

import { getItems } from '../../utils/getItems/getItems'
import { isHTMLElement, isHTMLElementArray } from '../../utils/isHTMLElement/isHTMLElement'
import { isStringStrict } from '../../utils/isString/isString'
import { isNumber } from '../../utils/isNumber/isNumber'
import {
  toggleFocusability,
  getInnerFocusableItems,
  getOuterFocusableItems
} from '../../utils/toggleFocusability/toggleFocusability'
import { stopScroll } from '../../utils/stopScroll/stopScroll'
import { cascade } from '../../utils/cascade/cascade'
import { onResize } from '../../utils/onResize/onResize'
import { onEscape } from '../../utils/onEscape/onEscape'

/**
 * Move nav items based on overflow and open/close modal element
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
   * @type {HTMLElement|null}
   */
  openButton: HTMLElement | null = null

  /**
   * Button element closes modal
   *
   * @type {HTMLElement|null}
   */
  closeButton: HTMLElement | null = null

  /**
   * Overlay element closes modal
   *
   * @type {HTMLElement|null}
   */
  overlay: HTMLElement | null = null

  /**
   * Milliseconds to delay show attribute
   *
   * @type {number}
   */
  delayShow: number = 200

  /**
   * Store initialize success
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Store open state
   *
   * @type {boolean}
   */
  isOpen: boolean = false

  /**
   * Store items by group attribute
   *
   * @private
   * @type {Map<string, Set<HTMLElement>>}
   */
  _itemGroups: Map<string, Set<HTMLElement>> = new Map()

  /**
   * Store groups currently in modal
   *
   * @private
   * @type {Set<Set<HTMLElement>>}
   */
  _currentModalGroups: Set<Set<HTMLElement>> = new Set()

  /**
   * Store slot names by group
   *
   * @private
   * @type {Map<string, Set<string>>}
   */
  _slotGroups: Map<string, Set<string>> = new Map()

  /**
   * Store item group names
   *
   * @private
   * @type {Set<string>}
   */
  _groupNames: Set<string> = new Set()

  /**
   * Store slot names
   *
   * @private
   * @type {Set<string>}
   */
  _slotNames: Set<string> = new Set()

  /**
   * Store first focusable element when modal element opens
   *
   * @private
   * @type {HTMLElement|null}
   */
  _firstFocusableItem: HTMLElement | null = null

  /**
   * Store viewport width for resize event
   *
   * @private
   * @type {number}
   */
  _viewportWidth: number = window.innerWidth

  /**
   * Bind this to event callbacks
   *
   * @private
   */
  _clickOpenHandler = this._clickOpen.bind(this)
  _clickCloseHandler = this._clickClose.bind(this)

  /**
   * Constructor object
   */
  constructor () { super() } // eslint-disable-line

  /**
   * Init - each time added to DOM
   */
  connectedCallback (): void {
    this.init = this._initialize()
  }

  /**
   * Clean up - each time removed from DOM
   */
  disconnectedCallback (): void {
    /* Remove event listeners */

    if (isHTMLElement(this.openButton)) {
      this.openButton.removeEventListener('click', this._clickOpenHandler)
    }

    if (isHTMLElement(this.closeButton)) {
      this.closeButton.removeEventListener('click', this._clickCloseHandler)
    }

    if (isHTMLElement(this.overlay)) {
      this.overlay.removeEventListener('click', this._clickCloseHandler)
    }

    /* Empty/nullify props */

    this.slots.clear()
    this.items = []
    this.modal = null
    this.modalSlots.clear()
    this.openButton = null
    this.closeButton = null
    this.overlay = null
    this.init = false
    this._itemGroups.clear()
    this._currentModalGroups.clear()
    this._slotGroups.clear()
    this._groupNames.clear()
    this._slotNames.clear()
    this._firstFocusableItem = null

    /* Remove actions */

    // REMOVE ACTIONS    
    // BREKPOINT OPTION SO OVERFLOWING = WINDOW.INNERWIDTH === BREAKPOINT   
  }

  /**
   * Get slot or group name as string
   *
   * @private
   * @param {string} name
   * @return {string}
   */
  _getName (name?: string): string {
    const defaultName = '0'

    if (!isStringStrict(name)) {
      return defaultName
    }

    return name
  }

  /**
   * Initialize - check required items exist and run set
   *
   * @private
   * @return {boolean}
   */
  _initialize (): boolean {
    /* Get items */

    const n = getItems({
      slots: ['[data-nav-slot]'],
      items: ['[data-nav-item]'],
      modal: '[data-nav-modal]',
      modalSlots: ['[data-nav-modal-slot]'],
      openButton: '[data-nav-open-button]',
      closeButton: '[data-nav-close-button]',
      overlay: '[data-nav-overlay]'
    }, this)

    const {
      slots,
      items,
      modal,
      modalSlots,
      openButton,
      closeButton,
      overlay
    } = n

    /* Check required items exist */

    if (
      !isHTMLElementArray(slots) ||
      !isHTMLElementArray(items) ||
      !isHTMLElement(modal) ||
      !isHTMLElementArray(modalSlots) ||
      !isHTMLElement(openButton) ||
      !isHTMLElement(closeButton)
    ) {
      return false
    }

    /* Set delay if it exists */

    const delayShow = this.getAttribute('delay-show')

    if (isStringStrict(delayShow)) {
      const delayMs = parseInt(delayShow)

      if (isNumber(delayMs)) {
        this.delayShow = delayMs
      }
    }

    /* Set item props */

    this.items = items
    this.modal = modal
    this.openButton = openButton
    this.closeButton = closeButton

    /* Add event listeners */

    this.openButton.addEventListener('click', this._clickOpenHandler)
    this.closeButton.addEventListener('click', this._clickCloseHandler)

    if (isHTMLElement(overlay)) {
      this.overlay = overlay
      this.overlay.addEventListener('click', this._clickCloseHandler)
    }

    onResize(() => {
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      this._set()
    })

    onEscape(() => {
      if (this.isOpen) {
        this._toggle()
      }
    })

    /* Set up slots by name */

    slots.forEach((slot) => {
      this.slots.set(this._getName(slot.dataset.navSlot), slot)
    })

    modalSlots.forEach((slot) => {
      this.modalSlots.set(this._getName(slot.dataset.navModalSlot), slot)
    })

    /* Set up groups and slot names */

    this.items.forEach((item) => {
      /* Group */

      const groupName = this._getName(item.dataset.navItemGroup)

      /* Slot */

      const slotName = this._getName(item.dataset.navItemSlot)
      item.dataset.navSlot = slotName

      /* Append items and names */

      const itemGroup = this._itemGroups.get(groupName)
      const slotGroup = this._slotGroups.get(groupName)

      if (itemGroup === undefined) {
        this._itemGroups.set(groupName, new Set())
      }

      if (slotGroup === undefined) {
        this._slotGroups.set(groupName, new Set())
      }

      itemGroup?.add(item) // REMOVE LATER
      slotGroup?.add(slotName)

      this._groupNames.add(groupName)
      this._slotNames.add(slotName)
    })

    /* Check overflow and move elements accordingly */

    this._set() // INIT      

    /* Init successful */

    return true
  }

  /**
   * Return items to slots
   *
   * @private
   * @return {void}
   */
  _reset (): void {
    /* Emit reset event */

    const onReset = new CustomEvent('onReset')
    this.dispatchEvent(onReset)

    /* Reset attributes */

    this.dataset.navOverflow = 'false'

    /* No items in modal */

    if (this._currentModalGroups.size === 0) {
      return
    }

    /* Create fragments for each slot */

    const frag: Map<string, DocumentFragment> = new Map()

    this._slotNames.forEach((name) => {
      frag.set(name, document.createDocumentFragment())
    })

    /* Append items to fragments and store names */

    const slotNames: Set<string> = new Set()

    this.items.forEach((item) => {
      const slotName = this._getName(item.dataset.navSlot)
      const slotFrag = frag.get(slotName)

      if (slotFrag !== undefined) {
        slotFrag.appendChild(item)
        slotNames.add(slotName)
      }
    })

    /* Append items to slots */

    slotNames.forEach((name) => {
      const slot = this.slots.get(name)
      const fragSlot = frag.get(name)

      if (slot !== undefined && fragSlot !== undefined) {
        slot.appendChild(fragSlot)
      }
    })

    /* Clear current groups */

    this._currentModalGroups.clear()
  }

  /**
   * Check if slots are horizontally overflowing
   *
   * @private
   * @param {Set<string>|undefined} slotNames
   * @return {boolean}
   */
  _overflowing (slotNames: Set<string> | undefined): boolean {
    /* Slot names required */

    if (slotNames === undefined) {
      return false
    }

    /* Assume no overflow */

    let overflow = false

    /* Check for scroll to determine overflow */

    slotNames.forEach((name) => {
      const slot = this.slots.get(name)

      let scroll = false

      if (slot !== undefined) {
        scroll = slot.scrollWidth > slot.clientWidth
      }

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
   * @return {void}
   */
  _set (): void {
    /* Reset and emit event */

    this._reset()

    const afterReset = new CustomEvent('afterReset')
    this.dispatchEvent(afterReset)

    /* Create fragments for each slot */

    const frag: Map<string, DocumentFragment> = new Map()

    this._slotNames.forEach((name) => {
      frag.set(name, document.createDocumentFragment())
    })

    /* Store overflow state */

    let overflowing = false

    /* Store slot names to append later */

    const slotNames: Set<string> = new Set()

    /* Check overflow and move items until false */

    for (const [groupName, group] of this._itemGroups) {
      /* Check group overflow */

      overflowing = this._overflowing(this._slotGroups.get(groupName))

      if (!overflowing) {
        break
      }

      /* Move group items to fragment */

      group.forEach((item) => {
        const slotName = this._getName(item.dataset.navSlot)
        const slotFrag = frag.get(slotName)

        if (slotFrag !== undefined) {
          slotFrag.appendChild(item)
          slotNames.add(slotName)
        }
      })

      /* Add group to current */

      this._currentModalGroups.add(group)
    }

    /* Append items to modal slots */

    slotNames.forEach((name) => {
      const slot = this.modalSlots.get(name)
      const fragSlot = frag.get(name)

      if (slot !== undefined && fragSlot !== undefined) {
        slot.appendChild(fragSlot)
      }
    })

    /* Set attribute if overflow or close */

    const currentGroupsLen = this._currentModalGroups.size

    if (currentGroupsLen > 0) {
      this.dataset.navOverflow = 'true'
    } else {
      this._toggle(true, false)
    }

    /* Emit set event */

    const onSet = new CustomEvent('onSet')
    this.dispatchEvent(onSet)
  }

  /**
   * Open/close modal element - set and unset attributes and toggleFocusability
   *
   * @private
   * @param {boolean} close
   * @param {boolean} focusOpenButton
   * @return {void}
   */
  _toggle (close: boolean = true, focusOpenButton: boolean = true): void {
    /* Emit on event */

    const onToggle = new CustomEvent('onToggle', {
      detail: {
        open: !close
      }
    })

    this.dispatchEvent(onToggle)

    /* Make items outside modal inert and get first focusable element */

    this.isOpen = !close

    toggleFocusability(!this.isOpen, getOuterFocusableItems(this.modal))

    if (this._firstFocusableItem === null) {
      const innerFocusableItems = getInnerFocusableItems(this.modal)
      const firstFocusableItem = innerFocusableItems[0]

      if (isHTMLElement(firstFocusableItem)) {
        this._firstFocusableItem = firstFocusableItem
      }
    }

    /* Update attributes, modal focus and scroll */

    if (!close) {
      cascade([
        {
          action: () => {
            stopScroll(true)

            this.dataset.navShow = ''
            this.dataset.navOpen = 'true'
          }
        },
        {
          action: () => {
            this.dataset.navShowModal = ''
          },
          delay: this.delayShow
        },
        {
          action: () => {
            this.dataset.navShowModal = 'items'

            if (this._firstFocusableItem !== null) {
              this._firstFocusableItem.focus()
            }
          }
        }
      ])
    } else {
      cascade([
        {
          action: () => {
            this.dataset.navShowModal = ''
          }
        },
        {
          action: () => {
            delete this.dataset.navShow
            delete this.dataset.navShowModal
          },
          delay: this.delayShow
        },
        {
          action: () => {
            this.dataset.navOpen = 'false'

            stopScroll(false)
          }
        },
        {
          action: () => {
            if (!focusOpenButton) {
              return
            }

            if (!isHTMLElement(this.openButton)) {
              return
            }

            this.openButton.focus()
          },
          delay: 100
        },
        {
          action: () => {
            const endToggle = new CustomEvent('endToggle', {
              detail: {
                open: this.isOpen
              }
            })

            this.dispatchEvent(endToggle)
          }
        }
      ])
    }
  }

  /**
   * Click handler on close button and overlay element to close modal element
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  _clickClose (e: Event): void {
    e.preventDefault()

    this._toggle()
  }

  /**
   * Click handler on open button element to open modal element
   *
   * @private
   * @param {Event} e
   * @return {void}
   */
  _clickOpen (e: Event): void {
    e.preventDefault()

    this._toggle(false)
  }
}

/* Exports */

export { Navigation }
