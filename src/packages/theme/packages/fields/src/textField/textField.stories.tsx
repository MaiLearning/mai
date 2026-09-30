import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { TextField } from './textField'

/**
 * TextField — поле ввода одной строки. Управляемый нативный `<input>`
 * в обвязке Field: подпись, подсказка/ошибка, счётчик символов.
 */
const meta = {
  title: 'Theme/Packages/Fields/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле ввода одной строки: стилизованный нативный `<input>` в обвязке `Field`. Все стандартные атрибуты (type, value, onChange, placeholder, disabled, maxLength и т.д.) прокидываются. При заданном `max` (или нативном `maxLength`) счётчик символов считается из `value` автоматически и может быть переопределён через `count`.',
      },
    },
  },
  args: {
    label: 'Название курса',
    placeholder: 'Введите название',
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: 'Подпись поля.' },
    placeholder: { control: 'text', description: 'Текст-подсказка в пустом поле.' },
    max: { control: 'number', description: 'Лимит символов для счётчика.' },
    error: { control: 'text', description: 'Ошибка — подсветка поля danger.' },
    disabled: { control: 'boolean', description: 'Отключает ввод.' },
  },
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

/** Обычное текстовое поле с подписью. */
export const Basic: Story = {
  args: { defaultValue: 'Основы C#' },
}

/** Подсказка и счётчик символов — считаются из ввода в реальном времени. */
export const WithCounter: Story = {
  render: (args) => {
    const [value, setValue] = useState('Основы C#')
    return (
      <TextField
        {...args}
        hint="До 50 символов."
        max={50}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

/** Ошибка реактивна: при превышении лимита подсвечивается, при сокращении снимается. */
export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState('x'.repeat(51))
    return (
      <TextField
        {...args}
        max={50}
        value={value}
        error={value.length > 50 ? 'Слишком длинное название.' : undefined}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

/** Обязательное поле. */
export const Required: Story = {
  args: { required: true },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Архивный курс' },
}

/** Живой пример: управляемое поле со счётчиком. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <TextField
        {...args}
        label="Биография"
        hint="Максимум 140 символов."
        max={140}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

/** Ввод вызывает onChange с новым значением. */
export const Play: Story = {
  args: { onChange: fn(), label: 'Имя' },
  play: async ({ args }) => {
    await userEvent.type(screen.getByRole('textbox'), 'Витя')
    await expect(args.onChange).toHaveBeenCalled()
  },
}
