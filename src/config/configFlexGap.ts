/**
 * Config - Flex Gap
 */

/* Imports */

import { config } from './config.js'

/**
 * Check browser flex box support
 *
 * @see {@link https://ishadeed.com/article/flexbox-gap/|Source}
 *
 * @return {void}
 */
const configFlexGap = (): void => {
  let flex: HTMLDivElement | null = document.createElement('div')

  flex.style.display = 'flex'
  flex.style.flexDirection = 'column'
  flex.style.rowGap = '1px'

  flex.append(document.createElement('div'))
  flex.append(document.createElement('div'))

  document.body.append(flex)

  if (flex.scrollHeight === 1) {
    config.flexGap = true
  } else {
    document.body.classList.add('no-flex-gap')
  }

  flex.remove()
  flex = null
}

/* Exports */

export { configFlexGap }
