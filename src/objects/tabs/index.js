/**
 * Objects: tabs
 *
 * @param args [object] {
 *  @param tabs nodelist of [HTMLElement]
 *  @param panels nodelist of [HTMLElement]
 *  @param panelsDelay [int]
 *  @param orientation [string]
 * }
 */

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
      panelsDelay = 0,
      orientation = 'horizontal'
    } = args

    this.tabs = tabs
    this.panels = panels
    this.panelsDelay = panelsDelay
    this.orientation = orientation

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
      40: 'DOWN'
    }

    /* Track current and previously current */

    this._currentIndex = 0
    this._lastIndex = 0

    /* Last tab/panel index */

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
    this.panels = Array.from(this.panels)

    /* Bind all event handlers for referencability */

    const events = ['click', 'keyDown', 'keyUp']

    events.forEach(method => {
      this[`_${method}Event`] = this[`_${method}`].bind(this)
    })

    /* Get last tab/panel index */

    this._lastTabIndex = this.tabs.length - 1

    /* Add event listeners */

    this.tabs.forEach((tab, index) => {
      tab.setAttribute('data-index', index)

      tab.addEventListener('click', this._clickEvent)
      tab.addEventListener('keydown', this._keyDownEvent)
      tab.addEventListener('keyup', this._keyUpEvent)

      const selected = tab.getAttribute('aria-selected')

      if (selected === 'true') { this._currentIndex = index }
    })

    /* Set current based on location hash */

    const hash = window.location.hash

    if (hash) {
      let hashIndex = null

      this.tabs.forEach((tab, index) => {
        if ('#' + tab.href.split('#')[1] === hash) {
          hashIndex = index
        }
      })

      if (hashIndex !== null) {
        this._currentIndex = hashIndex
      }
    }

    /* Activate current */

    this._beforeInitActivate()

    this._activate({
      currentIndex: this._currentIndex,
      focus: false,
      source: 'init'
    })

    /* Init successful */

    return true
  }

  _beforeInitActivate (args) {
    return args
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

    const tab = this.tabs[this._currentIndex]
    const lastTab = this.tabs[this._lastIndex]

    /* Deactivate last tab */

    lastTab.setAttribute('tabindex', '-1')
    lastTab.setAttribute('aria-selected', 'false')

    /* Deactivate last panel */

    this.panels[this._lastIndex].setAttribute('data-selected', 'false')
    this._onDeactivate(args)

    /* Activate current tab */

    tab.setAttribute('tabindex', '0')
    tab.setAttribute('aria-selected', 'true')

    /* Activate current panel */

    this.panels[this._currentIndex].setAttribute('data-selected', 'true')
    this._onActivate(args)

    setTimeout(() => {
      this._displayPanels()

      if (focus) {
        this.panels[this._currentIndex].focus()
      }
    }, this.panelsDelay)
  }

  _onDeactivate (args) {
    return false
  }

  _onActivate (args) {
    return false
  }

  _displayPanels () {
    this.panels[this._lastIndex].setAttribute('hidden', '')
    this.panels[this._currentIndex].removeAttribute('hidden')
  }

  /**
   * Other helpers
   */

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

  _click (e) {
    this._activate({
      currentIndex: this._getIndex(e.currentTarget),
      source: 'click'
    })
  }

  _keyDown (e) {
    const key = e.keyCode || e.which || e.code || e.key
    let index = this._getIndex(e.currentTarget)
    let focus = true

    switch (this._KEYS[key]) {
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

    if (focus) { this._focus(index) }
  }

  _keyUp (e) {
    const key = e.keyCode || e.which || e.code || e.key
    let index = this._getIndex(e.currentTarget)
    let focus = true

    switch (this._KEYS[key]) {
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

    if (focus) { this._focus(index) }
  }
} // End Tabs

/* Exports */

export default Tabs
