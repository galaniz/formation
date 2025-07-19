/**
 * Utils - Escape
 */

/* Imports */

import type { GenericFunction } from '../../global/globalTypes.js'
import { actions, addAction, doActions, removeAction } from '../action/action.js'
import { getKey } from '../key/key.js'
import { isSetStrict } from '../set/set.js'

/**
 * Keydown event callback.
 *
 * @private
 * @return {void}
 */
const keydown = (e: KeyboardEvent): void => {
  if (getKey(e) !== 'ESC') {
    return
  }

  if (!isSetStrict(actions.get('escape'))) {
    document.removeEventListener('keydown', keydown)
  }

  doActions('escape')
}

/**
 * Run actions on escape event.
 *
 * @param {GenericFunction} action
 * @return {void}
 */
const onEscape = (action: GenericFunction): void => {
  /* Add to escape action */

  addAction('escape', action)

  /* Keydown listener */

  document.addEventListener('keydown', keydown)
}

/**
 * Remove action from escape set.
 *
 * @param {GenericFunction} action
 * @return {boolean}
 */
const removeEscape = (action: GenericFunction): boolean => {
  return removeAction('escape', action)
}

/* Exports */

export {
  onEscape,
  removeEscape
}
