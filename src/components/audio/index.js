/**
 * Components: audio
 *
 * @param {object} args {
 *  @param {HTMLElement} audio
 * }
 */

/* Imports */

import {
  prefix,
  setLoaders,
  getKey,
  toggleFocusability,
  focusSelector,
  innerFocusableItems
} from '../../utils'

/* Class */

class Audio {
  /**
   * Constructor
   */

  constructor (args) {
    /**
     * Public variables
     */

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
     * Internal variables
     */

    /* Store open state */

    this._playerOpen = false

    /* Keep track of play state */

    this._state = 0

    /* Keey track of loaded state */

    this._trackLoaded = false

    /* Last track index */

    this._lastIndex = 0

    /* Progress slider */

    this._progress = {
      width: 0,
      offsetX: 0, // For touch
      offsetY: 0,
      pointerDown: false,
      startX: 0,
      endX: 0,
      currentX: 0,
      currentXPercent: 0,
      time: 0
    }

    /* Store duration */

    this._durationText = ''
    this._duration = 0

    /* Avoid setting time & progress bar on keydown */

    this._keyTime = false

    /* Resize event */

    this._resizeTimer = null
    this._viewportWidth = window.innerWidth
    this._viewportHeight = window.innerHeight

    /* Store focusable elements */

    this._focusableItems = []
    this._focusableIndex = null

    /**
     * Initialize
     */

    const init = this._initialize()

    if (!init) {
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

    if (this.progress.slider && this.progress.scrub) {
      this.progress.slider.addEventListener('click', this._clickProgress)
      this.progress.slider.addEventListener('touchstart', this._touchstartProgress)
      this.progress.slider.addEventListener('mousedown', this._mousedownProgress)
    }

    window.addEventListener('resize', this._resize)

    document.addEventListener('keydown', this._keyDown)
    document.addEventListener('keyup', this._keyUp)

    /* Store focusable elements */

    const focusableItems = Array.from(this.container.querySelectorAll(focusSelector))

    const focusableLength = innerFocusableItems.push(focusableItems)

    this._focusableIndex = focusableLength - 1

    toggleFocusability(false, focusableItems)

    return true
  }

  /**
   * Helper get and set methods
   */

  _getTime (seconds, words = false) {
    const hours = Math.floor(seconds / 3600)
    const min = Math.floor((seconds - (hours * 3600)) / 60)

    seconds = seconds - (hours * 3600) - (min * 60)

    let t = ''

    if (!words) {
      if (hours) {
        t += (hours < 10 && hours > 0 ? '0' : '') + hours + ':'
      }

      t += (min < 10 && min > 0 ? '0' : '') + min + ':'

      t += (seconds < 10 ? '0' : '') + seconds
    } else {
      if (hours) {
        t += hours + (hours > 1 ? ' hours' : ' hour') + (min ? ' ' : '')
      }

      if (min) {
        t += min + (min > 1 ? ' minutes' : ' minute') + (seconds ? ' ' : '')
      }

      if (seconds) {
        t += seconds + (seconds > 1 ? ' seconds' : ' second')
      }
    }

    return t
  }

  _setLastIndex () {
    this._lastIndex = this.tracks.length - 1
  }

  _setTime (seconds) {
    if (isNaN(seconds)) {
      seconds = 0
    }

    seconds = parseInt(seconds.toFixed())

    this.time.textContent = this._getTime(seconds)
    this.progress.slider.setAttribute('aria-valuenow', seconds)

    const timeText = this._getTime(seconds, true) + ' of ' + this._durationText

    this.progress.slider.setAttribute('aria-valuetext', timeText)
  }

  _setProgressWidth () {
    if (this.progress.slider) {
      const r = this.progress.slider.getBoundingClientRect()

      this._progress.width = r.width
      this._progress.offsetX = r.left
      this._progress.offsetY = r.top
    }
  }

  _setProgressBar (n) {
    if (this.progress.bar) {
      prefix('transform', this.progress.bar, `scaleX(${n})`)
    }
  }

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

    this._progress.currentX = transform
    this._progress.currentXPercent = transform / this._progress.width

    /* Time update */

    const time = this.audio.duration * barTransform

    this._progress.time = time

    this._setTime(time)
  }

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

  _toggle (open = true) {
    if (open) {
      if (this._audioPlayerOpen) {
        return
      }
    } else {
      if (!this._audioPlayerOpen) {
        return
      }
    }

    toggleFocusability(open, innerFocusableItems[this._focusableIndex])

    document.body.setAttribute('data-audio-open', open)

    this._audioPlayerOpen = open
  }

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
   * Go to track
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
          Object.keys(attr).forEach(prop => {
            item[prop] = track[attr[prop]]
          })
        }
      })
    }

    const dur = parseInt(duration.toFixed())

    if (this.duration) {
      this.duration.textContent = this._getTime(dur)
    }

    this._durationText = this._getTime(dur, true)
    this._duration = dur

    if (this.progress.slider) {
      this.progress.slider.setAttribute('aria-valuemax', duration)
    }

    this.audio.load()
  }

  /**
   * Progress drag (mousemove, touchmove)
   */

  _dragging (x) {
    x -= this._progress.offsetX

    this._setProgressScrub(x / this._progress.width)
  }

  _startDrag () {
    this.progress.slider.setAttribute('data-dragging', true)
  }

  _clearDrag () {
    this._progress.startX = 0
    this._progress.endX = 0

    this.progress.slider.setAttribute('data-dragging', false)
  }

  /**
   * Event handlers - controls
   */

  _play () {
    this._state = this._state === 0 ? 1 : 0
    this._togglePlay()
  }

  _prev () {
    this._goTo(this.currentIndex - 1)
  }

  _next () {
    this._goTo(this.currentIndex + 1)
  }

  _close () {
    this._toggle(false)

    if (this._state) {
      this._state = 0
      this._togglePlay()
    }
  }

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
   * Event handlers - audio element
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

  _error () {
    if (this.loader) {
      setLoaders([this.loader], [], false)
    }

    this.error.style.setProperty('display', 'block')
    this.error.focus()
  }

  _time () {
    if (!this._progress.pointerDown && !this._keyTime) {
      this._setTime(this.audio.currentTime)
      this._setProgressBar(this.audio.currentTime / this.audio.duration)
      this._setProgressScrub(this.audio.currentTime / this.audio.duration)
    }
  }

  _end () {
    this._state = 0
    this._togglePlay()
  }

  /**
   * Event handlers - progress
   */

  _clickProgress (e) {
    this._progress.pointerDown = true
    this._progress.endX = e.pageX

    this._dragging(e.pageX)

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time

    e.stopPropagation()
    e.preventDefault()
  }

  _mousedownProgress (e) {
    e.stopPropagation()
    e.preventDefault()

    this._progress.pointerDown = true
    this._progress.startX = e.pageX

    this._startDrag()

    document.addEventListener('mousemove', this._mousemoveProgress)
    document.addEventListener('mouseup', this._mouseupProgress)
  }

  _mouseupProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time

    document.removeEventListener('mousemove', this._mousemoveProgress)
    document.removeEventListener('mouseup', this._mouseupProgress)
  }

  _mousemoveProgress (e) {
    e.preventDefault()

    if (this._progress.pointerDown) {
      this._progress.endX = e.pageX

      this._dragging(e.pageX)
    }
  }

  _touchstartProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = true
    this._progress.startX = e.touches[0].pageX

    this._startDrag()

    document.addEventListener('touchmove', this._touchmoveProgress)
    document.addEventListener('touchend', this._touchendProgress)
  }

  _touchendProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time

    document.removeEventListener('touchmove', this._touchmoveProgress)
    document.removeEventListener('touchend', this._touchendProgress)
  }

  _touchmoveProgress (e) {
    e.stopPropagation()

    const x = e.touches[0].pageX

    if (this._progress.pointerDown) {
      e.preventDefault()

      this._progress.endX = x

      this._dragging(x)
    }
  }

  /**
   * Event handler - window resize
   */

  _resize () {
    clearTimeout(this._resizeTimer)

    this._resizeTimer = setTimeout(() => {
      const viewportWidth = window.innerWidth

      this._viewportHeight = window.innerHeight

      if (viewportWidth !== this._viewportWidth) {
        this._viewportWidth = viewportWidth
      } else {
        return
      }

      this._setProgressWidth()
      this._setProgressScrub(this._progress.currentXPercent)
    }, 100)
  }

  /**
   * Event handlers - document keys
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

        if (this._audioPlayerOpen) {
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

  _keyUp (e) {
    if (getKey(e) === 'SPACE') {
      e.preventDefault()

      return
    }

    this.audio.currentTime = isNaN(this._progress.time) ? 0 : this._progress.time
    this._keyTime = false
  }

  /**
   * Public methods
   */

  addTrack (props) {
    const i = this.tracks.push(props)
    const index = i - 1

    this.tracks[index].index = index

    this._setLastIndex()
    this._setTrackAttr(props)
  }
} // End Audio

/* Exports */

export default Audio
