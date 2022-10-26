/**
 * Objects: slider
 *
 * @param {object} args {
 *  @param {HTMLElement} slider
 *  @param {HTMLElement} track
 *  @param {HTMLElement} targetHeight
 *  @param {HTMLElement} prev
 *  @param {HTMLElement} next
 *  @param {array} breakpoints
 *  @param {array} groupItems
 *  @param {boolean} loop
 *  @param {boolean} reduceMotion
 * }
 */

/* Imports */

import Tabs from '../tabs'
import {
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
      container = null,
      slider = null,
      track = null,
      targetHeight = null,
      prev = null,
      next = null,
      groupItems = [],
      breakpoints = [],
      loop = false,
      reduceMotion = false
    } = args

    if (!slider || !track) {
      return false
    }

    args.init = false

    super(args)

    this.container = container
    this.slider = slider
    this.track = track
    this.targetHeight = targetHeight
    this.prev = prev
    this.next = next
    this.groupItems = groupItems
    this.breakpoints = breakpoints
    this.loop = loop
    this.reduceMotion = reduceMotion

    this.beforeInitActivate = () => {
      this._beforeInitActivate()
    }

    this.afterIndexesSet = (args) => {
      this._afterIndexesSet(args)
    }

    this.onDeactivate = (args) => {
      this._onDeactivate(args)
    }

    this.onActivate = (args) => {
      this._onActivate(args)
    }

    this._focusDelay = this.loop ? this.delay : 0

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

    this._groupItemsLength = this.groupItems.length
    this._rearrange = this._groupItemsLength && this.breakpoints.length

    /* For loop */

    this._currentInnerIndex = 0
    this._trackWidth = 0
    this._panelsParent = null
    this._panelsGroups = []
    this._ogLength = 0
    this._length = 0
    this._lastPanel = null
    this._firstPanel = null
    this._lastVisible = false
    this._firstVisible = false

    /**
     * Initialize
     */

    if (!this.container || !this.slider || !this.track) { return false }

    const initialize = this._initialize()

    if (!initialize) { return false }
  }

  /**
   * Initialize
   */

  _beforeInitActivate () {
    /* Set height to hide scrollbar */

    this._setHeight()

    /* Listen for slider scroll + resize */

    this._scrollEvent = this._scroll.bind(this)
    this._resizeEvent = this._resize.bind(this)

    this.track.addEventListener('scroll', this._scrollEvent)
    window.addEventListener('resize', this._resizeEvent)

    /* Prev next listeners */

    if (this.prev && this.next) {
      this._prevEvent = this._prev.bind(this)
      this._nextEvent = this._next.bind(this)

      this.prev.addEventListener('click', this._prevEvent)
      this.next.addEventListener('click', this._nextEvent)
    }

    /* Clone panels for loop slider */

    if (this.loop) {
      this._trackWidth = this.track.clientWidth
      this._ogLength = this.panels.length
      this._panelsGroups = [this.panels]
      this._panelsParent = this.panels[0].parentElement

      const panelsFrag = new window.DocumentFragment()

      panelsFrag.appendChild(this._panelsParent)

      const panels = this.panels

      for (let i = 0; i < 2; i++) {
        const panelsArr = []

        panels.forEach((p, index) => {
          const clone = p.cloneNode(true)

          clone.id = p.id + '-clone-' + i
          clone.setAttribute('data-selected', false)

          panelsArr.push(clone)

          this._panelsParent.appendChild(clone)
        })

        this._panelsGroups.push(panelsArr)

        this.panels = this.panels.concat(panelsArr)
      }

      this._length = this.panels.length
      this._lastPanel = this.panels[this._length - 1]
      this._firstPanel = this.panels[0]

      this.track.appendChild(panelsFrag)

      this._panelWidth = this._firstPanel.clientWidth
      this._panelInnerOffset = this._firstPanel.firstElementChild.offsetLeft
    }

    /* Set slider panel ranges */

    if (this._rearrange) {
      const breakpointsLength = this.breakpoints.length

      this.breakpoints.forEach((s, i) => {
        const low = s.breakpoint
        let high = 99999

        if (breakpointsLength > 1 && i < breakpointsLength - 1) { high = this.breakpoints[i + 1].breakpoint }

        s.low = low
        s.high = high
        s.panels = Math.ceil(this._groupItemsLength / s.items)
      })

      this._arrangeItems()
    }

    /* Activate current */

    this.panels.forEach((panel, index) => {
      if (this._currentIndex !== index) {
        const focusableItems = Array.from(panel.querySelectorAll(focusSelector))
        focusableItems.unshift(panel)
        this._toggleFocusability(false, focusableItems)
      }

      if (!this.loop && index > this._lastTabIndex) {
        return
      }

      this._scrollOffsets.push(panel.offsetLeft)
    })
  }

  /**
   * Hide, show and focus panels and tabs
   */

  _afterIndexesSet (args) {
    let {
      currentIndex = 0,
      source = ''
    } = args

    if (this.loop) {
      if (source === 'click') {
        currentIndex = currentIndex + (this._ogLength * this._currentInnerIndex)
      }

      this._lastPanelIndex = this._lastIndex + (this._ogLength * this._currentInnerIndex)

      if (this._lastIndex === 0) {
        this._lastPanelIndex = 0
      }

      this._currentInnerIndex = Math.floor(currentIndex / this._ogLength)

      this._currentIndex = currentIndex - (this._ogLength * this._currentInnerIndex)

      if (source === 'init') {
        this._currentInnerIndex = 1
      }

      this._panelIndex = this._currentIndex + (this._ogLength * this._currentInnerIndex)
      this._tabIndex = this._currentIndex
    }

    if (this.prev && this.next) {
      let prevDisabled = false
      let nextDisabled = false

      if (this._tabIndex === 0) {
        prevDisabled = true
      }

      if (this._tabIndex === this._lastTabIndex) {
        nextDisabled = true
      }

      this.prev.disabled = prevDisabled
      this.next.disabled = nextDisabled
    }
  }

  _onDeactivate (args) {
    const {
      source = ''
    } = args

    if (source !== 'init') {
      if (!this._lastIndexFocusableItems.length) {
        this._lastIndexFocusableItems = Array.from(this.panels[this._lastPanelIndex].querySelectorAll(focusSelector))
        this._lastIndexFocusableItems.unshift(this.panels[this._lastPanelIndex])
      }

      this._toggleFocusability(false, this._lastIndexFocusableItems)

      const currentFocusableItems = Array.from(this.panels[this._panelIndex].querySelectorAll(focusSelector))
      currentFocusableItems.unshift(this.panels[this._panelIndex])
      this._toggleFocusability(true, currentFocusableItems)

      this._lastIndexFocusableItems = currentFocusableItems
    }
  }

  _onActivate (args) {
    const {
      source = ''
    } = args

    if (source !== 'scroll') {
      this._scrollTo(this._scrollOffsets[this._panelIndex])
    }
  }

  _displayPanels () {
    this.panels[this._lastPanelIndex].setAttribute('aria-hidden', 'true')
    this.panels[this._panelIndex].setAttribute('aria-hidden', 'false')
  }

  _toggleFocusability (on = true, items = []) {
    if (!items.length) { return }

    items.forEach(item => {
      if (on) {
        item.setAttribute('tabindex', 0)
        item.setAttribute('aria-hidden', false)
      } else {
        item.setAttribute('tabindex', -1)
        item.setAttribute('aria-hidden', true)
      }
    })
  }

  /**
   * Internal helpers
   */

  _setHeight () {
    if (!this.targetHeight) {
      return
    }

    const height = this.targetHeight.clientHeight

    this.container.style.setProperty('--height', (height / 16) + 'rem')
  }

  _arrangeItems (resize = false) {
    if (!this._rearrange) {
      return
    }

    let numberOfPanels = 1
    let perPanel = 1
    const map = []

    this.breakpoints.forEach(s => {
      if (this._viewportWidth >= s.low && this._viewportWidth < s.high) {
        numberOfPanels = s.panels
        perPanel = s.items
      }
    })

    let start = 0

    for (let i = 0; i < numberOfPanels; i++) {
      map.push([])

      for (let j = start; j < perPanel + start; j++) {
        if (j < this._groupItemsLength) {
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

    frag.appendChild(this.track)

    const groups = Array.from(frag.querySelectorAll('.o-slider__view'))

    groups.forEach((g, index) => {
      if (index >= numberOfPanels) {
        return
      }

      const m = map[index]

      m.forEach(n => {
        g.appendChild(this.groupItems[n])
      })
    })

    this.slider.appendChild(frag)
  }

  _moveGroup (end = false) {
    this._panelsGroups = [
      this._panelsGroups[2],
      this._panelsGroups[0],
      this._panelsGroups[1]
    ]

    const panelsFrag = new window.DocumentFragment()

    panelsFrag.appendChild(this._panelsParent)

    const newPanels = []

    this._panelsGroups.forEach((pg, index) => {
      pg.forEach(p => {
        newPanels.push(p)
        this._panelsParent.appendChild(p)
      })
    })

    this.panels = newPanels
    this._length = this.panels.length
    this._lastPanel = this.panels[this._length - 1]
    this._firstPanel = this.panels[0]

    this.track.appendChild(panelsFrag)

    let newIndex = -1

    if (end) {
      newIndex = this._currentIndex
    } else {
      newIndex = this._currentIndex + this._ogLength
    }

    if (newIndex !== -1) {
      this.track.scrollLeft = this._scrollOffsets[newIndex]
    }

    if (end) {
      this._lastVisible = false
    } else {
      this._firstVisible = false
    }
  }

  _scrollTo (to) {
    if (this.reduceMotion) {
      this.track.scrollLeft = to
    } else {
      let start = null
      let done = false
      const duration = 500
      const from = this.track.scrollLeft
      const dir = to > from ? 'right' : 'left'

      this.track.style.setProperty('--snap-type', 'none')

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

          this.track.scrollLeft = v

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
            this.track.style.setProperty('--snap-type', '')
          }
        } else {
          this.track.style.setProperty('--snap-type', '')
        }
      }

      window.requestAnimationFrame(animate)
    }
  }

  /**
   * Event handlers
   */

  _prev () {
    this._activate({
      currentIndex: this._currentIndex - 1,
      source: 'click'
    })
  }

  _next () {
    this._activate({
      currentIndex: this._currentIndex + 1,
      source: 'click'
    })
  }

  _scroll () {
    clearTimeout(this._scrollTimer)

    this._scrollTimer = setTimeout(() => {
      let newIndex = this._currentIndex

      const target = this.track.scrollLeft
      const offsets = this._scrollOffsets

      const closestOffset = this._scrollOffsets.reduce((prev, curr) => {
        return (Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev)
      })

      newIndex = offsets.indexOf(closestOffset)

      if (newIndex !== -1) {
        this._activate({
          currentIndex: newIndex,
          focus: false,
          source: 'scroll'
        })
      }

      /* Check if first and last item visible */

      if (this.loop) {
        if (!this._lastVisible) {
          const targetX = target + this._trackWidth
          const lastX = this._scrollOffsets[this._length - 1] + this._panelInnerOffset

          if (targetX > lastX) {
            this._lastVisible = true
            this._moveGroup(true)
          }
        }

        if (!this._firstVisible) {
          const firstX = this._scrollOffsets[0] + this._panelInnerOffset

          if (Math.floor(target) <= firstX + this._panelWidth) {
            this._firstVisible = true
            this._moveGroup(false)
          }
        }
      }
    }, 200)
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

      /* Set dimensions needed for loop */

      if (this.loop) {
        this._trackWidth = this.track.clientWidth
        this._panelWidth = this._firstPanel.clientWidth
        this._panelInnerOffset = this._firstPanel.firstElementChild.offsetLeft
      }

      /* Shift items to different panels */

      if (this._rearrange) {
        this._arrangeItems(true)
      }

      /* Reset offsets */

      this._scrollOffsets = []

      this.panels.forEach((panel, index) => {
        if (!this.loop && index > this._lastTabIndex) {
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
