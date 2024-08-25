/**
 * Utils - On Scroll
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
let _scrollTimeoutId: number = 0

/**
 * Scroll event callback
 *
 * @private
 * @return {Promise<void>}
 */
const _scroll = async (): Promise<void> => {
  clearTimeout(_scrollTimeoutId)

  if (!isSetStrict(actions.get('scroll'))) {
    window.removeEventListener('scroll', _scroll) // eslint-disable-line @typescript-eslint/no-misused-promises
  }

  _scrollTimeoutId = window.setTimeout(async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
    await doActions('scroll')
  }, config.scrollDelay)
}

/**
 * Run actions on scroll event
 *
 * @param {function} action
 * @return {void}
 */
const onScroll = (action: Function): void => {
  /* Add to scroll action */

  addAction('scroll', action)

  /* Scroll listener */

  window.addEventListener('scroll', _scroll) // eslint-disable-line @typescript-eslint/no-misused-promises
}

/**
 * Remove action from scroll set
 *
 * @param {function} action
 * @return {boolean}
 */
const removeScroll = (action: Function): boolean => {
  return removeAction('scroll', action)
}

/* Exports */

export { onScroll, removeScroll }
