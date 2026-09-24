import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { SingleSelectionControl } from './SingleSelectionControl'

const themeOptions = ['system', 'light', 'dark']

const themeLabels: Record<string, string> = {
  system: 'Системная',
  light: 'Светлая',
  dark: 'Тёмная',
}

const manyOptions = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta']

function Demo() {
  const [value, setValue] = useState('system')

  return (
    <SingleSelectionControl
      value={value}
      onChange={setValue}
      options={themeOptions}
      labels={themeLabels}
    />
  )
}

const meta = {
  title: 'Settings/Controls/SingleSelectionControl',
  component: SingleSelectionControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: 'system',
    onChange: fn(),
    options: themeOptions,
    labels: themeLabels,
    disabled: false,
  },
  argTypes: {
    value: { control: 'text' },
    options: { control: 'object' },
    labels: { control: 'object' },
    onChange: { control: false },
  },
} satisfies Meta<typeof SingleSelectionControl>

export default meta

type Story = StoryObj<typeof meta>

/** Мало вариантов — сегментированный переключатель. */
export const Segmented: Story = {}

/** Много вариантов — выпадающий список. */
export const Select: Story = {
  args: { value: 'alpha', options: manyOptions, labels: {} },
}

/** Пустой список вариантов — пояснение вместо контрола. */
export const NoOptions: Story = {
  args: { value: '', options: [], labels: {} },
}

/** Отключённый контрол. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Живой пример: значение переключается. */
export const Interactive: Story = {
  render: () => <Demo />,
}
