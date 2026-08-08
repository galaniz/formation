/**
 * Objects - Media
 */

import type { MediaTemplates, MediaTemplateKeys, MediaProgress, MediaControl, MediaType } from './MediaTypes.js'
import type { ActionResizeArgs } from '../../actions/actionsTypes.js'
import { isStringStrict } from '../../utils/string/string.js'
import { isHtmlElement, isHtmlElementArray } from '../../utils/html/html.js'
import { isNumber } from '../../utils/number/number.js'
import { getDuration } from '../../utils/duration/duration.js'
import { getKey } from '../../utils/key/key.js'
import { getItem, getTemplateItem, cloneItem } from '../../items/items.js'
import { onResize, removeResize } from '../../actions/actionResize.js'
import { applyFilters } from '../../filters/filters.js'
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
   * Media element identified by `type` attribute.
   *
   * @type {HTMLMediaElement|null}
   */
  media: HTMLMediaElement | null = null

  /**
   * Progress bar element identified by `data-media-progress`.
   *
   * @type {HTMLElement|null}
   */
  progress: HTMLElement | null = null

  /**
   * Time element identified by `data-media-time`.
   *
   * @type {HTMLElement|null}
   */
  time: HTMLElement | null = null

  /**
   * Duration element identified by `data-media-duration`.
   *
   * @type {HTMLElement|null}
   */
  duration: HTMLElement | null = null

  /**
   * Play/pause button elements identified by `data-media-control` matching a `MediaControl` value.
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
   * Type of media.
   *
   * @type {MediaType}
   */
  type: MediaType = 'video'

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
   * Initialize success.
   *
   * @type {boolean}
   */
  init: boolean = false

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
  durationTime: number = 0

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
    time: 0,
    load: false,
    muted: false
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
  #endHandler = this.#end.bind(this) as EventListener
  #errorHandler = this.#error.bind(this)
  #controlHandler = this.#control.bind(this) as EventListener
  #clickProgressHandler = this.#clickProgress.bind(this)
  #pointerDownHandler = this.#pointerDown.bind(this)
  #pointerMoveHandler = this.#pointerMove.bind(this)
  #pointerUpHandler = this.#pointerUp.bind(this)
  #keyDownHandler = this.#keyDown.bind(this) as (e: KeyboardEvent) => void
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

    /* Count */

    Media.#count -= 1

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
    this.progress?.removeEventListener('pointerdown', this.#pointerDownHandler)
    this.progress?.removeEventListener('pointermove', this.#pointerMoveHandler)
    this.progress?.removeEventListener('pointerup', this.#pointerUpHandler)
    this.progress?.removeEventListener('pointercancel', this.#pointerUpHandler)

    document.removeEventListener('keydown', this.#keyDownHandler)
    document.removeEventListener('keyup', this.#keyUpHandler)
    removeResize(this.#resizeHandler)

    /* Empty props */

    this.media = null
    this.progress = null
    this.time = null
    this.duration = null
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

    const type = (this.getAttribute('type') || this.type) as MediaType
    const media = getItem(type, this)
    const controls = getItem(['[data-media-control]'], this)
    const progress = getItem('[data-media-progress]', this)
    const time = getItem('[data-media-time]', this)
    const duration = getItem('[data-media-duration]', this)
    const url = this.getAttribute('url')
    const errorId = this.getAttribute('error')
    const loaderId = this.getAttribute('loader')

    /* Check required items exist */

    if (
      !isHtmlElement(media, HTMLMediaElement) ||
      !isHtmlElementArray(controls, HTMLButtonElement) ||
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

    this.type = type
    this.media = media
    this.controls = controls

    if (isStringStrict(url)) {
      this.url = url
    }

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

    /* Duration */

    if (isHtmlElement(duration)) {
      this.duration = duration
    }

    /* Progress */

    if (isHtmlElement(progress)) {
      this.progress = progress
      this.progress.addEventListener('click', this.#clickProgressHandler)
      this.progress.addEventListener('pointerdown', this.#pointerDownHandler)
      this.progress.addEventListener('pointermove', this.#pointerMoveHandler)
      this.progress.addEventListener('pointerup', this.#pointerUpHandler)
      this.progress.addEventListener('pointercancel', this.#pointerUpHandler)
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
   * Player currently active check modified via the `media:active:{id}` filter.
   *
   * @return {boolean}
   */
  active (): boolean {
    const active = this.contains(document.activeElement)

    return applyFilters(`media:active:${this.id}`, active)
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

    const time = this.durationTime * scale

    this.#progress.time = time
    this.#setTime(time)
  }

  /**
   * Load or already loaded update media current time to progress time.
   *
   * @private
   * @return {void}
   */
  #setProgressTime (): void {
    this.load(false, true)
    // @ts-expect-error - load throws error if missing media
    this.media.currentTime = this.#progress.time
  }

  /**
   * Update time on progress and time elements.
   *
   * @private
   * @param {number} seconds
   * @return {void}
   */
  #setTime (seconds: number): void {
    if (!this.progress || !this.time) {
      return
    }

    seconds = parseInt(seconds.toFixed())

    const timeText = getDuration(seconds, true) + ' / ' + this.durationText

    this.time.textContent = getDuration(seconds)
    this.progress.setAttribute('aria-valuenow', `${seconds}`)
    this.progress.setAttribute('aria-valuetext', timeText)
  }

  /**
   * X position from pointer to set progress bar, scrub and time.
   *
   * @private
   * @param {number} x
   * @param {boolean} [time=true]
   * @return {void}
   */
  #drag (x: number, time: boolean = true): void {
    x -= this.#progress.offsetX

    this.#setProgressScrub(x / this.#progress.width)

    if (this.type === 'video' && time && this.media) {
      this.media.currentTime = this.#progress.time
    }
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
    this.toggleAttribute('dragging', drag)

    if (this.media) {
      if (drag) {
        this.#progress.muted = this.media.muted
      }

      this.media.muted = drag ? true : this.#progress.muted
    }
  }

  /**
   * Meta handler on media element to update duration.
   *
   * @private
   * @return {void}
   */
  #meta (): void {
    let duration = this.media?.duration

    if (!isNumber(duration)) {
      duration = 0
    }

    const durationRounded = parseInt(duration.toFixed())

    this.durationTime = duration
    this.durationText = getDuration(durationRounded, true)

    if (this.duration) {
      this.duration.textContent = getDuration(durationRounded)
    }

    if (this.progress) {
      this.progress.setAttribute('aria-valuemax', `${durationRounded}`)
    }

    if (this.#progress.load) {
      this.#setProgressScrub(this.#progress.currentX)
      this.#setProgressTime()
    }
  }

  /**
   * Play through handler on media element to play when ready.
   *
   * @private
   * @return {void}
   */
  #canPlay (): void {
    setDisplay(this.getClone('loader'), 'hide', 'loader')
    this.loaded = true
  }

  /**
   * Time update handler on media element to update time and progress.
   *
   * @private
   * @return {void}
   */
  #time (): void {
    if (this.#progress.pointerDown || this.#keyTime || !this.media?.readyState) {
      return
    }

    const seconds = this.media.currentTime

    this.#setTime(seconds)
    this.#setProgressScrub(seconds / this.durationTime)
  }

  /**
   * Ended handler on media element to update play state.
   *
   * @private
   * @return {Promise<void>}
   */
  async #end (): Promise<void> {
    await this.toggle(false)
  }

  /**
   * Error handler on media element to display error element.
   *
   * @private
   * @return {void}
   */
  #error (): void {
    setDisplay(this.getClone('loader'), 'hide', 'loader')
    this.#errorDelayId = setDisplay(this.getClone('error'), 'focus')
  }

  /**
   * Click handler on control element to toggle play.
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
   * Click handler on progress element to update bar, scrub and time.
   *
   * @private
   * @param {MouseEvent} e
   * @return {void}
   */
  #clickProgress (e: MouseEvent): void {
    this.#progress.pointerDown = true
    this.#drag(e.clientX, false)
    this.#progress.pointerDown = false
    this.#setDrag(false)
    this.#setProgressTime()
  }

  /**
   * Pointer down handler on progress element to set drag.
   * 
   * @private
   * @param {PointerEvent} e
   * @return {void}
   */
  #pointerDown (e: PointerEvent): void {
    e.stopPropagation()

    this.#progress.pointerDown = true
    this.#setDrag()

    this.progress?.setPointerCapture(e.pointerId) // Drag continues even when pointer moves outside progress boundaries
  }

  /**
   * Pointer move handler on progress element to update progress bar, scrub and time.
   *
   * @private
   * @param {PointerEvent} e
   * @return {void}
   */
  #pointerMove (e: PointerEvent): void {
    if (!this.#progress.pointerDown) {
      return
    }

    e.preventDefault()

    this.#drag(e.clientX)
  }

  /**
   * Pointer up handler on progress element to set time and reset drag.
   *
   * @private
   * @param {PointerEvent} e
   * @return {void}
   */
  #pointerUp (e: PointerEvent): void {
    e.stopPropagation()

    this.#progress.pointerDown = false
    this.#setDrag(false)
    this.#setProgressTime()
  }

  /**
   * Key down handler on document element to toggle play and update scrub.
   *
   * @private
   * @param {KeyboardEvent} e
   * @return {Promise<void>}
   */
  async #keyDown (e: KeyboardEvent): Promise<void> {
    if (!this.active()) {
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
        e.preventDefault()
        await this.toggle(!this.playing)

        space = true
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

    if (state === 4 || newTime > this.durationTime) {
      newTime = this.durationTime
    }

    if (newTime < 0) {
      newTime = 0
    }

    this.#setProgressScrub(newTime / this.durationTime)
  }

  /**
   * Key up handler on document element to update time instead of on keydown.
   *
   * @private
   * @param {KeyboardEvent} e
   * @return {void}
   */
  #keyUp (e: KeyboardEvent): void {
    if (!this.active()) {
      return
    }

    if (getKey(e) === 'SPACE') {
      e.preventDefault()
      return
    }

    this.#setProgressTime()
    this.#keyTime = false
  }

  /**
   * Resize action callback.
   *
   * @private
   * @param {ActionResizeArgs} args
   * @return {void}
   */
  #resize (args: ActionResizeArgs): void {
    const [oldViewportWidth, newViewportWidth] = args

    if (oldViewportWidth === newViewportWidth) {
      return
    }

    this.#setProgress()
    this.#setProgressScrub(this.#progress.currentX)
  }

  /**
   * Clone, return and append template element.
   *
   * @param {MediaTemplateKeys} type
   * @return {HTMLElement|null}
   */
  getClone (type: MediaTemplateKeys): HTMLElement | null {
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
   * Load media asset, clear loader and error.
   *
   * @param {boolean} [reload=false]
   * @param {boolean} [progress=false]
   * @return {void}
   */
  load (reload: boolean = false, progress: boolean = false): void {
    if (!isHtmlElement(this.media)) {
      throw new Error('No media')
    }

    if (this.media.readyState && !reload) {
      return
    }

    clearTimeout(this.#loaderDelayId)
    clearTimeout(this.#errorDelayId)

    if (this.clones.has('error')) {
      setDisplay(this.getClone('error'), 'hide')
    }

    this.#loaderDelayId = setDisplay(this.getClone('loader'), 'show', 'loader')
    this.#progress.load = progress
    this.setAttribute('url', this.url)
    this.loaded = false
    this.media.src = this.url
    this.media.load()
  }

  /**
   * Play and pause media element.
   *
   * @param {boolean} [play=true]
   * @param {boolean} [reload=false]
   * @return {Promise<void>}
   */
  async toggle (play: boolean = true, reload: boolean = false): Promise<void> {
    try {
      /* Load */

      this.load(reload)

      /* Play/pause */

      this.playing = play
      this.toggleAttribute('playing', play)

      if (play) {
        await this.media?.play()
      } else {
        this.media?.pause()
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

export { Media }
