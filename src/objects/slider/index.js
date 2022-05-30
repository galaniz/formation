/**
 * Objects: slider
 *
 * @param args [object] {
 *  @param slider [HTMLElement]
 *  @param sliderPerPanel [array] of objects
 *  @param sliderItems nodelist of [HTMLElement]
 * }
 */

/* Imports */

import Tabs from '../tabs'
import {
  toggleFocusability,
  focusSelector
} from '../../utils'

/* Class */

class Slider extends Tabs {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Base variables + init
     */

    const {
      slider = null,
      sliderTrack = null,
      sliderHeight = null,
      sliderItems = [],
      sliderPerPanel = []
    } = args

    if (!slider || !sliderTrack) {
      return false
    }

    args.init = false

    super(args)

    this.slider = slider
    this.sliderTrack = sliderTrack
    this.sliderHeight = sliderHeight
    this.sliderItems = sliderItems
    this.sliderPerPanel = sliderPerPanel

    this.beforeInitActivate = () => {
      this._beforeInitActivate()
    }

    this.onDeactivate = (args) => {
      this._onDeactivate(args)
    }

    this.onActivate = (args) => {
      this._onActivate(args)
    }

    /**
     * Internal variables
     */

    /* Track current and previously current */

    this._lastIndexFocusableItems = []

    /* For scroll event and setting */

    this._scrollTimer = null
    this._scrollOffsets = []

    /* For scroll with grouped panels */

    this._resizeTimer = null
    this._viewportWidth = window.innerWidth

    this._smoothScrollSupported = false

    this._sliderItemsLength = this.sliderItems.length
    this._sliderRearrange = this._sliderItemsLength && this.sliderPerPanel.length

    /**
     * Initialize
     */

    const initialize = this._initialize()

    if (!initialize) { return false }
  }

  /**
   * Initialize
   */

  _beforeInitActivate () {
    /* Check smooth scroll support */

    if (window.CSS.supports('(scroll-behavior: smooth)')) {
      this._smoothScrollSupported = true
    }

    /* Set height to hide scrollbar */

    this._setHeight()

    /* Listen for slider scroll + resize */

    this._scrollEvent = this._scroll.bind(this)
    this._resizeEvent = this._resize.bind(this)

    this.sliderTrack.addEventListener('scroll', this._scrollEvent)
    window.addEventListener('resize', this._resizeEvent)

    /* Set slider panel ranges */

    if (this._sliderRearrange) {
      const sliderPerPanelLength = this.sliderPerPanel.length

      this.sliderPerPanel.forEach((s, i) => {
        const low = s.breakpoint
        let high = 99999

        if (sliderPerPanelLength > 1 && i < sliderPerPanelLength - 1) { high = this.sliderPerPanel[i + 1].breakpoint }

        s.low = low
        s.high = high
        s.panels = Math.ceil(this._sliderItemsLength / s.items)
      })

      this._arrangeItems()
    }

    /* Activate current */

    this.panels.forEach((panel, index) => {
      if (this._currentIndex !== index) {
        const focusableItems = Array.from(panel.querySelectorAll(focusSelector))
        focusableItems.unshift(panel)
        toggleFocusability(false, focusableItems)
      }

      if (index > this._lastTabIndex) {
        return
      }

      this._scrollOffsets.push(panel.offsetLeft)
    })
  }

  /**
   * Hide, show and focus panels and tabs
   */

  _onDeactivate (args) {
    const {
      source = ''
    } = args

    if (source !== 'init') {
      if (!this._lastIndexFocusableItems.length) {
        this._lastIndexFocusableItems = Array.from(this.panels[this._lastIndex].querySelectorAll(focusSelector))
        this._lastIndexFocusableItems.unshift(this.panels[this._lastIndex])
      }

      toggleFocusability(false, this._lastIndexFocusableItems)

      const currentFocusableItems = Array.from(this.panels[this._currentIndex].querySelectorAll(focusSelector))
      currentFocusableItems.unshift(this.panels[this._currentIndex])
      toggleFocusability(true, currentFocusableItems)

      this._lastIndexFocusableItems = currentFocusableItems
    }
  }

  _onActivate (args) {
    const {
      source = ''
    } = args

    if (source !== 'scroll') {
      if (this._smoothScrollSupported) {
        this.sliderTrack.scroll({
          top: 0,
          left: this._scrollOffsets[this._currentIndex],
          behavior: 'smooth'
        })
      } else {
        // Fallback for when smooth scroll not supported
        this._scrollTo(this._scrollOffsets[this._currentIndex])
      }
    }
  }

  _displayPanels () {
    this.panels[this._lastIndex].setAttribute('aria-hidden', 'true')
    this.panels[this._currentIndex].setAttribute('aria-hidden', 'false')
  }

  /**
   * Internal helpers
   */

  _setHeight () {
    if (!this.sliderHeight) {
      return
    }

    const height = this.sliderHeight.clientHeight

    this.slider.style.setProperty('--height', (height / 16) + 'rem')
  }

  _arrangeItems (resize = false) {
    if (!this._sliderRearrange) {
      return
    }

    let numberOfPanels = 1
    let perPanel = 1
    const map = []

    this.sliderPerPanel.forEach(s => {
      if (this._viewportWidth >= s.low && this._viewportWidth < s.high) {
        numberOfPanels = s.panels
        perPanel = s.items
      }
    })

    let start = 0

    for (let i = 0; i < numberOfPanels; i++) {
      map.push([])

      for (let j = start; j < perPanel + start; j++) {
        if (j < this._sliderItemsLength) {
          map[i].push(j)
        }
      }

      start += perPanel
    }

    /* Update tabs */

    this.tabs.forEach((t, index) => {
      if (index >= numberOfPanels) {
        t.style.display = 'none'
        this.panels[index].style.display = 'none'
      } else {
        t.style.display = ''
        this.panels[index].style.display = ''
      }
    })

    this._lastTabIndex = numberOfPanels - 1

    /* Put changes in slider in fragment then append */

    const frag = new window.DocumentFragment()

    frag.appendChild(this.sliderTrack)

    const groups = Array.from(frag.querySelectorAll('.o-slider__view'))

    groups.forEach((g, index) => {
      if (index >= numberOfPanels) {
        return
      }

      const m = map[index]

      m.forEach(n => {
        g.appendChild(this.sliderItems[n])
      })
    })

    this.slider.appendChild(frag)
  }

  _scrollTo (to) {
    let start = null
    let done = false
    const duration = 500
    const from = this.sliderTrack.scrollLeft
    const dir = to > from ? 'right' : 'left'

    this.sliderTrack.style.setProperty('--snap-type', 'none')

    /*
     Source: https://spicyyoghurt.com/tools/easing-functions
     t = time
     b = beginning value
     c = change in value
     d = duration
    */

    const ease = (t, b, c, d) => { // Sine ease in out
      return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    }

    const change = to - from

    const animate = (timestamp) => {
      if (start === null) {
        start = timestamp
      }

      const elapsed = timestamp - start

      if (elapsed < duration) {
        const v = ease(elapsed, from, change, duration)

        this.sliderTrack.scrollLeft = v

        if (dir === 'right') {
          if (v >= to) {
            done = true
          }
        } else {
          if (v <= to) {
            done = true
          }
        }

        if (!done) {
          window.requestAnimationFrame(animate)
        } else {
          this.sliderTrack.style.setProperty('--snap-type', '')
        }
      } else {
        this.sliderTrack.style.setProperty('--snap-type', '')
      }
    }

    window.requestAnimationFrame(animate)
  }

  /**
   * Event handlers
   */

  _scroll () {
    clearTimeout(this._scrollTimer)

    this._scrollTimer = setTimeout(() => {
      let newIndex = this._currentIndex

      const target = this.sliderTrack.scrollLeft
      const offsets = this._scrollOffsets

      const closestOffset = this._scrollOffsets.reduce((prev, curr) => {
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev)
      })

      newIndex = offsets.indexOf(closestOffset)

      if (newIndex !== this._currentIndex && newIndex !== -1) {
        this._activate({
          currentIndex: newIndex,
          focus: false,
          source: 'scroll'
        })
      }
    }, 100)
  }

  _resize () {
    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      /* Update height (to hide scrollbar) */

      this._setHeight()

      /* Shift items to different panels */

      if (this._sliderRearrange) {
        this._arrangeItems(true)
      }

      /* Reset offsets */

      this._scrollOffsets = []

      this.panels.forEach((panel, index) => {
        if (index > this._lastTabIndex) {
          return
        }

        this._scrollOffsets.push(panel.offsetLeft)
      })

      /* Activate */

      this._activate({
        currentIndex: this._currentIndex,
        focus: false,
        source: 'resize'
      })
    }, 100)
  }
} // End Slider

/* Exports */

export default Slider
