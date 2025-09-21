/**
 * Utils - Key
 */

/* Imports */

import { isString } from '../string/string.js'

/**
 * Normalize key names.
 *
 * @private
 * @type {Object<string, string>}
 */
const keys: Record<string, string> = {
  Escape: 'ESC',
  Esc: 'ESC',
  Tab: 'TAB',
  End: 'END',
  Home: 'HOME',
  ArrowLeft: 'LEFT',
  Left: 'LEFT',
  ArrowUp: 'UP',
  Up: 'UP',
  ArrowRight: 'RIGHT',
  Right: 'RIGHT',
  ArrowDown: 'DOWN',
  Down: 'DOWN',
  ' ': 'SPACE',
  Spacebar: 'SPACE',
  Enter: 'ENTER'
}

/**
 * Normalize event key as uppercase code.
 *
 * @param {KeyboardEvent} event
 * @return {string}
 */
const getKey = (event: KeyboardEvent): string => {
  const val = keys[event.key]

  if (isString(val)) {
    return val
  }

  return ''
}

/* Exports */

export { getKey }
