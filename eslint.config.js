/**
 * Eslint
 */

/* Imports */

import tseslint, { parser } from 'typescript-eslint'

/* Config */

export default tseslint.config(
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parser: parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      'semi': ['error', 'never'], // No trailing semicolons
      'comma-dangle': ['error', 'never'] // No trailing commas
    }
  }
)
