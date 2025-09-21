/**
 * Objects - Form Types
 */

/* Imports */

import type { Generic } from '../../global/globalTypes.js'

/**
 * @typedef {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} FormInput
 */
export type FormInput = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

/**
 * @typedef {string|number|boolean|File} FormPrimitive
 */
export type FormPrimitive = string | number | boolean | File

/**
 * @typedef {object} FormGroup
 * @prop {HTMLElement} field
 * @prop {FormInput[]} inputs
 * @prop {HTMLElement|null} label
 * @prop {string} labelType
 * @prop {boolean} required
 * @prop {string[]} type
 * @prop {FormPrimitive[]} values
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
  values: FormPrimitive[]
  valid: boolean
  emptyMessage: string
  invalidMessage: string
}

/**
 * @typedef {Map<string, FormGroup>} FormGroups
 */
export type FormGroups = Map<string, FormGroup>

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
 * @prop {FormPrimitive[]} values
 * @prop {string} message
 * @prop {boolean} valid
 * @prop {number[]} ariaInvalid
 */
export interface FormValidateResult<V = FormPrimitive[]> {
  values: V
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
 * @typedef {object} FormValue
 * @extends {Generic}
 * @prop {FormPrimitive|FormPrimitive[]} value
 * @prop {string|string[]} type
 * @prop {string} [label]
 * @prop {string} [legend]
 */
export interface FormValue extends Generic {
  value: FormPrimitive | FormPrimitive[]
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
 * @typedef {object} FormChangeActionArgs
 * @prop {string} name
 * @prop {FormGroup} group
 */
export interface FormChangeActionArgs {
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
 * @typedef {'change'|'submit'|'both'} FormErrorOn
 */
export type FormErrorOn = 'change' | 'submit' | 'both'

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
 * @typedef {Map<FormCloneKeys, HTMLElement>} FormClones
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
