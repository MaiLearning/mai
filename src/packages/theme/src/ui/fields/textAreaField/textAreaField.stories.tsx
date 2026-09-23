import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { TextAreaField } from './textAreaField'

/**
 * TextAreaField — многострочное поле ввода. Нативный `<textarea>` в
 * обвязке Field.
 */
const meta = {
  title: 'Theme/Fields/TextAreaField',
  component: TextAreaField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Многострочное поле ввода: стилизованный нативный `<textarea>` в обвязке `Field`. Все стандартные атрибуты (value, onChange, placeholder, rows, maxLength, disabled и т.д.) прокидываются. При заданном `max` (или нативном `maxLength`) счётчик символов считается из `value` автоматически и может быть переопределён через `count`.',
      },
    },
  },
  args: {
    label: 'Описание',
    placeholder: 'Опишите материал курса…',
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: 'Подпись поля.' },
    placeholder: { control: 'text', description: 'Текст-подсказка в пустом поле.' },
    rows: { control: 'number', description: 'Начальное количество строк.' },
    max: { control: 'number', description: 'Лимит символов для счётчика.' },
    error: { control: 'text', description: 'Ошибка — подсветка поля danger.' },
  },
} satisfies Meta<typeof TextAreaField>

export default meta

type Story = StoryObj<typeof meta>

/** Многострочное поле с подписью. */
export const Basic: Story = {
  args: {
    defaultValue: 'Базовый курс по C#: типы, коллекции, LINQ.',
    rows: 5,
  },
}

/** Подсказка и счётчик символов. */
export const WithCounter: Story = {
  args: { defaultValue: 'Короткое описание', hint: 'До 200 символов.', max: 200 },
}

/** Ошибка подсвечивает поле и подпись danger. */
export const WithError: Story = {
  args: { defaultValue: 'x'.repeat(201), error: 'Описание длиннее 200 символов.', max: 200 },
}

/** Обязательное поле. */
export const Required: Story = {
  args: { required: true },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Архивное описание' },
}

/** Живой пример: управляемое поле со счётчиком. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return (
      <TextAreaField
        {...args}
        label="Описание"
        hint="Максимум 200 символов."
        max={200}
        rows={5}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )
  },
}

/** Ввод вызывает onChange с новым значением. */
export const Play: Story = {
  args: { onChange: fn(), label: 'Заметка' },
  play: async ({ args }) => {
    await userEvent.type(screen.getByRole('textbox'), 'Текст')
    await expect(args.onChange).toHaveBeenCalled()
  },
}
