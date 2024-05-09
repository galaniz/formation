/**
 * Config - Flex Gap
 */

/* Imports */

import { config } from './config'

/**
 * Function - check browser flex box support
 *
 * Source: https://ishadeed.com/article/flexbox-gap/
 *
 * @return {void}
 */
const configFlexGap = (): void => {
  let flex: HTMLDivElement | null = document.createElement('div')

  flex.style.display = 'flex'
  flex.style.flexDirection = 'column'
  flex.style.rowGap = '1px'

  flex.appendChild(document.createElement('div'))
  flex.appendChild(document.createElement('div'))

  document.body.appendChild(flex)

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
