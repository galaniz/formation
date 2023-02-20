/**
 * Utils - toggle focusability
 */

/**
 * Function - toggle focusability of specified elements
 *
 * Source - https://bit.ly/3paRHkt
 *
 * @param {boolean} state
 * @param {array<HTMLElement>} items
 * @return {void}
 */

const toggleFocusability = (on = true, items = []) => {
  if (!items.length) {
    return
  }

  items.forEach(item => {
    if (on) {
      if (item.hasAttribute('data-tf-aria-hidden')) {
        const initAriaHidden = item.getAttribute('data-tf-aria-hidden')

        if (initAriaHidden !== 'null') {
          item.setAttribute('aria-hidden', initAriaHidden)
        } else {
          item.removeAttribute('aria-hidden')
        }

        item.removeAttribute('data-tf-aria-hidden')
      }

      if (item.hasAttribute('data-tf-tabindex')) {
        const initTabIndex = item.getAttribute('data-tf-tabindex')

        if (initTabIndex !== 'null') {
          item.setAttribute('tabindex', initTabIndex)
        } else {
          item.removeAttribute('tabindex')
        }

        item.removeAttribute('data-tf-tabindex')
      }
    } else {
      if (!item.hasAttribute('data-tf-aria-hidden')) {
        let ariaHiddenValue = 'null'

        if (item.hasAttribute('aria-hidden')) {
          ariaHiddenValue = item.getAttribute('aria-hidden')
        }

        item.setAttribute('data-tf-aria-hidden', ariaHiddenValue)
        item.setAttribute('aria-hidden', true)
      }

      if (!item.hasAttribute('data-tf-tabindex')) {
        item.setAttribute('data-tf-tabindex', item.getAttribute('tabindex'))
        item.setAttribute('tabindex', '-1')
      }
    }
  })
}

/**
 * Selector string to get focusable items
 *
 * @type {string}
 */

const focusSelector = 'a, area, input, select, textarea, button, [tabindex], [data-tf-tabindex], iframe'

/**
 * Store document focusable items
 *
 * @type {array<HTMLElement>}
 */

let _allFocusableItems = Array.from(document.querySelectorAll(focusSelector))

/**
 * Store items to exclude from getOuterFocusableItems
 *
 * @type {array<HTMLElement>}
 */

const innerFocusableItems = []

/**
 * Function - get outer focusable items
 *
 * @param {boolean} resetAll
 * @return {array<HTMLElement>}
 */

const getOuterFocusableItems = (resetAll = false) => {
  if (resetAll) {
    _allFocusableItems = Array.from(document.querySelectorAll(focusSelector))
  }

  let exclude = []

  innerFocusableItems.forEach((items) => {
    exclude = exclude.concat(items)
  })

  return _allFocusableItems.filter(item => {
    if (exclude.indexOf(item) === -1) {
      return true
    }

    return false
  })
}

/* Exports */

export {
  toggleFocusability,
  focusSelector,
  innerFocusableItems,
  getOuterFocusableItems
}
