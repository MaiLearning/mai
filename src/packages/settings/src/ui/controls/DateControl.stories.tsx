import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { DateControl } from './DateControl'

function Demo() {
  const [value, setValue] = useState('2026-09-21')

  return <DateControl value={value} onChange={setValue} />
}

const meta = {
  title: 'Settings/Controls/DateControl',
  component: DateControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: '',
    onChange: fn(),
    disabled: false,
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { control: false },
  },
} satisfies Meta<typeof DateControl>

export default meta

type Story = StoryObj<typeof meta>

/** Пустая дата. */
export const Default: Story = {}

/** Заполненная дата (ISO-8601). */
export const Filled: Story = {
  args: { value: '2026-09-21' },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { value: '2026-09-21', disabled: true },
}

/** Живой пример: выбор даты. */
export const Interactive: Story = {
  render: () => <Demo />,
}
