/**
 * Components: nav
 *
 * @param {object} args {
 *  @param {HTMLElement} nav
 *  @param {HTMLElement/array} list
 *  @param {HTMLElement} overflow
 *  @param {HTMLElement/array} overflowList
 *  @param {HTMLElement} items
 *  @param {string} itemSelector
 *  @param {HTMLElement} button
 *  @param {HTMLElement} overlay
 *  @param {HTMLElement} transition
 *  @param {function} onSet
 *  @param {function} onReset
 *  @param {function} afterReset
 *  @param {function} onResize
 *  @param {function} onToggle
 *  @param {function} endToggle
 *  @param {function} filterFocusableItem
 *  @param {function} done
 *  @param {object} delay {
 *   @param {int} open
 *   @param {int} close
 *  }
 * }
 */

/* Imports */

import {
  cascade,
  toggleFocusability,
  focusSelector,
  getKey,
  stopScroll
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
      open = null,
      close = null,
      overlay = null,
      transition = null,
      onSet = () => {},
      onReset = () => {},
      afterReset = () => {},
      onResize = () => {},
      onToggle = () => {},
      endToggle = () => {},
      filterFocusableItem = () => true,
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
    this.transition = transition
    this.onSet = onSet
    this.onReset = onReset
    this.afterReset = afterReset
    this.onResize = onResize
    this.onToggle = onToggle
    this.endToggle = endToggle
    this.filterFocusableItem = filterFocusableItem
    this.done = done
    this.delay = delay

    /* Not part of args but can be changed in function args */

    this.isOverflowing = false

    /**
     * Internal variables
     */

    this._viewportWidth = window.innerWidth

    /* Put items into groups */

    this._overflowGroups = {}
    this._overflowGroupsLength = 0

    this._listIndexes = {}

    /* Store groups currently overflown */

    this._currentOverflowGroups = []

    /* Store focusable elements outside nav */

    this._focusableItems = []

    /* Store first focusable element */

    this._firstFocusableItem = null

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
      'open',
      'close'
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

    let navFocusableItems = Array.from(this.nav.querySelectorAll(focusSelector))

    if (navFocusableItems.length) {
      navFocusableItems = navFocusableItems.filter(item => {
        if (item !== this.open && this.filterFocusableItem(item)) {
          return true
        }

        return false
      })

      this._firstFocusableItem = navFocusableItems[0]

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

    this.open.addEventListener('click', this._clickHandler)
    this.close.addEventListener('click', this._clickHandler)

    if (this.overlay) {
      this.overlay.addEventListener('click', this._clickHandler)
    }

    document.body.addEventListener('keydown', this._keyDownHandler)
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

    this.nav.setAttribute('data-overflow', 'false')
    this.nav.setAttribute('data-overflow-all', 'false')

    if (this._currentOverflowGroups.length > 0) {
      let appendFrag = true

      const frag = {}
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
        } else { // Insert
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
    this.open.style.display = 'block'

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
      if (this.nav.getAttribute('data-overflow') === 'false') { this.nav.setAttribute('data-overflow', 'true') }

      if (this._currentOverflowGroups.length === this._overflowGroupsLength) {
        if (this.nav.getAttribute('data-overflow-all') === 'false') { this.nav.setAttribute('data-overflow-all', 'true') }
      }
    } else {
      this._toggle(true)
    }

    this.onSet()

    this.open.style.display = ''

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

      /* Check for scroll to determine overflow */

      const scroll = this.list[index].scrollWidth > this.list[index].clientWidth

      if (scroll) {
        overflow = true
      }
    })

    return overflow
  }

  /**
   * Open/close mobile navigation
   */

  _toggle (close = true) {
    this.onToggle(!close)

    this._navOpen = !close

    toggleFocusability(!this._navOpen, this._focusableItems)

    if (!close) {
      cascade([
        {
          action: () => {
            this.open.setAttribute('data-show', '')

            stopScroll(true)

            this.nav.setAttribute('data-open', 'true')

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
            if (this._firstFocusableItem) {
              this._firstFocusableItem.focus()
            }

            this.close.style.setProperty('visibility', 'visible')

            this.overflow.setAttribute('data-show-items', '')
          }
        },
        {
          action: () => {
            this.open.style.setProperty('visibility', 'hidden')
          }
        }
      ])
    } else {
      cascade([
        {
          action: () => {
            this.open.style.setProperty('visibility', 'visible')
            this.close.style.setProperty('visibility', 'hidden')

            this.overflow.removeAttribute('data-show-items')
          }
        },
        {
          action: () => {
            this.open.removeAttribute('data-show')

            this.overflow.removeAttribute('data-show')

            if (this.transition) { this.transition.removeAttribute('data-show') }
          },
          delay: this.delay.close
        },
        {
          action: () => {
            this.nav.setAttribute('data-open', 'false')

            stopScroll(false)

            this.open.focus()
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
    if (getKey(e) === 'ESC' && this._navOpen) {
      this._toggle()
    }
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
