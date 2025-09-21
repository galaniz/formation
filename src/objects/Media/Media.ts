/**
 * Objects - Media
 */

/* Imports */

import type { MediaTemplates, MediaTemplateKeys, MediaProgress, MediaControl } from './MediaTypes.js'
import type { ResizeActionArgs } from '../../utils/resize/resizeTypes.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { getItem, getTemplateItem, cloneItem } from '../../utils/item/item.js'
import { onResize, removeResize } from '../../utils/resize/resize.js'
import { getDuration } from '../../utils/duration/duration.js'
import { getKey } from '../../utils/key/key.js'
import { setDisplay } from '../../utils/display/display.js'
import { config } from '../../config/config.js'

/**
 * Custom event details.
 */
declare global {
  interface ElementEventMap {
    'media:toggle': CustomEvent
  }
}

/**
 * Handles loading and playing media.
 */
class Media extends HTMLElement {
  /**
   * Media element.
   *
   * @type {HTMLMediaElement|null}
   */
  media: HTMLMediaElement | null = null

  /**
   * Progress bar element.
   *
   * @type {HTMLElement|null}
   */
  progress: HTMLElement | null = null

  /**
   * Time element.
   *
   * @type {HTMLElement|null}
   */
  time: HTMLElement | null = null

  /**
   * Play/pause button elements.
   *
   * @type {HTMLButtonElement[]}
   */
  controls: HTMLButtonElement[] = []

  /**
   * URL of current file.
   *
   * @type {string}
   */
  url: string = ''

  /**
   * Play state.
   *
   * @type {boolean}
   */
  playing: boolean = false

  /**
   * Progress drag state.
   *
   * @type {boolean}
   */
  dragging: boolean = false

  /**
   * Asset loaded state.
   *
   * @type {boolean}
   */
  loaded: boolean = false

  /**
   * Active state.
   *
   * @type {boolean}
   */
  active: boolean = true

  /**
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

  /**
   * Player is global.
   *
   * @type {boolean}
   */
  global: boolean = false

  /**
   * Loader and error fragments.
   *
   * @type {MediaTemplates}
   */
  static templates: MediaTemplates = new Map()

  /**
   * Clones of templates.
   *
   * @type {MediaTemplates}
   */
  clones: MediaTemplates = new Map()

  /**
   * Duration in seconds.
   *
   * @private
   * @type {number}
   */
  duration: number = 0

  /**
   * Duration in words.
   *
   * @private
   * @type {string}
   */
  durationText: string = ''

  /**
   * Track number of instances.
   *
   * @type {number}
   */
  static #count: number = 0

  /**
   * Progress props.
   *
   * @private
   * @type {MediaProgress}
   */
  #progress: MediaProgress = {
    width: 0,
    offsetX: 0, // For touch
    pointerDown: false,
    currentX: 0,
    time: 0
  }

  /**
   * Avoid updating time and progress on keydown.
   *
   * @private
   * @type {boolean}
   */
  #keyTime: boolean = false

  /**
   * ID for loader display timeout.
   *
   * @private
   * @type {number}
   */
  #loaderDelayId: number = 0

  /**
   * ID for error focus timeout.
   *
   * @private
   * @type {number}
   */
  #errorDelayId: number = 0

  /**
   * Bind this to event callbacks.
   *
   * @private
   */
  #metaHandler = this.#meta.bind(this)
  #canPlayHandler = this.#canPlay.bind(this)
  #timeHandler = this.#time.bind(this)
  #endHandler = (): void => { void this.#end() }
  #errorHandler = this.#error.bind(this)
  #controlHandler = (e: Event): void => { void this.#control(e) }
  #clickProgressHandler = this.#clickProgress.bind(this)
  #downProgressHandler = this.#downProgress.bind(this)
  #upProgressHandler = this.#upProgress.bind(this)
  #mouseProgressHandler = this.#mouseProgress.bind(this)
  #startProgressHandler = this.#startProgress.bind(this)
  #endProgressHandler = this.#endProgress.bind(this)
  #touchProgressHandler = this.#touchProgress.bind(this)
  #keyDownHandler = (e: KeyboardEvent): void => { void this.#keyDown(e) }
  #keyUpHandler = this.#keyUp.bind(this)
  #resizeHandler = this.#resize.bind(this)

  /**
   * Create new instance.
   */
  constructor () { super() } // eslint-disable-line @typescript-eslint/no-useless-constructor

  /**
   * Init after added to DOM.
   */
  connectedCallback (): void {
    if (this.init) {
      return
    }

    this.init = this.#initialize()
  }

  /**
   * Clean up after removed from DOM.
   */
  async disconnectedCallback (): Promise<void> {
    /* Wait a tick to let DOM update */

    await Promise.resolve()

    /* Skip if moved */

    if (this.isConnected || !this.init) {
      return
    }

    /* Clear event listeners */

    this.media?.removeEventListener('loadedmetadata', this.#metaHandler)
    this.media?.removeEventListener('canplaythrough', this.#canPlayHandler)
    this.media?.removeEventListener('timeupdate', this.#timeHandler)
    this.media?.removeEventListener('ended', this.#endHandler)
    this.media?.removeEventListener('error', this.#errorHandler)
    this.media?.removeEventListener('click', this.#controlHandler)
    this.controls.forEach(control => {
      control.removeEventListener('click', this.#controlHandler)
    })

    this.progress?.removeEventListener('click', this.#clickProgressHandler)
    this.progress?.removeEventListener('touchstart', this.#startProgressHandler)
    this.progress?.removeEventListener('mousedown', this.#downProgressHandler)

    document.removeEventListener('keydown', this.#keyDownHandler)
    document.removeEventListener('keyup', this.#keyUpHandler)
    removeResize(this.#resizeHandler)

    /* Empty props */

    this.media = null
    this.progress = null
    this.time = null
    this.controls = []

    if (!Media.#count) { // Clear if last element
      Media.templates.clear()
    }

    this.clones.clear()
    this.init = false

    /* Clear timeouts */

    clearTimeout(this.#loaderDelayId)
    clearTimeout(this.#errorDelayId)
  }

  /**
   * Init check required items and set props.
   *
   * @private
   * @return {boolean}
   */
  #initialize (): boolean {
    /* Items */

    const type = this.getAttribute('type') || 'video'
    const global = this.hasAttribute('global')
    const media = getItem(type, this)
    const controls = getItem(['[data-media-control]'], this)
    const progress = getItem('[data-media-progress]', this)
    const time = getItem('[data-media-time]', this)
    const url = this.getAttribute('url')
    const errorId = this.getAttribute('error')
    const loaderId = this.getAttribute('loader')

    /* Check required items exist */

    if (
      !isHtmlElement(media, HTMLMediaElement) ||
      !isHtmlElementArray(controls, HTMLButtonElement) ||
      !isStringStrict(url) ||
      !isStringStrict(errorId) ||
      !isStringStrict(loaderId)
    ) {
      return false
    }

    /* Loader and error required */

    if (!Media.templates.has('loader')) {
      const loader = getTemplateItem(loaderId)

      if (!isHtmlElement(loader)) {
        return false
      }

      Media.templates.set('loader', loader)
    }

    if (!Media.templates.has('error')) {
      const error = getTemplateItem(errorId)

      if (!isHtmlElement(error)) {
        return false
      }

      Media.templates.set('error', error)
    }

    /* Props */

    this.url = url
    this.media = media
    this.controls = controls
    this.global = global

    /* Media */

    this.media.addEventListener('loadedmetadata', this.#metaHandler)
    this.media.addEventListener('canplaythrough', this.#canPlayHandler)
    this.media.addEventListener('timeupdate', this.#timeHandler)
    this.media.addEventListener('ended', this.#endHandler)
    this.media.addEventListener('error', this.#errorHandler)
    this.media.addEventListener('click', this.#controlHandler)

    /* Controls */

    this.controls.forEach(control => {
      control.addEventListener('click', this.#controlHandler)
    })

    /* Time */

    if (isHtmlElement(time)) {
      this.time = time
    }

    /* Progress */

    if (isHtmlElement(progress)) {
      this.progress = progress
      this.progress.addEventListener('click', this.#clickProgressHandler)
      this.progress.addEventListener('touchstart', this.#startProgressHandler, { passive: true })
      this.progress.addEventListener('mousedown', this.#downProgressHandler)
    }

    /* Event listeners */

    document.addEventListener('keydown', this.#keyDownHandler)
    document.addEventListener('keyup', this.#keyUpHandler)
    onResize(this.#resizeHandler)

    /* Set up */

    this.#setProgress()

    /* Init successful */

    Media.#count += 1

    return true
  }

  /**
   * Player currently active check.
   *
   * @return {boolean}
   */
  #isActive (): boolean {
    if (!this.active) {
      return false
    }

    if (!this.global && !this.contains(document.activeElement)) {
      return false
    }

    return true
  }

  /**
   * Clone and return template element.
   *
   * @param {MediaTemplateKeys} type
   * @return {HTMLElement|null}
   */
  #getClone (type: MediaTemplateKeys): HTMLElement | null {
    /* Check if exists */

    const result = this.clones.get(type)

    if (isHtmlElement(result)) {
      return result
    }

    /* Clone template */

    const clone = cloneItem(Media.templates.get(type))

    if (!isHtmlElement(clone)) {
      return null
    }

    if (type === 'error') {
      const cloneLink = getItem('[data-media-link]', clone)

      if (isHtmlElement(cloneLink, HTMLAnchorElement)) {
        cloneLink.href = this.url
        cloneLink.textContent = this.title
      }
    }

    this.append(clone)
    this.clones.set(type, clone)

    /* Return clone */

    return clone
  }

  /**
   * Progress width and left offset.
   *
   * @private
   * @return {void}
   */
  #setProgress (): void {
    if (!this.progress) {
      return
    }

    const rect = this.progress.getBoundingClientRect()

    this.#progress.width = rect.width
    this.#progress.offsetX = rect.left
  }

  /**
   * Update progress bar width, scrub position and time.
   *
   * @private
   * @param {number} x
   * @return {void}
   */
  #setProgressScrub (x: number): void {
    /* Progress element required */

    if (!this.progress) {
      return
    }

    /* Translate */

    let translate = x * this.#progress.width

    if (translate < 0) {
      translate = 0
    }

    if (translate > this.#progress.width) {
      translate = this.#progress.width
    }

    const scale = translate / this.#progress.width

    this.style.setProperty('--med-progress-bar', `${scale}`)
    this.style.setProperty('--med-progress-scrub', `${translate}px`)
    this.#progress.currentX = scale

    /* Time */

    const time = this.duration * scale

    this.#progress.time = time
    this.#setTime(time)
  }

  /**
   * Update time on progress and time elements.
   *
   * @private
   * @param {number} seconds
   * @return {void}
   */
  #setTime (seconds: number): void {
    if (isNaN(seconds)) {
      seconds = 0
    }

    seconds = parseInt(seconds.toFixed())

    if (!this.progress || !this.time) {
      return
    }

    const timeText = getDuration(seconds, true) + ' / ' + this.durationText

    this.time.textContent = getDuration(seconds)
    this.progress.setAttribute('aria-valuenow', `${seconds}`)
    this.progress.setAttribute('aria-valuetext', timeText)
  }

  /**
   * X position from mouse or touch to set progress bar, scrub and time.
   *
   * @private
   * @param {number} x
   * @return {void}
   */
  #drag (x: number): void {
    x -= this.#progress.offsetX

    this.#setProgressScrub(x / this.#progress.width)
  }

  /**
   * Update drag state and attribute.
   * 
   * @private
   * @param {boolean} drag
   * @return {void}
   */
  #setDrag (drag: boolean = true): void {
    this.dragging = drag

    if (drag) {
      this.setAttribute('dragging', '')
    } else {
      this.removeAttribute('dragging')
    }
  }

  /**
   * Meta handler on media element updates duration.
   *
   * @private
   * @return {void}
   */
  #meta (): void {
    if (!isHtmlElement(this.media)) {
      return
    }

    const duration = parseInt(this.media.duration.toFixed())
    this.duration = duration
    this.durationText = getDuration(duration, true)

    if (this.progress) {
      this.progress.setAttribute('aria-valuemax', `${duration}`)
    }
  }

  /**
   * Play through handler on media element to play when ready.
   *
   * @private
   * @return {void}
   */
  #canPlay (): void {
    setDisplay(this.#getClone('loader'), 'hide', 'loader')
    this.loaded = true
  }

  /**
   * Time update handler on media element updates time and progress.
   *
   * @private
   * @return {void}
   */
  #time (): void {
    if (this.#progress.pointerDown || this.#keyTime || !isHtmlElement(this.media)) {
      return
    }

    this.#setTime(this.media.currentTime)
    this.#setProgressScrub(this.media.currentTime / this.duration)
  }

  /**
   * Ended handler on media element updates play state.
   *
   * @private
   * @return {Promise<void>}
   */
  async #end (): Promise<void> {
    await this.toggle(false)
  }

  /**
   * Error handler on media element displays error element.
   *
   * @private
   * @return {void}
   */
  #error (): void {
    setDisplay(this.#getClone('loader'), 'hide', 'loader')
    this.#errorDelayId = setDisplay(this.#getClone('error'), 'show')
  }

  /**
   * Click handler on control element toggles play.
   *
   * @private
   * @param {Event} e
   * @return {Promise<void>}
   */
  async #control (e: Event): Promise<void> {
    const control = e.currentTarget as HTMLButtonElement
    const type = control.dataset.mediaControl as MediaControl
    
    await this.toggle(type === 'play' ? true : type === 'pause' ? false : !this.playing)
  }

  /**
   * Click handler on progress element updates bar, scrub and time.
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  #clickProgress (e: MouseEvent): void {
    this.#progress.pointerDown = true
    this.#drag(e.pageX)
    this.#progress.pointerDown = false
    this.#setDrag(false)

    if (isHtmlElement(this.media)) {
      this.media.currentTime = this.#progress.time
    }

    e.stopPropagation()
    e.preventDefault()
  }

  /**
   * Mousedown handler on progress element adds mouse listeners.
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  #downProgress (e: MouseEvent): void {
    e.stopPropagation()
    e.preventDefault()

    this.#progress.pointerDown = true
    this.#setDrag()

    document.addEventListener('mousemove', this.#mouseProgressHandler)
    document.addEventListener('mouseup', this.#upProgressHandler)
  }

  /**
   * Mouseup handler on document element resets and removes mouse listeners.
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  #upProgress (e: MouseEvent): void {
    e.stopPropagation()

    this.#progress.pointerDown = false
    this.#setDrag(false)

    if (isHtmlElement(this.media)) {
      this.media.currentTime = this.#progress.time
    }

    document.removeEventListener('mousemove', this.#mouseProgressHandler)
    document.removeEventListener('mouseup', this.#upProgressHandler)
  }

  /**
   * Mousemove handler on document element updates progress bar, scrub and time.
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  #mouseProgress (e: MouseEvent): void {
    e.preventDefault()

    if (this.#progress.pointerDown) {
      this.#drag(e.pageX)
    }
  }

  /**
   * Touchstart handler on progress element adds touch listeners.
   * 
   * @private
   * @param {TouchEvent} e
   * @return {void}
   */
  #startProgress (e: TouchEvent): void {
    e.stopPropagation()

    this.#progress.pointerDown = true
    this.#setDrag()

    document.addEventListener('touchmove', this.#touchProgressHandler)
    document.addEventListener('touchend', this.#endProgressHandler)
  }

  /**
   * Touchend handler on document element resets and removes touch listeners.
   *
   * @private
   * @param {TouchEvent} e
   * @return {void}
   */
  #endProgress (e: TouchEvent): void {
    e.stopPropagation()

    this.#progress.pointerDown = false
    this.#setDrag(false)

    if (isHtmlElement(this.media)) {
      this.media.currentTime = this.#progress.time
    }

    document.removeEventListener('touchmove', this.#touchProgressHandler)
    document.removeEventListener('touchend', this.#endProgressHandler)
  }

  /**
   * Touchmove handler on document element updates progress bar, scrub and time.
   *
   * @private
   * @param {TouchEvent} e
   * @return {void}
   */
  #touchProgress (e: TouchEvent): void {
    e.stopPropagation()

    const x = e.touches[0]?.pageX

    if (!x || !this.#progress.pointerDown) {
      return
    }

    e.preventDefault()

    this.#drag(x)
  }

  /**
   * Keydown handler on document element toggles play and updates scrub.
   *
   * @private
   * @param {KeyboardEvent} e
   * @return {Promise<void>}
   */
  async #keyDown (e: KeyboardEvent): Promise<void> {
    if (!this.#isActive()) {
      return
    }

    let state = 0
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

        await this.toggle(!this.playing)
        e.preventDefault()

        break
      }
    }

    if (space || !state) {
      return
    }

    this.#keyTime = true
    let newTime = this.#progress.time || (this.media?.currentTime || 0)

    if (state === 1) {
      newTime -= 1
    }

    if (state === 2) {
      newTime += 1
    }

    if (state === 3) {
      newTime = 0
    }

    if (state === 4 || newTime > this.duration) {
      newTime = this.duration
    }

    if (newTime < 0) {
      newTime = 0
    }

    this.#setProgressScrub(newTime / this.duration)
  }

  /**
   * Keyup handler on document element updates time instead of on keydown.
   *
   * @private
   * @param {KeyboardEvent} e
   * @return {void}
   */
  #keyUp (e: KeyboardEvent): void {
    if (!this.#isActive()) {
      return
    }

    if (getKey(e) === 'SPACE') {
      e.preventDefault()

      return
    }

    if (isHtmlElement(this.media)) {
      this.media.currentTime = this.#progress.time
    }

    this.#keyTime = false
  }

  /**
   * Resize hook callback.
   *
   * @private
   * @param {ResizeActionArgs} args
   * @return {void}
   */
  #resize (args: ResizeActionArgs): void {
    const [oldViewportWidth, newViewportWidth] = args

    if (oldViewportWidth === newViewportWidth) {
      return
    }

    this.#setProgress()
    this.#setProgressScrub(this.#progress.currentX)
  }

  /**
   * Load media asset, clear loader and error.
   *
   * @param {string} [url]
   * @param {string} [title]
   * @return {void}
   */
  load (url?: string, title?: string): void {
    clearTimeout(this.#loaderDelayId)
    clearTimeout(this.#errorDelayId)

    if (this.clones.has('error')) {
      setDisplay(this.#getClone('error'), 'hide')
    }

    this.#loaderDelayId = setDisplay(this.#getClone('loader'), 'show', 'loader')

    if (!isHtmlElement(this.media)) {
      return
    }

    if (isStringStrict(url)) {
      this.loaded = false
      this.url = url
      this.setAttribute('url', url)
    }

    if (isStringStrict(title)) {
      this.title = title
    }

    this.media.src = this.url
    this.media.load()
  }

  /**
   * Play and pause media element.
   *
   * @param {boolean} [play=true]
   * @return {void}
   */
  async toggle (play: boolean = true): Promise<void> {
    try {
      if (!isHtmlElement(this.media)) {
        throw new Error('No media')
      }

      /* Load */

      if (!this.loaded) {
        this.load()
      }

      /* Play/pause */

      this.playing = play

      if (play) {
        await this.media.play()
        this.setAttribute('playing', '')
      } else {
        this.media.pause()
        this.removeAttribute('playing')
      }

      this.controls.forEach(control => {
        if (control.dataset.mediaControl as MediaControl !== 'toggle') {
          return
        }

        const playLabel = config.labels.play || 'Play'
        const pauseLabel = config.labels.pause || 'Pause'

        control.setAttribute('aria-label', play ? pauseLabel : playLabel)
      })

      /* Emit toggle event */

      const onToggle = new CustomEvent('media:toggle')
      this.dispatchEvent(onToggle)
    } catch {
      this.#error()
    }
  }
}

/* Exports */

export { Media }
