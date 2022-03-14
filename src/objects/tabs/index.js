/**
 * Objects: tabs
 *
 * @param args [object] {
 *  @param tabs nodelist of [HTMLElement]
 *  @param panels nodelist of [HTMLElement]
 *  @param orientation [string]
 * }
 */

/* Imports */

import { mergeObjects } from '../../utils'

/* Class */

class Tabs {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

    this.tabs = null
    this.panels = null
    this.orientation = 'horizontal'

    /* Merge default variables with args */

    mergeObjects(this, args)

    /**
     * Internal variables
     */

    /* For key events */

    this._KEYS = {
      35: 'END',
      36: 'HOME',
      ArrowLeft: 'LEFT',
      37: 'LEFT',
      ArrowUp: 'UP',
      38: 'UP',
      ArrowRight: 'RIGHT',
      39: 'RIGHT',
      ArrowDown: 'DOWN',
      40: 'DOWN',
      Enter: 'ENTER',
      13: 'ENTER',
      Space: 'SPACE',
      32: 'SPACE'
    }

    this._currentIndex = 0
    this._lastIndex = 0
    this._lastTabIndex = 0

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) { return false }
  }

  /**
   * Initialize
   */

  _initialize () {
    /* Check that required variables not null */

    if (!this.tabs || !this.panels) { return false }

    this.tabs = Array.from(this.tabs)
    this.panels = Array.from(this.panels);

    /* Bind all event handlers for referencability */

    [
      'clickTab',
      'keyDown',
      'keyUp'
    ].forEach(method => {
      this[`_${method}`] = this[`_${method}`].bind(this)
    })

    this._lastTabIndex = this.tabs.length - 1

    /* Add event listeners */

    this.tabs.forEach((tab, index) => {
      tab.setAttribute('data-index', index)

      tab.addEventListener('click', this._clickTab)
      tab.addEventListener('keydown', this._keyDown)
      tab.addEventListener('keyup', this._keyUp)

      const selected = tab.getAttribute('aria-selected')

      if (selected === 'true') { this._currentIndex = index }
    })

    return true
  }

  /**
   * Internal helpers
   */

  _activate (currentIndex) {
    this._lastIndex = this._currentIndex
    this._currentIndex = currentIndex

    const tab = this.tabs[this._currentIndex]
    const lastTab = this.tabs[this._lastIndex]

    /* Deactivate last tab */

    lastTab.setAttribute('tabindex', '-1')
    lastTab.setAttribute('aria-selected', 'false')

    this.panels[this._lastIndex].setAttribute('hidden', 'hidden')

    /* Activate current tab */

    tab.removeAttribute('tabindex')
    tab.setAttribute('aria-selected', 'true')

    this.panels[this._currentIndex].removeAttribute('hidden')
  }

  _getIndex (tab) {
    return parseInt(tab.getAttribute('data-index'))
  }

  _focus (index) {
    if (index < 0) { index = this._lastTabIndex }

    if (index > this._lastTabIndex) { index = 0 }

    this.tabs[index].focus()
  }

  /**
   * Event handlers
   */

  _clickTab (e) {
    this._activate(this._getIndex(e.currentTarget))
  }

  _keyDown (e) {
    const key = e.keyCode || e.which || e.code || e.key
    let index = this._getIndex(e.currentTarget)
    let focus = true

    switch (this._KEYS[key]) {
      case 'END': // last tab
        e.preventDefault()
        index = this._lastTabIndex
        break
      case 'HOME': // first tab
        e.preventDefault()
        index = 0
        break

        /* Up and down here to prevent page scroll */

      case 'UP': // prev tab
        if (this.orientation === 'horizontal') {
          focus = false
        } else {
          e.preventDefault()
          index--
        }
        break
      case 'DOWN': // next tab
        if (this.orientation === 'horizontal') {
          focus = false
        } else {
          e.preventDefault()
          index++
        }
        break
    }

    if (focus) { this._focus(index) }
  }

  _keyUp (e) {
    const key = e.keyCode || e.which || e.code || e.key
    let index = this._getIndex(e.currentTarget)
    let focus = true

    switch (this._KEYS[key]) {
      case 'LEFT': // prev tab
        if (this.orientation === 'vertical') {
          focus = false
        } else {
          index--
        }
        break
      case 'RIGHT': // next tab
        if (this.orientation === 'vertical') {
          focus = false
        } else {
          index++
        }
        break
      case 'ENTER':
      case 'SPACE':
        this._activate(index)
        focus = false
        break
    }

    if (focus) { this._focus(index) }
  }
} // End Tabs

/* Exports */

export default Tabs
