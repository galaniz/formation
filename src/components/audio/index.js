/**
 * Components - audio
 */

/* Imports */

import {
  prefix,
  setLoaders,
  getKey,
  getDuration,
  toggleFocusability,
  getInnerFocusableItems
} from '../../utils'

/**
 * Class - play, pause and progress audio tracks
 */

class Audio {
  /**
   * Set public properties and initialize
   *
   * @param {object} args {
   *  @prop {HTMLElement} container
   *  @prop {HTMLElement} audio
   *  @prop {HTMLElement} source
   *  @prop {HTMLElement} loader
   *  @prop {HTMLElement} error
   *  @prop {HTMLElement} play
   *  @prop {HTMLElement} prev
   *  @prop {HTMLElement} next
   *  @prop {HTMLElement} time
   *  @prop {HTMLElement} duration
   *  @prop {HTMLElement} close
   *  @prop {array<object>} tracks
   *  @prop {array<object>} update
   *  @prop {number} currentIndex
   *  @prop {object} progress {
   *   @prop {HTMLElement} slider
   *   @prop {HTMLElement} bar
   *   @prop {HTMLElement} scrub
   *  }
   *  @prop {object} delay {
   *   @prop {number} open
   *   @prop {number} close
   *  }
   * }
   * @return {void|boolean} - False if init errors
   */

  constructor (args) {
    const {
      container = null,
      audio = null,
      source = null,
      loader = null,
      error = null,
      play = null,
      prev = null,
      next = null,
      time = null,
      duration = null,
      close = null,
      tracks = [],
      update = [],
      currentIndex = 0,
      progress = {
        slider: null,
        bar: null,
        scrub: null
      },
      delay = {
        open: 0,
        close: 300
      }
    } = args

    this.container = container
    this.audio = audio
    this.source = source
    this.loader = loader
    this.error = error
    this.play = play
    this.prev = prev
    this.next = next
    this.time = time
    this.duration = duration
    this.close = close
    this.tracks = tracks
    this.update = update
    this.currentIndex = currentIndex
    this.progress = progress
    this.delay = delay

    /**
     * Store open state
     *
     * @type {boolean}
     * @private
     */

    this._playerOpen = false

    /**
     * Keep track of play state
     *
     * @type {number}
     * @private
     */

    this._state = 0

    /**
     * Keep track of loaded state
     *
     * @type {boolean}
     * @private
     */

    this._trackLoaded = false

    /**
     * Last track index
     *
     * @type {number}
     * @private
     */

    this._lastIndex = 0

    /**
     * Progress slider properties
     *
     * @type {object}
     * @prop {number} width
     * @prop {number} offsetX
     * @prop {boolean} pointerDown
     * @prop {number} currentX - Float
     * @prop {number} time
     * @private
     */

    this._progress = {
      width: 0,
      offsetX: 0, // For touch
      pointerDown: false,
      currentX: 0,
      time: 0
    }

    /**
     * Store duration in words
     *
     * @type {string}
     * @private
     */

    this._durationText = ''

    /**
     * Store duration in seconds
     *
     * @type {number}
     * @private
     */

    this._duration = 0

    /**
     * Avoid setting time & progress bar on keydown
     *
     * @type {boolean}
     * @private
     */

    this._keyTime = false

    /**
     * Store timeout id in resize event
     *
     * @type {number}
     * @private
     */

    this._resizeTimer = -1

    /**
     * Store viewport width for resize event
     *
     * @type {number}
     * @private
     */

    this._viewportWidth = window.innerWidth

    /**
     * Store index in innerFocusableItems array
     *
     * @type {number}
     * @private
     */

    this._innerFocusableIndex = 0

    /**
     * Store index in outerFocusableItems array
     *
     * @type {number}
     * @private
     */

    this._outerFocusableIndex = 0

    /**
     * Check if focusable indexes are numbers
     *
     * @type {boolean}
     * @private
     */

    this._focusableIndexesValid = false

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize - check required props, set event listeners and focusability
   *
   * @private
   * @return {boolean}
   */

  _initialize () {
    /* Check that required properties not null */

    let error = false

    const required = [
      'container',
      'audio',
      'source',
      'error',
      'play',
      'time',
      'duration',
      'tracks',
      'progress'
    ]

    required.forEach((r) => {
      if (!this[r]) {
        error = true
      }
    })

    if (error) {
      return false
    }

    /* Set up */

    this._setLastIndex()
    this._setProgressWidth()

    /* Add event listeners */

    const events = [
      'playTrack',
      'time',
      'end',
      'play',
      'canPlay',
      'error',
      'prev',
      'next',
      'close',
      'resize',
      'mousedownProgress',
      'mouseupProgress',
      'mousemoveProgress',
      'touchstartProgress',
      'touchendProgress',
      'touchmoveProgress',
      'clickProgress',
      'keyDown',
      'keyUp'
    ]

    events.forEach(method => {
      this[`_${method}`] = this[`_${method}`].bind(this)
    })

    this.tracks.forEach((track, i) => {
      const { button } = track

      this.tracks[i].active = false

      button.setAttribute('data-index', i)
      button.addEventListener('click', this._playTrack)
    })

    this.audio.addEventListener('timeupdate', this._time)
    this.audio.addEventListener('ended', this._end)
    this.audio.addEventListener('canplaythrough', this._canPlay)
    this.audio.addEventListener('error', this._error)

    this.play.addEventListener('click', this._play)

    if (this.prev) {
      this.prev.addEventListener('click', this._prev)
    }

    if (this.next) {
      this.next.addEventListener('click', this._next)
    }

    if (this.tracks.length === 1) {
      if (this.prev) {
        this.prev.disabled = true
      }

      if (this.next) {
        this.next.disabled = true
      }
    }

    if (this.close) {
      this.close.addEventListener('click', this._close)
    }

    let passiveIfSupported = false

    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get () {
            passiveIfSupported = { passive: true }
          }
        })
      )
    } catch (err) {}

    if (this.progress.slider && this.progress.scrub) {
      this.progress.slider.addEventListener('click', this._clickProgress)
      this.progress.slider.addEventListener('touchstart', this._touchstartProgress, passiveIfSupported)
      this.progress.slider.addEventListener('mousedown', this._mousedownProgress)
    }

    window.addEventListener('resize', this._resize)

    document.addEventListener('keydown', this._keyDown)
    document.addEventListener('keyup', this._keyUp)

    /* Remove focusability to start */

    toggleFocusability(false, getInnerFocusableItems(this.container))

    /* Init successful */

    return true
  }

  /**
   * Set tracks last index
   *
   * @private
   * @return {void}
   */

  _setLastIndex () {
    this._lastIndex = this.tracks.length - 1
  }

  /**
   * Set time on progress slider and time elements
   *
   * @private
   * @param {number} seconds
   * @return {void}
   */

  _setTime (seconds) {
    if (isNaN(seconds)) {
      seconds = 0
    }

    seconds = parseInt(seconds.toFixed())

    this.time.textContent = getDuration(seconds)

    if (this.progress.slider) {
      const timeText = getDuration(seconds, true) + ' of ' + this._durationText

      this.progress.slider.setAttribute('aria-valuenow', seconds)
      this.progress.slider.setAttribute('aria-valuetext', timeText)
    }
  }

  /**
   * Set progress slider width and left offset
   *
   * @private
   * @return {void}
   */

  _setProgressWidth () {
    if (this.progress.slider) {
      const r = this.progress.slider.getBoundingClientRect()

      this._progress.width = r.width
      this._progress.offsetX = r.left
    }
  }

  /**
   * Set progress bar width through transform
   *
   * @private
   * @param {number} n - float
   * @return {void}
   */

  _setProgressBar (n) {
    if (this.progress.bar) {
      prefix('transform', this.progress.bar, `scaleX(${n})`)
    }
  }

  /**
   * Set progress bar width, scrub position and time through transform
   *
   * @private
   * @param {number} n - float
   * @return {void}
   */

  _setProgressScrub (n) {
    if (!this.progress.slider && !this.progress.scrub) {
      return
    }

    let transform = n * this._progress.width

    if (transform < 0) {
      transform = 0
    }

    if (transform > this._progress.width) {
      transform = this._progress.width
    }

    const barTransform = transform / this._progress.width

    this._setProgressBar(barTransform)

    if (transform > this._progress.width) {
      transform = this._progress.width
    }

    prefix('transform', this.progress.scrub, `translateX(${transform}px)`)

    /* Save x position */

    this._progress.currentX = transform / this._progress.width

    /* Time update */

    const time = this.audio.duration * barTransform

    this._progress.time = time

    this._setTime(time)
  }

  /**
   * Set track item and button attributes
   *
   * @private
   * @param {number} index
   * @param {boolean} pause
   * @return {void}
   */

  _setTrackAttr (index = 0, pause = true) {
    const track = this.tracks[index]

    const {
      item,
      button,
      title
    } = track

    if (pause) {
      item.setAttribute('data-active', 'false')

      button.setAttribute('data-state', 'play')
      button.setAttribute('aria-label', `Play ${title}`)

      this.tracks[index].active = false
    } else {
      item.setAttribute('data-active', 'true')

      button.setAttribute('data-state', 'pause')
      button.setAttribute('aria-label', `Pause ${title}`)

      this.tracks[index].active = true
    }
  }

  /**
   * Open and close player
   *
   * @private
   * @param {boolean} open
   * @return {void}
   */

  _toggle (open = true) {
    if (open) {
      if (this._playerOpen) {
        return
      }
    } else {
      if (!this._playerOpen) {
        return
      }
    }

    toggleFocusability(open, getInnerFocusableItems(this.container))

    document.body.setAttribute('data-audio-open', open)

    this._playerOpen = open
  }

  /**
   * Play and pause audio and update attributes to reflect state
   *
   * @private
   * @return {void}
   */

  _togglePlay () {
    if (this._state) {
      this.audio.play()
    } else {
      this.audio.pause()
    }

    this.play.setAttribute('data-state', !this._state ? 'play' : 'pause')
    this.play.setAttribute('aria-label', !this._state ? 'Play' : 'Pause')

    this._setTrackAttr(this.currentIndex, !this._state)
  }

  /**
   * Load and set new track and unset previous track
   *
   * @private
   * @param {number} index
   * @return {void}
   */

  _goTo (index = 0) {
    /* Loader */

    if (this.loader) {
      setLoaders([this.loader], [], true)
    }

    /* Set last track attributes */

    this._setTrackAttr(this.currentIndex, true)

    /* Set current */

    if (index < 0) {
      index = this._lastIndex
    }

    if (index > this._lastIndex) {
      index = 0
    }

    this.currentIndex = index

    /* Set current track attributes */

    this._setTrackAttr(this.currentIndex, false)

    /* Load current track into player */

    const track = this.tracks[this.currentIndex]

    const {
      url,
      type,
      duration
    } = track

    this._trackLoaded = false

    this.source.src = url
    this.source.type = type

    if (this.update.length) {
      this.update.forEach(u => {
        const { item, attr } = u

        if (item) {
          Object.keys(attr || {}).forEach(prop => {
            item[prop] = track[attr[prop]]
          })
        }
      })
    }

    const dur = parseInt(duration.toFixed())

    if (this.duration) {
      this.duration.textContent = getDuration(dur)
    }

    this._durationText = getDuration(dur, true)
    this._duration = dur

    if (this.progress.slider) {
      this.progress.slider.setAttribute('aria-valuemax', duration)
    }

    this.audio.load()
  }

  /**
   * Pass x position from mousemove and touchmove to set progress bar, scrub and time
   *
   * @private
   * @param {number} x
   * @return {void}
   */

  _dragging (x) {
    x -= this._progress.offsetX

    this._setProgressScrub(x / this._progress.width)
  }

  /**
   * Set dragging attribute to true
   *
   * @private
   * @return {void}
   */

  _startDrag () {
    this.progress.slider.setAttribute('data-dragging', true)
  }

  /**
   * Set dragging attribute to false
   *
   * @private
   * @return {void}
   */

  _clearDrag () {
    this.progress.slider.setAttribute('data-dragging', false)
  }

  /**
   * Click handler on player pause button and general method to play/pause audio
   *
   * @private
   * @return {void}
   */

  _play () {
    this._state = this._state === 0 ? 1 : 0
    this._togglePlay()
  }

  /**
   * Click handler on player previous track button
   *
   * @private
   * @return {void}
   */

  _prev () {
    this._goTo(this.currentIndex - 1)
  }

  /**
   * Click handler on player next track button
   *
   * @private
   * @return {void}
   */

  _next () {
    this._goTo(this.currentIndex + 1)
  }

  /**
   * Click handler on player close button - hide player and pause audio
   *
   * @private
   * @return {void}
   */

  _close () {
    this._toggle(false)

    if (this._state) {
      this._state = 0
      this._togglePlay()
    }
  }

  /**
   * Click handler on track play/pause button - show player and load track
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _playTrack (e) {
    this._toggle(true)

    const index = parseInt(e.currentTarget.getAttribute('data-index'))

    if (!this.tracks[index].active) {
      this._goTo(index)
    } else {
      this._play()
    }
  }

  /**
   * Can play through handler on audio element to play when ready
   *
   * @private
   * @return {void}
   */

  _canPlay () {
    if (this._trackLoaded) {
      return
    }

    if (this.loader) {
      setLoaders([this.loader], [], false)
    }

    this._setTrackAttr(this.currentIndex, false)

    this._state = 0
    this._trackLoaded = true
    this._play()
  }

  /**
   * Error handler on audio element - display error element
   *
   * @private
   * @return {void}
   */

  _error () {
    if (this.loader) {
      setLoaders([this.loader], [], false)
    }

    this.error.style.setProperty('display', 'block')
    this.error.focus()
  }

  /**
   * Time update handler on audio element - update time and progress elements
   *
   * @private
   * @return {void}
   */

  _time () {
    if (!this._progress.pointerDown && !this._keyTime) {
      this._setTime(this.audio.currentTime)
      this._setProgressBar(this.audio.currentTime / this.audio.duration)
      this._setProgressScrub(this.audio.currentTime / this.audio.duration)
    }
  }

  /**
   * Ended handler on audio element - update state
   *
   * @private
   * @return {void}
   */

  _end () {
    this._state = 0
    this._togglePlay()
  }

  /**
   * Click handler on progress slider element - update progress bar, scrub and time
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _clickProgress (e) {
    this._progress.pointerDown = true

    this._dragging(e.pageX)

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time

    e.stopPropagation()
    e.preventDefault()
  }

  /**
   * Mousedown handler on progress slider element - add mouse listeners
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _mousedownProgress (e) {
    e.stopPropagation()
    e.preventDefault()

    this._progress.pointerDown = true

    this._startDrag()

    document.addEventListener('mousemove', this._mousemoveProgress)
    document.addEventListener('mouseup', this._mouseupProgress)
  }

  /**
   * Mouseup handler on document element - reset and remove mouse listeners
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _mouseupProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time

    document.removeEventListener('mousemove', this._mousemoveProgress)
    document.removeEventListener('mouseup', this._mouseupProgress)
  }

  /**
   * Mousemove handler on document element - update progress bar, scrub and time
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _mousemoveProgress (e) {
    e.preventDefault()

    if (this._progress.pointerDown) {
      this._dragging(e.pageX)
    }
  }

  /**
   * Touchstart handler on progress slider element - add touch listeners
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _touchstartProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = true

    this._startDrag()

    document.addEventListener('touchmove', this._touchmoveProgress)
    document.addEventListener('touchend', this._touchendProgress)
  }

  /**
   * Touchend handler on document element - reset and remove touch listeners
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _touchendProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time

    document.removeEventListener('touchmove', this._touchmoveProgress)
    document.removeEventListener('touchend', this._touchendProgress)
  }

  /**
   * Touchmove handler on document element - update progress bar, scrub and time
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _touchmoveProgress (e) {
    e.stopPropagation()

    const x = e.touches[0].pageX

    if (this._progress.pointerDown) {
      e.preventDefault()

      this._dragging(x)
    }
  }

  /**
   * Resize event handler - reset progress dimensions and positions
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

      this._setProgressWidth()
      this._setProgressScrub(this._progress.currentX)
    }, 100)
  }

  /**
   * Keydown handler on document element - pause/play on space and update scrub on right/left
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _keyDown (e) {
    let state = false
    let space = false

    switch (getKey(e)) {
      case 'LEFT':
      case 'DOWN':
        state = 1
        break
      case 'RIGHT':
      case 'UP':
        state = 2
        break
      case 'HOME':
        state = 3
        break
      case 'END':
        state = 4
        break
      case 'SPACE': {
        space = true

        if (this._playerOpen) {
          this._play()

          e.preventDefault()
        }

        break
      }
    }

    if (space) {
      return
    }

    if (state) {
      this._keyTime = true

      let t = this._progress.time ? this._progress.time : this.audio.currentTime

      const step = 1

      if (state === 1) {
        t -= step
      }

      if (state === 2) {
        t += step
      }

      if (state === 3) {
        t = 0
      }

      if (state === 4) {
        t = this._duration
      }

      if (t < 0) {
        t = 0
      }

      if (t > this._duration) {
        t = this._duration
      }

      this._setProgressScrub(t / this.audio.duration)
    }
  }

  /**
   * Keyup handler on document element - update time here instead of keydown
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _keyUp (e) {
    if (getKey(e) === 'SPACE') {
      e.preventDefault()

      return
    }

    this.audio.currentTime = isNaN(this._progress.time) ? 0 : this._progress.time
    this._keyTime = false
  }

  /**
   * Public method - add item to tracks array and set attributes
   *
   * @param {object} props
   * @return {void}
   */

  addTrack (props) {
    const i = this.tracks.push(props)
    const index = i - 1

    this.tracks[index].index = index

    this._setLastIndex()
    this._setTrackAttr(props)
  }
}

/* Exports */

export default Audio
