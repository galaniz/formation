/**
 * Objects - tabs
 *
 * @param {object} args
 * @param {NodeList} args.tabs
 * @param {NodeList} args.panels
 * @param {number} args.delay
 * @param {string} args.orientation
 */

/* Imports */

import { getKey } from '../../utils'

/* Class */

class Tabs {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    const {
      tabs = null,
      panels = null,
      delay = 0,
      orientation = 'horizontal',
      init = true,
      beforeInitActivate = () => {},
      afterIndexesSet = () => {},
      onDeactivate = () => {},
      onActivate = () => {}
    } = args

    this.tabs = tabs
    this.panels = panels
    this.delay = delay
    this.orientation = orientation
    this.beforeInitActivate = beforeInitActivate
    this.afterIndexesSet = afterIndexesSet
    this.onDeactivate = onDeactivate
    this.onActivate = onActivate

    /**
     * Internal variables
     */

    /* Track current and previously current */

    this._currentIndex = 0
    this._lastIndex = 0

    /* Last tab/panel index */

    this._lastTabIndex = 0

    /* Equal to currentIndex - for filtering purposes */

    this._panelIndex = 0
    this._lastPanelIndex = 0
    this._tabIndex = 0

    /* For instances when delay before focusing panels required */

    this._focusDelay = 0

    /* Store panel to focus */

    this._focusItem = null

    /**
     * Initialize
     */

    if (init) {
      const initialize = this._initialize()

      if (!initialize) {
        return false
      }
    }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.tabs || !this.panels) {
      return false
    }

    this.tabs = Array.from(this.tabs)
    this.panels = Array.from(this.panels)

    /* Bind all event handlers for referencability */

    const events = ['click', 'keyDown', 'keyUp']

    events.forEach(method => {
      this[`_${method}Event`] = this[`_${method}`].bind(this)
    })

    /* Get last tab/panel index */

    this._lastTabIndex = this.tabs.length - 1

    /* Add event listeners */

    let currentIndex = this._currentIndex

    this.tabs.forEach((tab, index) => {
      tab.setAttribute('data-index', index)

      tab.addEventListener('click', this._clickEvent)
      tab.addEventListener('keydown', this._keyDownEvent)
      tab.addEventListener('keyup', this._keyUpEvent)

      const selected = tab.getAttribute('aria-selected')

      if (selected === 'true') {
        currentIndex = index
      }
    })

    /* Set current based on location hash */

    const hash = window.location.hash

    if (hash) {
      let hashIndex = null

      this.tabs.forEach((tab, index) => {
        if (!tab.hasAttribute('href')) {
          return
        }

        const href = tab.href.split('#')

        if (href.length < 2) {
          return
        }

        if ('#' + href[1] === hash) {
          hashIndex = index
        }
      })

      if (hashIndex !== null) {
        currentIndex = hashIndex
      }
    }

    /* Activate current */

    this.beforeInitActivate()

    this._activate({
      currentIndex,
      focus: false,
      source: 'init'
    })

    /* Init successful */

    return true
  }

  /**
   * Hide, show and focus panels and tabs
   */

  _activate (args) {
    const {
      currentIndex = 0,
      focus = true
    } = args

    this._lastIndex = this._currentIndex
    this._currentIndex = currentIndex

    if (this._currentIndex > this._lastTabIndex) {
      this._currentIndex = this._lastTabIndex
    }

    this._panelIndex = this._currentIndex
    this._lastPanelIndex = this._lastIndex
    this._tabIndex = this._currentIndex

    this.afterIndexesSet(args)

    const tab = this.tabs[this._tabIndex]
    const lastTab = this.tabs[this._lastIndex]

    /* Deactivate last tab */

    lastTab.setAttribute('tabindex', '-1')
    lastTab.setAttribute('aria-selected', 'false')

    /* Deactivate last panel */

    this.panels[this._lastPanelIndex].setAttribute('data-selected', 'false')
    this.onDeactivate(args)

    /* Activate current tab */

    tab.setAttribute('tabindex', '0')
    tab.setAttribute('aria-selected', 'true')

    /* Activate current panel */

    this.panels[this._panelIndex].setAttribute('data-selected', 'true')
    this.onActivate(args)

    this._focusItem = this.panels[this._panelIndex]

    setTimeout(() => {
      this._displayPanels()

      if (focus) {
        setTimeout(() => {
          this._focusItem.focus()
        }, this._focusDelay)
      }
    }, this.delay)
  }

  _displayPanels () {
    this.panels[this._lastPanelIndex].setAttribute('hidden', '')
    this.panels[this._panelIndex].removeAttribute('hidden')
  }

  /**
   * Other helpers
   */

  _getIndex (tab) {
    return parseInt(tab.getAttribute('data-index'))
  }

  _focus (index) {
    if (index < 0) {
      index = this._lastTabIndex
    }

    if (index > this._lastTabIndex) {
      index = 0
    }

    this.tabs[index].focus()
  }

  /**
   * Event handlers
   */

  _click (e) {
    this._activate({
      currentIndex: this._getIndex(e.currentTarget),
      source: 'click'
    })
  }

  _keyDown (e) {
    let index = this._getIndex(e.currentTarget)
    let focus = true

    switch (getKey(e)) {
      case 'END': // Last tab
        e.preventDefault()
        index = this._lastTabIndex
        break
      case 'HOME': // First tab
        e.preventDefault()
        index = 0
        break

        /* Up and down here to prevent page scroll */

      case 'UP': // Prev tab
        if (this.orientation === 'horizontal') {
          focus = false
        } else {
          e.preventDefault()
          index--
        }
        break
      case 'DOWN': // Next tab
        if (this.orientation === 'horizontal') {
          focus = false
        } else {
          e.preventDefault()
          index++
        }
        break
    }

    if (focus) {
      this._focus(index)
    }
  }

  _keyUp (e) {
    let index = this._getIndex(e.currentTarget)
    let focus = true

    switch (getKey(e)) {
      case 'LEFT': // Previous tab
        if (this.orientation === 'vertical') {
          focus = false
        } else {
          index--
        }
        break
      case 'RIGHT': // Next tab
        if (this.orientation === 'vertical') {
          focus = false
        } else {
          index++
        }
        break
    }

    if (focus) {
      this._focus(index)
    }
  }
}

/* Exports */

export default Tabs
