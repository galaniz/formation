/**
 * Utils - On Escape
 */

/* Imports */

import { actions, addAction, doActions, removeAction } from '../actions/actions'
import { getKey } from '../getKey/getKey'
import { isSetStrict } from '../isSet/isSet'

/**
 * Keydown event callback
 *
 * @private
 * @return {Promise<void>}
 */
const _keydown = async (e: KeyboardEvent): Promise<void> => {
  if (getKey(e) !== 'ESC') {
    return
  }

  if (!isSetStrict(actions.get('escape'))) {
    document.removeEventListener('keydown', _keydown) // eslint-disable-line @typescript-eslint/no-misused-promises
  }

  await doActions('escape')
}

/**
 * Run actions on escape event
 *
 * @param {function} action
 * @return {void}
 */
const onEscape = (action: Function): void => {
  /* Add to escape action */

  addAction('escape', action)

  /* Keydown listener */

  document.addEventListener('keydown', _keydown) // eslint-disable-line @typescript-eslint/no-misused-promises
}

/**
 * Remove action from escape set
 *
 * @param {function} action
 * @return {boolean}
 */
const removeEscape = (action: Function): boolean => {
  return removeAction('escape', action)
}

/* Exports */

export { onEscape, removeEscape }
