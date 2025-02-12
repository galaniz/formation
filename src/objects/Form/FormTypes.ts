/**
 * Objects - Form Types
 */

/**
 * @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} FormInput
 */
export type FormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/**
 * @typedef {object} FormGroup
 * @prop {FormInput[]} inputs
 * @prop {HTMLElement|null} label
 * @prop {string} labelType
 * @prop {boolean} required
 * @prop {string} type
 * @prop {string[]} values
 * @prop {boolean} valid
 * @prop {string} emptyMessage
 * @prop {string} invalidMessage
 * @prop {boolean} allowAriaInvalid
 */
export interface FormGroup {
  inputs: FormInput[]
  label: HTMLElement | null
  labelType: 'legend' | 'label'
  required: boolean
  type: string
  values: string[]
  valid: boolean
  emptyMessage: string
  invalidMessage: string
  allowAriaInvalid: boolean
}

/**
 * @typedef {object} FormErrorListItem
 * @prop {HTMLLIElement} item
 * @prop {string} message
 */
export interface FormErrorListItem {
  item: HTMLLIElement
  message: string
}

/**
 * @typedef {Object} FormValidateResult
 * @prop {string[]} values
 * @prop {string} message
 * @prop {boolean} valid
 */
export interface FormValidateResult {
  values: string[]
  message: string
  valid: boolean
}

/**
 * @typedef {object} FormValue
 * @prop {string|string[]} value
 * @prop {string} type
 * @prop {string} [label]
 * @prop {string} [legend]
 */
export interface FormValue {
  value: string | string[]
  type: string
  label?: string
  legend?: string
}

/**
 * @typedef {function} FormValueFilter
 * @param {FormValue} value
 * @return {FormValue|null}
 */
export type FormValueFilter = (value: FormValue) => FormValue | null
