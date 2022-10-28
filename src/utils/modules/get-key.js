/**
 * Utils: get key value as uppercase code
 *
 * @param {object} event
 * @return {string} key value
 */

/* Module */

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
    40: 'DOWN'
  }

  if (Object.getOwnPropertyDescriptor(keys, k)) {
    key = keys[k]
  }

  return key
}

/* Exports */

export { getKey }
