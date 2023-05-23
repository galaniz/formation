/**
 * Objects - video
 */

/* Imports */

import { setLoaders, getKey } from '../../utils'

/**
 * Class - play and pause video
 */

class Video {
  /**
   * Set public properties and initialize
   *
   * @param {object} args
   * @param {HTMLElement} args.container
   * @param {HTMLElement} args.video
   * @param {HTMLElement|array<HTMLElement>} args.source
   * @param {HTMLElement} args.play
   * @param {HTMLElement} args.pause
   * @param {HTMLElement} args.loader
   * @param {HTMLElement} args.error
   * @param {string|array<string>} args.url
   * @return {void|boolean} - False if init errors
   */

  constructor (args) {
    const {
      container = null,
      video = null,
      source = null,
      play = null,
      pause = null,
      loader = null,
      error = null,
      url = ''
    } = args

    this.container = container
    this.video = video
    this.source = source
    this.play = play
    this.pause = pause
    this.loader = loader
    this.error = error
    this.url = url

    /**
     * Keep track of play state
     *
     * @private
     * @type {number}
     */

    this._state = 0

    /**
     * Keep track of loaded state
     *
     * @private
     * @type {boolean}
     */

    this._mediaLoaded = false

    /* Initialize */

    const init = this._initialize()

    if (!init) {
      return false
    }
  }

  /**
   * Initialize - check required props and set event listeners
   *
   * @private
   * @return {boolean}
   */

  _initialize () {
    /* Check that required properties not null */

    let error = false

    const required = [
      'container',
      'video',
      'source',
      'play',
      'pause',
      'error',
      'url'
    ]

    required.forEach((r) => {
      if (!this[r]) {
        error = true
      }
    })

    if (error) {
      return false
    }

    /* Make source and url arrays */

    this.source = Array.isArray(this.source) ? this.source : [this.source]
    this.url = Array.isArray(this.url) ? this.url : [this.url]

    /* Add event listeners */

    const events = [
      'end',
      'canPlay',
      'error',
      'play',
      'pause',
      'keyDown'
    ]

    events.forEach(method => {
      this[`_${method}`] = this[`_${method}`].bind(this)
    })

    this.video.addEventListener('ended', this._end)
    this.video.addEventListener('canplaythrough', this._canPlay)

    this.play.addEventListener('click', this._play)
    this.pause.addEventListener('click', this._pause)

    document.addEventListener('keydown', this._keyDown)

    /* Successful init */

    return true
  }

  /**
   * Play and pause video and update attributes to reflect state
   *
   * @private
   * @param {number} state
   * @return {void}
   */

  _togglePlay (state = 0) {
    let dataState = ''

    /* Load video */

    if (state && !this._mediaLoaded) {
      /* Add error listener */

      this.source[0].addEventListener('error', this._error)

      /* Loader */

      if (this.loader) {
        setLoaders([this.loader], [], true)
      }

      /* Set source(s) */

      this.source.forEach((s, i) => {
        s.src = this.url[i]
      })

      this.video.load()

      dataState = 'load'
    }

    /* Play/pause */

    if (this._mediaLoaded) {
      if (state) {
        this.video.play()
      } else {
        this.video.pause()
      }

      dataState = !state ? 'play' : 'pause'
    }

    /* Update container */

    this.container.setAttribute('data-state', dataState)

    /* Store state */

    this._state = state
  }

  /**
   * Click handler on play button
   *
   * @private
   * @return {void}
   */

  _play () {
    this._togglePlay(1)
  }

  /**
   * Click handler on pause button
   *
   * @private
   * @return {void}
   */

  _pause () {
    this._togglePlay(0)
  }

  /**
   * Can play through handler on video element to play when ready
   *
   * @private
   * @return {void}
   */

  _canPlay () {
    if (this._mediaLoaded) {
      return
    }

    if (this.loader) {
      setLoaders([this.loader], [], false)
    }

    this._mediaLoaded = true
    this._togglePlay(1)
  }

  /**
   * Error handler on video element - display error element
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
   * Ended handler on video element - update state
   *
   * @private
   * @return {void}
   */

  _end () {
    this._togglePlay(0)
  }

  /**
   * Keydown handler on document element - pause on space
   *
   * @private
   * @param {object} e
   * @return {void}
   */

  _keyDown (e) {
    if (getKey(e) === 'SPACE' && this._state) {
      this._togglePlay(0)
    }
  }
}

/* Exports */

export default Video
