/** @type { import('@storybook/html').Preview } */

const preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on[A-Z].*'
    },
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

export default preview
