/**
 * Utils - Resize
 */

/* Imports */

import { actions, addAction, doActions, removeAction } from '../action/action.js'
import { isSetStrict } from '../set/set.js'
import { config } from '../../config/config.js'

/**
 * Store timeout id to clear later
 *
 * @private
 * @type {number}
 */
let resizeId = 0

/**
 * Resize event callback
 *
 * @private
 * @return {void}
 */
const resize = (): void => {
  clearTimeout(resizeId)

  if (!isSetStrict(actions.get('resize'))) {
    window.removeEventListener('resize', resize)
  }

  resizeId = window.setTimeout(() => {
    doActions('resize')
  }, config.resizeDelay)
}

/**
 * Run actions on resize event
 *
 * @param {function} action
 * @return {void}
 */
const onResize = (action: Function): void => {
  /* Add to resize action */

  addAction('resize', action)

  /* Resize listener */

  window.addEventListener('resize', resize)
}

/**
 * Remove action from resize set
 *
 * @param {function} action
 * @return {boolean}
 */
const removeResize = (action: Function): boolean => {
  return removeAction('resize', action)
}

/* Exports */

export {
  onResize,
  removeResize
}
