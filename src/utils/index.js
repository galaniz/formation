/**
 * Utils
 */

/* Alter DOM */

import { addClass } from './modules/add-class'
import { hasClass } from './modules/has-class'
import { removeClass } from './modules/remove-class'
import { show } from './modules/show'
import { prefix } from './modules/prefix'
import { objectFit } from './modules/object-fit'
import { setLoaders } from './modules/set-loaders'
import { stopScroll } from './modules/stop-scroll'
import { usingMouse } from './modules/using-mouse'
import { toggleFocusability, focusSelector } from './modules/toggle-focusability'

/* Get values from DOM */

import { closest } from './modules/closest'
import { getKey } from './modules/get-key'
import { getScrollY } from './modules/get-scroll-y'
import { getDefaultFontSize } from './modules/get-default-font-size'
import { setElements } from './modules/set-elements'

/* Check DOM */

import { assetLoaded, assetsLoaded } from './modules/assets-loaded'

/* Object helpers */

import { mergeObjects } from './modules/merge-objects'
import { recurseObject } from './modules/recurse-object'

/* Ajax requests */

import { urlEncode } from './modules/url-encode'
import { request } from './modules/request'

/* Misc */

import { cascade } from './modules/cascade'
import { publish, subscribe } from './modules/pub-sub'
import { setCookie, getCookie } from './modules/cookie'

/* Exports */

export {
  addClass,
  removeClass,
  hasClass,
  show,
  setLoaders,
  prefix,
  objectFit,
  closest,
  getKey,
  getScrollY,
  getDefaultFontSize,
  setElements,
  assetLoaded,
  assetsLoaded,
  mergeObjects,
  recurseObject,
  urlEncode,
  request,
  cascade,
  publish,
  subscribe,
  stopScroll,
  usingMouse,
  toggleFocusability,
  focusSelector,
  setCookie,
  getCookie
}
