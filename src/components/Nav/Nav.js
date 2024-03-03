/**
 * Components - Nav
 */

/* Imports */

import {
  cascade,
  toggleFocusability,
  getInnerFocusableItems,
  getOuterFocusableItems,
  getKey,
  stopScroll
} from '../../utils'

/**
 * Class - responsively move nav items based on overflow and toggle overflow element
 */

class Nav {
  /**
   * Set public properties and initialize
   *
   * @param {object} args
   * @param {HTMLElement} args.nav
   * @param {HTMLElement|array} args.list
   * @param {HTMLElement} args.overflow
   * @param {HTMLElement|array} args.overflowList
   * @param {HTMLElement} args.items
   * @param {string} args.itemSelector
   * @param {HTMLElement} args.button
   * @param {HTMLElement} args.overlay
   * @param {function} args.onSet
   * @param {function} args.onReset
   * @param {function} args.afterReset
   * @param {function} args.onResize
   * @param {function} args.onToggle
   * @param {function} args.endToggle
   * @param {function} args.done
   * @param {object} args.delay
   * @param {number} args.delay.open
   * @param {number} args.delay.close
   * @return {void|boolean} - False if init errors
   */

  constructor (args) {
    const {
      nav = null,
      list = null,
      overflow = null,
      overflowList = null,
      items = null,
      itemSelector = '',
      open = null,
      close = null,
      overlay = null,
      onSet = () => {},
      onReset = () => {},
      afterReset = () => {},
      onResize = () => {},
      onToggle = () => {},
      endToggle = () => {},
      done = () => {},
      delay = {
        open: 200,
        close: 200
      }
    } = args

    this.nav = nav
    this.list = list
    this.overflow = overflow
    this.overflowList = overflowList
    this.items = items
    this.itemSelector = itemSelector
    this.open = open
    this.close = close
    this.overlay = overlay
    this.onSet = onSet
    this.onReset = onReset
    this.afterReset = afterReset
    this.onResize = onResize
    this.onToggle = onToggle
    this.endToggle = endToggle
    this.done = done
    this.delay = delay

    /**
     * Expose/alter overflow state
     *
     * @type {boolean}
     */

    this.isOverflowing = false

    /**
     * Store open state
     *
     * @private
     * @type {boolean}
     */

    this._navOpen = false

    /**
     * Group items by overflow group attribute
     *
     * @private
     * @type {object}
     */

    this._overflowGroups = {}

    /**
     * Store total number of groups
     *
     * @private
     * @type {number}
     */

    this._overflowGroupsLength = 0

    /**
     * Store items by list index for instances where multiple overflowList elements
     *
     * @private
     * @type {object}
     */

    this._listIndexes = {}

    /**
     * Store groups currently overflown
     *
     * @private
     * @type {object[]}
     */

    this._currentOverflowGroups = []

    /**
     * Store first focusable element for when overflow element opens
     *
     * @private
     * @type {HTMLElement}
     */

    this._firstFocusableItem = null

    /**
     * Store timeout id in resize event
     *
     * @private
     * @type {number}
     */

    this._resizeTimer = -1

    /**
     * Store viewport width for resize event
     *
     * @private
     * @type {number}
     */

    this._viewportWidth = window.innerWidth

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize - check required props, set event listeners, overflow groups and focusability
   *
   * @private
   * @return {boolean}
   */

  _initialize () {
    /* Check that required properties not null */

    let error = false
    const required = [
      'nav',
      'list',
      'overflow',
      'overflowList',
      'items',
      'itemSelector',
      'open',
      'close'
    ]

    required.forEach((r) => {
      if (!this[r]) {
        error = true
      }
    })

    if (error) {
      return false
    }

    /* Convert list(s) and overflow list(s) to arrays */

    this.list = !Array.isArray(this.list) ? [this.list] : this.list
    this.overflowList = !Array.isArray(this.overflowList) ? [this.overflowList] : this.overflowList

    this.items = Array.from(this.items)

    if (!this.items.length) {
      return false
    }

    /* Event listeners */

    this._clickOpenHandler = this._clickOpen.bind(this)
    this._clickCloseHandler = this._clickClose.bind(this)
    this._keyDownHandler = this._keyDown.bind(this)
    this._resizeHandler = this._resize.bind(this)

    this.open.addEventListener('click', this._clickOpenHandler)
    this.close.addEventListener('click', this._clickCloseHandler)

    if (this.overlay) {
      this.overlay.addEventListener('click', this._clickCloseHandler)
    }

    document.addEventListener('keydown', this._keyDownHandler)
    window.addEventListener('resize', this._resizeHandler)

    /* Set up overflow groups by index */

    this.items.forEach((item) => {
      let overflowGroupIndex = parseInt(item.getAttribute('data-group-index'))
      let listIndex = parseInt(item.getAttribute('data-list-index'))

      if (isNaN(overflowGroupIndex)) {
        overflowGroupIndex = 0
      }

      if (isNaN(listIndex)) {
        listIndex = 0
        item.setAttribute('data-list-index', listIndex)
      }

      if (!Object.getOwnPropertyDescriptor(this._overflowGroups, overflowGroupIndex)) {
        this._overflowGroups[overflowGroupIndex] = []
        this._listIndexes[overflowGroupIndex] = []
        this._overflowGroupsLength += 1
      }

      this._overflowGroups[overflowGroupIndex].push(item)

      if (this._listIndexes[overflowGroupIndex].indexOf(listIndex) === -1) {
        this._listIndexes[overflowGroupIndex].push(listIndex)
      }
    })

    /* Check overflow and move elements accordingly */

    this._setNav(() => {
      this.done()

      /* Set first focusable item */

      const innerFocusableItems = getInnerFocusableItems(this.overflow)

      if (getInnerFocusableItems.length) {
        this._firstFocusableItem = innerFocusableItems[0]
      }
    })

    /* Init successful */

    return true
  }

  /**
   * Return overflowing items to list
   *
   * @private
   * @return {void}
   */

  _resetNav () {
    this.onReset()

    this.nav.setAttribute('data-nav-overflow', 'false')
    this.nav.setAttribute('data-nav-overflow-all', 'false')

    if (this._currentOverflowGroups.length > 0) {
      let appendFrag = true

      const frag = {}
      const listIndexes = []

      Object.keys(this._listIndexes || {}).forEach((overflowGroupIndex) => {
        this._listIndexes[overflowGroupIndex].forEach((index) => {
          frag[index] = document.createDocumentFragment()
        })
      })

      this.items.forEach((item) => {
        const listIndex = parseInt(item.getAttribute('data-list-index'))

        /* Insert at specific index */

        if (item.hasAttribute('data-index')) {
          appendFrag = false

          const index = parseInt(item.getAttribute('data-index'))
          const refNode = this.list[listIndex].children[index]

          this.list[listIndex].insertBefore(item, refNode)
        } else { // Insert
          frag[listIndex].appendChild(item)
        }

        if (listIndexes.indexOf(listIndex) === -1) {
          listIndexes.push(listIndex)
        }
      })

      /* Append overflowing items */

      if (appendFrag) {
        listIndexes.forEach((listIndex) => {
          this.list[listIndex].appendChild(frag[listIndex])
        })
      }
    }

    Object.keys(this._listIndexes || {}).forEach((overflowGroupIndex) => {
      this._listIndexes[overflowGroupIndex].forEach((index) => {
        this.overflowList[index].innerHTML = ''
      })
    })

    this._currentOverflowGroups = []
  }

  /**
   * Reset, check overflow and move items to overflow element if overflowing
   *
   * @private
   * @param {function} done
   * @return {void}
   */

  _setNav (done) {
    this._resetNav()
    this.afterReset()

    let overflowGroupIndex = 0
    let lastOverflowGroupIndex = 0
    const frag = {}
    let overflow = this._overflowing(this._listIndexes[overflowGroupIndex])
    const ogOverflow = overflow

    this._listIndexes[overflowGroupIndex].forEach((index) => {
      frag[index] = document.createDocumentFragment()
    })

    this.isOverflowing = ogOverflow
    this.open.style.display = 'block'

    while (overflow) {
      const overflowGroup = this._overflowGroups[overflowGroupIndex]

      overflowGroup.forEach((item) => {
        const listIndex = parseInt(item.getAttribute('data-list-index'))

        frag[listIndex].appendChild(item)
      })

      this._currentOverflowGroups.push(overflowGroup)

      overflowGroupIndex += 1
      overflow = this._overflowing(this._listIndexes[overflowGroupIndex])

      if (overflow) {
        lastOverflowGroupIndex = overflowGroupIndex
      }
    }

    this._listIndexes[lastOverflowGroupIndex].forEach((index) => {
      this.overflowList[index].appendChild(frag[index])
    })

    if (this._currentOverflowGroups.length > 0) {
      if (this.nav.getAttribute('data-nav-overflow') === 'false') {
        this.nav.setAttribute('data-nav-overflow', 'true')
      }

      if (this._currentOverflowGroups.length === this._overflowGroupsLength) {
        if (this.nav.getAttribute('data-nav-overflow-all') === 'false') {
          this.nav.setAttribute('data-nav-overflow-all', 'true')
        }
      }
    } else {
      this._toggle(true)
    }

    this.onSet()

    this.open.style.display = ''

    if (done !== undefined) {
      done.call(this)
    }
  }

  /**
   * Check if items are overflowing onto new line
   *
   * @private
   * @param {array} listIndexes
   * @return {void}
   */

  _overflowing (listIndexes = [0]) {
    let overflow = false

    listIndexes.forEach((index) => {
      const items = this.list[index].querySelectorAll(this.itemSelector)
      const itemsLength = items.length

      /* All items are in overflow element now */

      if (itemsLength === 0) {
        overflow = false
        return
      }

      /* Check for scroll to determine overflow */

      const scroll = this.list[index].scrollWidth > this.list[index].clientWidth

      if (scroll) {
        overflow = true
      }
    })

    return overflow
  }

  /**
   * Open/close overflow element - set and unset data attributes and toggleFocusability
   *
   * @private
   * @param {boolean} close
   * @return {void}
   */

  _toggle (close = true) {
    this.onToggle(!close)

    this._navOpen = !close

    toggleFocusability(!this._navOpen, getOuterFocusableItems(this.overflow))

    if (!close) {
      cascade([
        {
          action: () => {
            stopScroll(true)

            this.nav.setAttribute('data-nav-show', '')
            this.nav.setAttribute('data-nav-open', 'true')
          }
        },
        {
          action: () => {
            this.nav.setAttribute('data-nav-show-overflow', '')
          },
          delay: this.delay.open
        },
        {
          action: () => {
            if (this._firstFocusableItem) {
              setTimeout(() => {
                this._firstFocusableItem.focus()
              }, this.delay.open)
            }

            this.nav.setAttribute('data-nav-show-overflow', 'items')
          }
        }
      ])
    } else {
      cascade([
        {
          action: () => {
            this.nav.setAttribute('data-nav-show-overflow', '')
          }
        },
        {
          action: () => {
            this.nav.removeAttribute('data-nav-show')
            this.nav.removeAttribute('data-nav-show-overflow')
          },
          delay: this.delay.close
        },
        {
          action: () => {
            this.nav.setAttribute('data-nav-open', 'false')

            stopScroll(false)

            setTimeout(() => {
              this.open.focus()
            }, 100)
          }
        },
        {
          action: () => {
            this.endToggle(this._navOpen)
          }
        }
      ])
    }
  }

  /**
   * Click handler on close button and overlay element - close overflow element
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _clickClose (e) {
    e.preventDefault()

    this._toggle()
  }

  /**
   * Click handler on open button element - open overflow element
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _clickOpen (e) {
    e.preventDefault()

    this._toggle(false)
  }

  /**
   * Keydown handler on document element - close overflow element on escape
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _keyDown (e) {
    if (getKey(e) === 'ESC' && this._navOpen) {
      this._toggle()
    }
  }

  /**
   * Resize event handler - reset overflow
   *
   * @private
   * @return {void}
   */

  _resize () {
    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      this._setNav()
      this.onResize()
    }, 100)
  }
}

/* Exports */

export { Nav }
