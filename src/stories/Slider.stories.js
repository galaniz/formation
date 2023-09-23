// import { within, userEvent } from '@storybook/testing-library'
import { createSlider } from './Slider'

export default {
  title: 'Example/Slider',
  render: ({ label, ...args }) => {
    return createSlider({ label, ...args })
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
}