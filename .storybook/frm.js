import { create } from '@storybook/theming/create'

const colors = {
  primary: {
    dark: '#017358'
  },
  foreground: {
    dark: '#202020'
  },
  background: {
    light: '#fffdf8'
  }
}

export default create({
  base: 'light',
  brandTitle: 'Formation',
  brandUrl: '',
  brandImage: '../frm/img/logo.png',
  brandTarget: '_self',
  colorPrimary: colors.primary.dark,
  colorSecondary: colors.primary.dark,
  fontBase: 'Arial, sans-serif',
  fontCode: 'Inconsolata, monospace',
  appBg: colors.background.light,
  appContentBg: colors.background.light,
  appBorderColor: '#d2d1cd',
  textColor: colors.foreground.dark,
  textInverseColor: colors.background.light,
  barTextColor: colors.foreground.dark,
  barSelectedColor: colors.primary.dark,
  barBg: colors.background.light,
  inputBorder: '#8f8f8c',
  inputTextColor: colors.foreground.dark,
  inputBg: colors.background.light
})
