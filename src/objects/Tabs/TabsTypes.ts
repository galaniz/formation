/**
 * Objects - Tabs Types
 */

/**
 * @typedef {'horizontal'|'vertical'} TabsDirection
 */
export type TabsDirection = 'horizontal' | 'vertical'

/**
 * @typedef {object} TabsActivateArgs
 * @prop {number} current
 * @prop {boolean} [focus=true]
 * @prop {string} [source='']
 */
export interface TabsActivateArgs {
  current: number
  focus?: boolean
  source?: string
}

/**
 * @typedef {object} TabsIndexArgs
 * @prop {number} currentIndex
 * @prop {number} lastIndex
 * @prop {number} panelIndex
 * @prop {number} lastPanelIndex
 * @prop {number} endIndex
 * @prop {boolean} focus
 * @prop {string} source
 */
export interface TabsIndexArgs {
  currentIndex: number
  lastIndex: number
  panelIndex: number
  lastPanelIndex: number
  endIndex?: number
  focus: boolean
  source: string
}

/**
 * @typedef {object} TabsEventDetail
 * @prop {number} currentIndex
 * @prop {number} lastIndex
 * @prop {number} panelIndex
 * @prop {number} lastPanelIndex
 * @prop {number} endIndex
 * @prop {HTMLElement} panel
 * @prop {HTMLElement} lastPanel
 * @prop {HTMLElement} tab
 * @prop {HTMLElement} lastTab
 * @prop {boolean} focus
 * @prop {string} source
 */
export interface TabsEventDetail {
  currentIndex: number
  lastIndex: number
  panelIndex: number
  lastPanelIndex: number
  endIndex: number
  panel: HTMLElement
  lastPanel: HTMLElement
  tab: HTMLElement
  lastTab: HTMLElement
  focus: boolean
  source: string
}
