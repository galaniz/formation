/**
 * Utils - Resize
 */

/* Imports */

import type { ResizeAction } from './resizeTypes.js'
import { actions, addAction, doActions, removeAction } from '../action/action.js'
import { isSetStrict } from '../set/set.js'
import { config } from '../../config/config.js'

/**
 * Timeout id to clear later.
 *
 * @private
 * @type {number}
 */
let resizeId: number = 0

/**
 * Resize listener flag.
 *
 * @private
 * @type {boolean}
 */
let resizeOn: boolean = false

/**
 * Viewport width.
 *
 * @private
 * @type {number}
 */
let resizeViewportWidth: number = 0

/**
 * Resize event callback.
 *
 * @private
 * @return {void}
 */
const resize = (): void => {
  clearTimeout(resizeId)

  if (!isSetStrict(actions.get('resize'))) {
    window.removeEventListener('resize', resize)
    resizeOn = false
  }

  resizeId = window.setTimeout(() => {
    const newViewportWidth = window.innerWidth

    doActions('resize', [resizeViewportWidth, newViewportWidth])

    resizeViewportWidth = newViewportWidth
  }, config.resizeDelay)
}

/**
 * Run actions on resize event.
 *
 * @param {ResizeAction} action
 * @return {number}
 */
const onResize = (action: ResizeAction): number => {
  /* Add to resize action */

  addAction('resize', action)

  /* Resize listener */

  if (!resizeOn) {
    window.addEventListener('resize', resize)
    resizeOn = true
    resizeViewportWidth = window.innerWidth
  }

  /* Return viewport width */

  return resizeViewportWidth
}

/**
 * Remove action from resize set.
 *
 * @param {ResizeAction} action
 * @return {boolean}
 */
const removeResize = (action: ResizeAction): boolean => {
  return removeAction('resize', action)
}

/* Exports */

export {
  onResize,
  removeResize
}
