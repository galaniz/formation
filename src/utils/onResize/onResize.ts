/**
 * Utils - On Resize
 */

/* Imports */

import { actions, addAction, doActions, removeAction } from '../actions/actions'
import { isSetStrict } from '../isSet/isSet'
import { config } from '../../config/config'

/**
 * Store timeout id to clear later
 *
 * @private
 * @type {number}
 */
let _resizeTimeoutId: number = 0

/**
 * Resize event callback
 *
 * @private
 * @return {Promise<void>}
 */
const _resize = async (): Promise<void> => {
  clearTimeout(_resizeTimeoutId)

  if (!isSetStrict(actions.get('resize'))) {
    window.removeEventListener('resize', _resize) // eslint-disable-line @typescript-eslint/no-misused-promises
  }

  _resizeTimeoutId = window.setTimeout(async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
    await doActions('resize')
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

  window.addEventListener('resize', _resize) // eslint-disable-line @typescript-eslint/no-misused-promises
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

export { onResize, removeResize }
