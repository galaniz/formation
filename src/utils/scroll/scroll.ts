/**
 * Utils - Scroll
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
let scrollId: number = 0

/**
 * Scroll event callback
 *
 * @private
 * @return {void}
 */
const scroll = (): void => {
  clearTimeout(scrollId)

  if (!isSetStrict(actions.get('scroll'))) {
    window.removeEventListener('scroll', scroll)
  }

  scrollId = window.setTimeout(() => {
    doActions('scroll')
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

  window.addEventListener('scroll', scroll)
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

export {
  onScroll,
  removeScroll
}
