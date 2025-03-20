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
 * @prop {number} [raw]
 * @prop {string} [source='']
 */
export interface TabsActivateArgs {
  current: number
  raw?: number
  source?: string
}

/**
 * @typedef {object} TabsIndexesFilterArgs
 * @prop {number} [rawIndex]
 * @prop {number} currentIndex
 * @prop {number} lastIndex
 * @prop {number} panelIndex
 * @prop {number} lastPanelIndex
 * @prop {number} endIndex
 * @prop {string} source
 */
export interface TabsIndexesFilterArgs {
  rawIndex?: number
  currentIndex: number
  lastIndex: number
  panelIndex: number
  lastPanelIndex: number
  endIndex?: number
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
  source: string
}
