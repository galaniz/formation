/**
 * Utils - Get Key
 */

/* Imports */

import { isString } from '../isString/isString.js'

/**
 * Normalize key names/numbers
 *
 * @private
 * @type {Object<string|number, string>}
 */
const _keys: Record<string | number, string> = {
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
 * Normalize event key as uppercase code
 *
 * @param {KeyboardEvent} event
 * @return {string}
 */
const getKey = (event: KeyboardEvent): string => {
  let key = ''
  let k = `${event.keyCode}`

  if (isString(event.code)) {
    k = event.code
  }

  if (isString(event.key)) {
    k = event.key
  }

  const v = _keys[k]

  if (isString(v)) {
    key = v
  }

  return key
}

/* Exports */

export { getKey }
