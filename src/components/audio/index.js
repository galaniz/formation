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
  getKey
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
      fallbacks = [],
      text = [],
      currentIndex = 0,
      progress = {
        slider: null,
        fill: null,
        scrub: null
      }
    } = args

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
    this.text = text
    this.tracks = tracks
    this.fallbacks = fallbacks
    this.currentIndex = currentIndex
    this.progress = progress

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
      maxX: 0,
      offsetX: 0, // For touch
      offsetY: 0,
      pointerDown: false,
      startX: 0,
      endX: 0,
      startY: 0,
      currentX: 0,
      currentXPercent: 0,
      letItGo: null,
      time: 0
    }

    /* Store duration */

    this._durationText = ''
    this._duration = 0

    /* */

    this._keyTime = false

    /* Resize event */

    this._resizeTimer = null
    this._viewportWidth = window.innerWidth
    this._viewportHeight = window.innerHeight

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
      'audio',
      'source',
      'error',
      'play',
      'time',
      'duration',
      'text',
      'tracks',
      'fallbacks',
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
      'mouseleaveProgress',
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
      this.progress.scrub.addEventListener('touchstart', this._touchstartProgress)
      this.progress.scrub.addEventListener('touchend', this._touchendProgress)
      this.progress.scrub.addEventListener('touchmove', this._touchmoveProgress)
      this.progress.scrub.addEventListener('mousedown', this._mousedownProgress)
      this.progress.scrub.addEventListener('mouseup', this._mouseupProgress)
      this.progress.scrub.addEventListener('mouseleave', this._mouseleaveProgress)
      this.progress.scrub.addEventListener('mousemove', this._mousemoveProgress)
    }

    window.addEventListener('resize', this._resize)

    document.addEventListener('keydown', this._keyDown)
    document.addEventListener('keyup', this._keyUp)

    return true
  }

  /**
   * Helper get and set methods
   */

  _getTime (seconds, text = false) {
    const hours = Math.floor(seconds / 3600)
    const min = Math.floor((seconds - (hours * 3600)) / 60)

    seconds = seconds - (hours * 3600) - (min * 60)

    let t = ''

    if (!text) {
      if (hours) {
        t += (hours < 10 ? '0' : '') + hours + ':'
      }

      t += (min < 10 ? '0' : '') + min + ':'

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
      this._progress.maxX = this._progress.width - this.progress.scrub.clientWidth
    }
  }

  _setProgressFill (n) {
    if (this.progress.fill) {
      prefix('transform', this.progress.fill, `scaleX(${n})`)
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

    const fillTransform = transform / this._progress.width

    this._setProgressFill(fillTransform)

    if (transform > this._progress.maxX) {
      transform = this._progress.maxX
    }

    prefix('transform', this.progress.scrub, `translateX(${transform}px)`)

    /* Save x position */

    this._progress.currentX = transform
    this._progress.currentXPercent = transform / this._progress.width

    /* Time update */

    const time = this.audio.duration * fillTransform

    this._progress.time = time

    this._setTime(time)
  }

  _setTrackAttr (index = 0, pause = true) {
    const track = this.tracks[index]

    const {
      item,
      button,
      text
    } = track

    if (pause) {
      item.setAttribute('data-active', 'false')

      button.setAttribute('data-state', 'play')
      button.setAttribute('aria-label', `Play ${text[0].label}`)

      this.tracks[index].active = false
    } else {
      item.setAttribute('data-active', 'true')

      button.setAttribute('data-state', 'pause')
      button.setAttribute('aria-label', `Pause ${text[0].label}`)

      this.tracks[index].active = true
    }
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
      text,
      duration
    } = track

    this._trackLoaded = false

    this.source.src = url
    this.source.type = type

    if (this.text.length) {
      this.text.forEach((t, i) => {
        t.href = text[i].url
        t.textContent = text[i].label
      })
    }

    if (this.fallbacks.length0) {
      this.fallbacks.forEach(f => {
        f.href = url
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

  _clearDrag () {
    this._progress.startX = 0
    this._progress.endX = 0
    this._progress.startY = 0
    this._progress.letItGo = null
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
    if (this._audioPlayerOpen) {
      if (this._state) {
        this._state = 0
        this._togglePlay()
      }

      document.body.removeAttribute('data-audio-open')

      this._audioPlayerOpen = false
    }
  }

  _playTrack (e) {
    if (!this._audioPlayerOpen) {
      document.body.setAttribute('data-audio-open', '')

      this._audioPlayerOpen = true
    }

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
      this._setProgressFill(this.audio.currentTime / this.audio.duration)
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
  }

  _mouseupProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time
  }

  _mousemoveProgress (e) {
    e.preventDefault()

    if (this._progress.pointerDown) {
      this._progress.endX = e.pageX

      this._dragging(e.pageX)
    }
  }

  _mouseleaveProgress (e) {
    if (this._progress.pointerDown) {
      this._progress.pointerDown = false
      this._progress.endX = e.pageX

      this._clearDrag()
    }
  }

  _touchstartProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = true
    this._progress.startX = e.touches[0].pageX
    this._progress.startY = e.touches[0].page
  }

  _touchendProgress (e) {
    e.stopPropagation()

    this._progress.pointerDown = false

    this._clearDrag()

    this.audio.currentTime = this._progress.time
  }

  _touchmoveProgress (e) {
    e.stopPropagation()

    const x = e.touches[0].pageX
    const y = e.touches[0].pageY

    if (this._progress.letItGo === null) {
      this._progress.letItGo = Math.abs(this._progress.startY - y) < Math.abs(this._progress.startX - x)
    }

    if (this._progress.pointerDown && this._progress.letItGo) {
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
