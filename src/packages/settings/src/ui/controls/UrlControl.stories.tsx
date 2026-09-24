import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { UrlControl } from './UrlControl'

function Demo() {
  const [value, setValue] = useState('https://mai.dev')

  return <UrlControl value={value} onChange={setValue} placeholder="https://…" />
}

const meta = {
  title: 'Settings/Controls/UrlControl',
  component: UrlControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: '',
    onChange: fn(),
    placeholder: 'https://…',
    disabled: false,
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { control: false },
  },
} satisfies Meta<typeof UrlControl>

export default meta

type Story = StoryObj<typeof meta>

/** Пустая ссылка. */
export const Default: Story = {}

/** Заполненная ссылка. */
export const Filled: Story = {
  args: { value: 'https://example.com/docs' },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { value: 'https://example.com', disabled: true },
}

/** Живой пример: ввод ссылки. */
export const Interactive: Story = {
  render: () => <Demo />,
}
