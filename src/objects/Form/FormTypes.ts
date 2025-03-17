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
 * @prop {HTMLElement} field
 * @prop {FormInput[]} inputs
 * @prop {HTMLElement|null} label
 * @prop {string} labelType
 * @prop {boolean} required
 * @prop {string[]} type
 * @prop {string[]} values
 * @prop {boolean} valid
 * @prop {string} emptyMessage
 * @prop {string} invalidMessage
 */
export interface FormGroup {
  field: HTMLElement
  inputs: FormInput[]
  label: HTMLElement | null
  labelType: 'legend' | 'label'
  required: boolean
  type: string[]
  values: string[]
  valid: boolean
  emptyMessage: string
  invalidMessage: string
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
 * @prop {number[]} ariaInvalid
 */
export interface FormValidateResult {
  values: string[]
  message: string
  valid: boolean
  ariaInvalid: number[]
}

/**
 * @typedef {object} FormValidateFilterArgs
 * @prop {string} name
 * @prop {FormGroups} groups
 */
export interface FormValidateFilterArgs {
  name: string
  groups: FormGroups
}

/**
 * @typedef {Map<string, FormGroup>} FormGroups
 */
export type FormGroups = Map<string, FormGroup>

/**
 * @typedef {object} FormValue
 * @prop {string|boolean|number} value
 * @prop {string|string[]} type
 * @prop {string} [label]
 * @prop {string} [legend]
 */
export interface FormValue {
  value: string | boolean | number | string[] | number[]
  type: string | string[]
  label?: string
  legend?: string
}

/**
 * @typedef {object} FormValueFilterArgs
 * @prop {string} name
 * @prop {FormGroup} group
 */
export interface FormValueFilterArgs {
  name: string
  group: FormGroup
}

/**
 * @typedef {Object<string, FormValue>} FormValues
 */
export type FormValues = Record<string, FormValue>

/**
 * @typedef {object} FormValuesFilterArgs
 * @prop {FormGroups} groups
 */
export interface FormValuesFilterArgs {
  groups: FormGroups
}

/**
 * @typedef {'errorSummary'|'errorList'|'errorInline'|'error'|'success'|'loader'} FormCloneKeys
 */
export type FormCloneKeys =
  'errorSummary' |
  'errorList' |
  'errorInline' |
  'error' |
  'success' |
  'loader'

/**
 * @typedef {Map<FormCloneKeys, HTMLElement>} FormTemplates
 */
export type FormClones = Map<FormCloneKeys, HTMLElement>

/**
 * @typedef {'errorSummary'|'errorInline'|'error'|'success'|'loader'} FormTemplateKeys
 */
export type FormTemplateKeys =
  'errorSummary' |
  'errorInline' |
  'error' |
  'success' |
  'loader'

/**
 * @typedef {Map<FormTemplateKeys, HTMLElement>} FormTemplates
 */
export type FormTemplates = Map<FormTemplateKeys, HTMLElement>
