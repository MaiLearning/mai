import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { ToggleControl } from './ToggleControl'

function Demo() {
  const [value, setValue] = useState(false)

  return <ToggleControl value={value} onChange={setValue} />
}

const meta = {
  title: 'Settings/Controls/ToggleControl',
  component: ToggleControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: false,
    onChange: fn(),
    disabled: false,
  },
  argTypes: {
    value: { control: 'boolean' },
    onChange: { control: false },
  },
} satisfies Meta<typeof ToggleControl>

export default meta

type Story = StoryObj<typeof meta>

/** Выключенный переключатель. */
export const Default: Story = {}

/** Включённый переключатель. */
export const On: Story = {
  args: { value: true },
}

/** Отключённый переключатель. */
export const Disabled: Story = {
  args: { value: true, disabled: true },
}

/** Живой пример: состояние переключается по клику. */
export const Interactive: Story = {
  render: () => <Demo />,
}
