/**
 * Utils: toggle focusability of specified elements
 *
 * Source: https://bit.ly/3paRHkt
 *
 * @param {boolean} focusContext
 * @param {array} items
 */

/* Module */

const toggleFocusability = (on = true, items = []) => {
  if (!items.length) { return }

  items.forEach(item => {
    if (on) {
      if (item.hasAttribute('data-context-inert-aria-hidden')) {
        item.setAttribute('aria-hidden', item.getAttribute('data-context-inert-aria-hidden'))
        item.removeAttribute('data-context-inert-aria-hidden')
      }

      if (item.hasAttribute('data-context-inert-tabindex')) {
        const initTabIndex = item.getAttribute('data-context-inert-tabindex')

        if (initTabIndex !== 'null') {
          item.setAttribute('tabindex', initTabIndex)
        } else {
          item.removeAttribute('tabindex')
        }

        item.removeAttribute('data-context-inert-tabindex')
      }
    } else {
      if (!item.hasAttribute('data-context-inert-aria-hidden')) {
        let ariaHiddenValue = item.getAttribute('aria-hidden')

        if (!ariaHiddenValue) { ariaHiddenValue = false }

        item.setAttribute('data-context-inert-aria-hidden', ariaHiddenValue)
        item.setAttribute('aria-hidden', true)
      }

      if (!item.hasAttribute('data-context-inert-tabindex')) {
        item.setAttribute('data-context-inert-tabindex', item.getAttribute('tabindex'))
        item.setAttribute('tabindex', '-1')
        item.setAttribute('aria-hidden', true)
      }
    }
  })
}

/**
 * Selector string to get focusable items
 */

const focusSelector = 'a, area, input, select, textarea, button, [tabindex], [data-context-inert-tabindex], iframe'

/* Exports */

export { toggleFocusability, focusSelector }
