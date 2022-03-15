/**
 * Utilities
 */

/* Alter DOM */

import { addClass } from './modules/add-class'
import { hasClass } from './modules/has-class'
import { removeClass } from './modules/remove-class'
import { show } from './modules/show'
import { prefix } from './modules/prefix'
import { objectFit } from './modules/object-fit'
import { setLoaders } from './modules/set-loaders'
import { usingMouse } from './modules/using-mouse'
import { toggleFocusability } from './modules/toggle-focusability'

/* Get values from DOM */

import { closest } from './modules/closest'
import { getScrollY } from './modules/get-scroll-y'
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
  getScrollY,
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
  usingMouse,
  toggleFocusability,
  setCookie,
  getCookie
}
