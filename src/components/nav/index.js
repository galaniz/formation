/**
 * Components: nav
 *
 * @param args [object] {
 *  @param nav [HTMLElement]
 *  @param list [HTMLElement] or [array]
 *  @param overflow [HTMLElement]
 *  @param overflowList [HTMLElement] or [array]
 *  @param items [HTMLElement]
 *  @param itemSelector [string]
 *  @param button [HTMLElement]
 *  @param overlay [HTMLElement]
 *  @param transition [HTMLElement]
 *  @param overflowHiddenClass [string]
 *  @param onSet [function]
 *  @param onReset [function]
 *  @param afterReset [function]
 *  @param onResize [function]
 *  @param onToggle [function]
 *  @param endToggle [function]
 *  @param done [function]
 *  @param delay [object] {
 *   @param open [int]
 *   @param close [int]
 *  }
 * }
 */

/* Imports */

import {
  cascade,
  toggleFocusability,
  focusSelector
} from '../../utils'

/* Class */

class Nav {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      nav = null,
      list = null,
      overflow = null,
      overflowList = null,
      items = null,
      itemSelector = '',
      button = null,
      overlay = null,
      transition = null,
      overflowHiddenClass = 'u-o-h',
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
    this.button = button
    this.overlay = overlay
    this.transition = transition
    this.overflowHiddenClass = overflowHiddenClass
    this.onSet = onSet
    this.onReset = onReset
    this.afterReset = afterReset
    this.onResize = onResize
    this.onToggle = onToggle
    this.endToggle = endToggle
    this.done = done
    this.delay = delay

    /* Not part of args but can be changed in function args */

    this.isOverflowing = false

    /**
     * Internal variables
     */

    this._html = document.documentElement
    this._viewportWidth = window.innerWidth

    /* Escape key for closing nav */

    this._esc = [27, 'Escape']

    /* Put items into groups */

    this._overflowGroups = {}
    this._overflowGroupsLength = 0

    this._listIndexes = {}

    /* Store groups currently overflown */

    this._currentOverflowGroups = []

    /* Store focusable elements outside nav */

    this._focusableItems = []

    /* For throttling resize event */

    this._resizeTimer = null

    /* Store if nav is open */

    this._navOpen = false

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) {
      this.done()
      return false
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    let error = false
    const required = [
      'nav',
      'list',
      'overflow',
      'overflowList',
      'items',
      'itemSelector',
      'button'
    ]

    required.forEach((r) => {
      if (!this[r]) {
        error = true
      }
    })

    if (error) { return false }

    /* Convert list(s) and overflow list(s) to arrays */

    this.list = !Array.isArray(this.list) ? [this.list] : this.list
    this.overflowList = !Array.isArray(this.overflowList) ? [this.overflowList] : this.overflowList

    this.items = Array.from(this.items)

    if (!this.items.length) { return false }

    /* Get focusable elements */

    const navFocusableItems = Array.from(this.nav.querySelectorAll(focusSelector))

    if (navFocusableItems.length) {
      this._focusableItems = Array.from(document.querySelectorAll(focusSelector))

      this._focusableItems = this._focusableItems.filter(item => {
        if (navFocusableItems.indexOf(item) === -1) {
          return true
        }

        return false
      })
    }

    /* Event listeners */

    this._clickHandler = this._click.bind(this)
    this._keyDownHandler = this._keyDown.bind(this)
    this._resizeHandler = this._resize.bind(this)

    this.button.addEventListener('click', this._clickHandler)
    this.nav.addEventListener('keydown', this._keyDownHandler)

    if (this.overlay) { this.overlay.addEventListener('click', this._clickHandler) }

    window.addEventListener('resize', this._resizeHandler)

    /* Set up overflow groups */

    this.items.forEach((item, index) => {
      let overflowGroupIndex = parseInt(item.getAttribute('data-overflow-group'))
      let listIndex = 0

      if (!item.hasAttribute('data-list-index')) {
        item.setAttribute('data-list-index', listIndex)
      } else {
        listIndex = parseInt(item.getAttribute('data-list-index'))
      }

      if (isNaN(overflowGroupIndex)) { overflowGroupIndex = index }

      if (!Object.getOwnPropertyDescriptor(this._overflowGroups, overflowGroupIndex)) {
        this._overflowGroups[overflowGroupIndex] = []
        this._listIndexes[overflowGroupIndex] = []
        this._overflowGroupsLength++
      }

      this._overflowGroups[overflowGroupIndex].push(item)

      if (this._listIndexes[overflowGroupIndex].indexOf(listIndex) === -1) { this._listIndexes[overflowGroupIndex].push(listIndex) }
    })

    window.addEventListener('load', () => {
      this._setNav(() => {
        this.done()
      })
    })

    return true
  }

  /**
   * Helper methods for setting up nav
   */

  /* Return overflowing items to list */

  _resetNav () {
    this.onReset()

    this.nav.removeAttribute('data-overflow')
    this.nav.removeAttribute('data-overflow-all')

    this._lastOverflowFocus = null

    if (this._currentOverflowGroups.length > 0) {
      const frag = {}
      let appendFrag = true
      const listIndexes = []

      for (const overflowGroupIndex in this._listIndexes) {
        this._listIndexes[overflowGroupIndex].forEach((index) => {
          frag[index] = document.createDocumentFragment()
        })
      }

      this.items.forEach((item, i) => {
        const listIndex = parseInt(item.getAttribute('data-list-index'))

        /* Insert at specific index */

        if (item.hasAttribute('data-index')) {
          appendFrag = false

          const index = parseInt(item.getAttribute('data-index'))
          const refNode = this.list[listIndex].children[index]

          this.list[listIndex].insertBefore(item, refNode)
        } else { // insert
          frag[listIndex].appendChild(item)
        }

        if (listIndexes.indexOf(listIndex) === -1) { listIndexes.push(listIndex) }
      })

      /* Append overflowing items */

      if (appendFrag) {
        listIndexes.forEach((listIndex) => {
          this.list[listIndex].appendChild(frag[listIndex])
        })
      }
    }

    for (const overflowGroupIndex in this._listIndexes) {
      this._listIndexes[overflowGroupIndex].forEach((index) => {
        this.overflowList[index].innerHTML = ''
      })
    }

    this._currentOverflowGroups = []
  }

  /* If overflowing transfer items over to overflow element */

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
    this.button.style.display = 'block'

    while (overflow) {
      const overflowGroup = this._overflowGroups[overflowGroupIndex]

      overflowGroup.forEach((item) => {
        const listIndex = parseInt(item.getAttribute('data-list-index'))

        frag[listIndex].appendChild(item)
      })

      this._currentOverflowGroups.push(overflowGroup)

      overflowGroupIndex++
      overflow = this._overflowing(this._listIndexes[overflowGroupIndex])

      if (overflow) { lastOverflowGroupIndex = overflowGroupIndex }
    }

    this._listIndexes[lastOverflowGroupIndex].forEach((index) => {
      this.overflowList[index].appendChild(frag[index])
    })

    if (this._currentOverflowGroups.length > 0) {
      if (!this.nav.hasAttribute('data-overflow')) { this.nav.setAttribute('data-overflow', '') }

      if (this._currentOverflowGroups.length === this._overflowGroupsLength) {
        if (!this.nav.hasAttribute('data-overflow-all')) { this.nav.setAttribute('data-overflow-all', '') }
      }
    } else {
      this._toggle(true)
    }

    this.onSet()

    this.button.style.display = ''

    if (done !== undefined) { done.call(this) }
  }

  /* Check if items are overflowing/wrapping into new line */

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

      const firstItemOffset = items[0].offsetTop

      /* Reverse loop to start from last item */

      for (let i = itemsLength - 1; i >= 0; i--) {
        if (items[i].offsetTop > firstItemOffset) {
          overflow = true
          return
        }
      }
    })

    return overflow
  }

  /**
   * Prevent scroll when open mobile navigation
   */

  _disableScroll (disable = true) {
    if (disable) {
      this._html.classList.add(this.overflowHiddenClass)
    } else {
      this._html.classList.remove(this.overflowHiddenClass)
    }
  }

  /**
   * Open/close mobile navigation
   */

  _toggle (close = true) {
    this.onToggle()

    this._navOpen = !close

    toggleFocusability(!this._navOpen, this._focusableItems)

    if (close === false) {
      cascade([
        {
          action: () => {
            this.button.setAttribute('data-show', '')

            this._disableScroll()

            this.button.setAttribute('aria-expanded', 'true')
            this.nav.setAttribute('data-open', '')

            if (this.transition) { this.transition.setAttribute('data-show', '') }
          }
        },
        {
          action: () => {
            this.overflow.setAttribute('data-show', '')
          },
          delay: this.delay.open
        },
        {
          action: () => {
            this.overflow.setAttribute('data-show-items', '')
          }
        }
      ])
    } else {
      cascade([
        {
          action: () => {
            this.overflow.removeAttribute('data-show-items')
          }
        },
        {
          action: () => {
            this.button.removeAttribute('data-show')
            this.overflow.removeAttribute('data-show')

            if (this.transition) { this.transition.removeAttribute('data-show') }
          },
          delay: this.delay.close
        },
        {
          action: () => {
            this.nav.removeAttribute('data-open')

            this._disableScroll(false)
            this.button.setAttribute('aria-expanded', 'false')
          }
        },
        {
          action: () => {
            this.endToggle()
          }
        }
      ])
    }
  }

  /**
   * Event handlers
   */

  /* When click on button/overlay */

  _click (e) {
    e.preventDefault()

    this._toggle(this._navOpen)
  }

  /* If hit escape while nav open close */

  _keyDown (e) {
    const key = e.key || e.keyCode || e.which || e.code

    if (this._esc.indexOf(key) !== -1) { this._toggle() }
  }

  /* Viewport resize */

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

  /**
   * Public methods
   */

  addFocusableItem (item) {
    if (!item) { return }

    this._focusableItems.push(item)
  }
} // End Nav

/* Exports */

export default Nav
