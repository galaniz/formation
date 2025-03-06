/**
 * Objects - Form Types
 */

/**
 * @typedef {'blur'|'submit'|'both'} FormValidateOn
 */
export type FormValidateOn = 'blur' | 'submit' | 'both'

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
 * @prop {HTMLLIElement|undefined} item
 * @prop {string} message
 * @prop {boolean} [changed]
 */
export interface FormErrorListItem {
  item: HTMLLIElement | undefined
  message: string
  changed?: boolean
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
 * @typedef {'errorSummary'|'errorList'|'error'} FormCloneKeys
 */
export type FormCloneKeys = 'errorSummary' | 'errorList' | 'error'

/**
 * @typedef {Map<FormCloneKeys, HTMLElement>} FormTemplates
 */
export type FormClones = Map<FormCloneKeys, HTMLElement>

/**
 * @typedef {'errorSummary'|'error'} FormTemplateKeys
 */
export type FormTemplateKeys = 'errorSummary' | 'error'

/**
 * @typedef {Map<FormTemplateKeys, HTMLElement>} FormTemplates
 */
export type FormTemplates = Map<FormTemplateKeys, HTMLElement>

/**
 * @typedef {function} FormValueFilter
 * @param {FormValue} value
 * @return {FormValue|null}
 */
export type FormValueFilter = (value: FormValue) => FormValue | null
