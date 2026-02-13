/**
 * Actions - Resize
 */

/* Imports */

import type { ActionResize } from './actionsTypes.js'
import { actions, addAction, doActions, removeAction } from './actions.js'
import { isSetStrict } from '../utils/set/set.js'
import { config } from '../config/config.js'

/**
 * Timeout ID to clear later.
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
 * @param {ActionResize} action
 * @return {number}
 */
const onResize = (action: ActionResize): number => {
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
 * @param {ActionResize} action
 * @return {boolean}
 */
const removeResize = (action: ActionResize): boolean => {
  return removeAction('resize', action)
}

/* Exports */

export {
  onResize,
  removeResize
}
