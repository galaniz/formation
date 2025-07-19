/**
 * Utils - Key
 */

/* Imports */

import { isString } from '../string/string.js'

/**
 * Normalize key names/numbers.
 *
 * @private
 * @type {Object<string|number, string>}
 */
const keys: Record<string | number, string> = {
  27: 'ESC',
  Escape: 'ESC',
  9: 'TAB',
  Tab: 'TAB',
  35: 'END',
  36: 'HOME',
  ArrowLeft: 'LEFT',
  37: 'LEFT',
  ArrowUp: 'UP',
  38: 'UP',
  ArrowRight: 'RIGHT',
  39: 'RIGHT',
  ArrowDown: 'DOWN',
  40: 'DOWN',
  Space: 'SPACE',
  32: 'SPACE',
  Enter: 'ENTER',
  13: 'ENTER'
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
