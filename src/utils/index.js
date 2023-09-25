/**
 * Utils
 */

/* Alter DOM */

export { prefix } from './functions/prefix'
export { setLoaders } from './functions/set-loaders'
export { stopScroll } from './functions/stop-scroll'
export { usingMouse } from './functions/using-mouse'
export {
  toggleFocusability,
  focusSelector,
  isItemFocusable,
  getInnerFocusableItems,
  getOuterFocusableItems
} from './functions/toggle-focusability'

/* Get values from DOM */

export { closest } from './functions/closest'
export { getKey } from './functions/get-key'
export { getDefaultFontSize } from './functions/get-default-font-size'
export { getOuterElements } from './functions/get-outer-elements'
export { setElements } from './functions/set-elements'
export { setSettings } from './functions/set-settings'
export { setItems } from './setItems/setItems'

/* Check DOM */

export { assetLoaded, assetsLoaded } from './functions/assets-loaded'

/* Object helpers */

export { isObject } from './isObject/isObject'
export { mergeObjects } from './functions/merge-objects'
export { recurseObject } from './functions/recurse-object'

/* Ajax requests */

export { urlEncode } from './functions/url-encode'
export { objectToFormData } from './functions/object-to-form-data'
export { request } from './functions/request'

/* Misc */

export { cascade } from './functions/cascade'
export { publish, subscribe } from './functions/pub-sub'
export { setCookie, getCookie } from './functions/cookie'
export { getDuration } from './functions/get-duration'
