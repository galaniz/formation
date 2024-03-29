/**
 * Utils - get key
 */

/**
 * Function - normalize event key as uppercase code
 *
 * @param {object} event
 * @return {string}
 */

const getKey = (event) => {
  let key = ''

  const k = event.keyCode || event.which || event.code || event.key

  const keys = {
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

  if (Object.getOwnPropertyDescriptor(keys, k)) {
    key = keys[k]
  }

  return key
}

/* Exports */

export { getKey }
