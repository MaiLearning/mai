import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { TextControl } from './TextControl'

function Demo() {
  const [value, setValue] = useState('Привет, Mai')

  return <TextControl value={value} onChange={setValue} placeholder="Введите текст" />
}

const meta = {
  title: 'Settings/Controls/TextControl',
  component: TextControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: '',
    onChange: fn(),
    placeholder: 'Введите текст',
    disabled: false,
  },
  argTypes: {
    value: { control: 'text' },
    onChange: { control: false },
  },
} satisfies Meta<typeof TextControl>

export default meta

type Story = StoryObj<typeof meta>

/** Пустое поле с плейсхолдером. */
export const Default: Story = {}

/** Поле с введённым значением. */
export const Filled: Story = {
  args: { value: 'Название курса' },
}

/** Ограничение длины. */
export const MaxLength: Story = {
  args: { value: 'Коротко', maxLength: 12 },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { value: 'Недоступно', disabled: true },
}

/** Живой пример: ввод текста. */
export const Interactive: Story = {
  render: () => <Demo />,
}
