/**
 * Utils - Resize
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'
import { actions, addAction, doActions, removeAction } from '../action/action.js'
import { isSetStrict } from '../set/set.js'
import { config } from '../../config/config.js'

/**
 * Timeout id to clear later
 *
 * @private
 * @type {number}
 */
let resizeId: number = 0

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
 * @param {GenericFunction} action
 * @return {void}
 */
const onResize = (action: GenericFunction): void => {
  /* Add to resize action */

  addAction('resize', action)

  /* Resize listener */

  window.addEventListener('resize', resize)
}

/**
 * Remove action from resize set
 *
 * @param {GenericFunction} action
 * @return {boolean}
 */
const removeResize = (action: GenericFunction): boolean => {
  return removeAction('resize', action)
}

/* Exports */

export {
  onResize,
  removeResize
}
