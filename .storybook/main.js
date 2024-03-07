/** @type { import('@storybook/html-vite').StorybookConfig } */

const config = {
  stories: [
    '../src/**/*.stories.js'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-storysource'
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {}
  },
  docs: {
    autodocs: 'tag'
  }
}

export default config
