/**
 * Config - Inert Fallback
 */

/* Imports */

import { config, configFallback } from './config'
import {
  toggleFocusabilityFallback,
  getOuterFocusableItemsFallback
} from '../utils/toggleFocusability/toggleFocusabilityFallback'

/**
 * Add fallbacks for toggle focusability and get outer focusable items if inert not supported
 *
 * @return {void}
 */
const configInertFallback = (): void => {
  if (config.inert) {
    return
  }

  configFallback.toggleFocusability = toggleFocusabilityFallback
  configFallback.getOuterFocusableItems = getOuterFocusableItemsFallback
}

/* Exports */

export { configInertFallback }
