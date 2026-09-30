import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { SearchField } from './searchField'

/**
 * SearchField — поисковое поле с иконкой лупы. Нативный
 * `<input type="search">` в обвязке Field.
 */
const meta = {
  title: 'Theme/Packages/Fields/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поисковое поле: нативный `<input type="search">` в обвязке `Field` с иконкой лупы справа. Управляется извне (`value` + `onChange`).',
      },
    },
  },
  args: {
    placeholder: 'Найти курс…',
    value: '',
    onChange: fn(),
  },
  argTypes: {
    value: { control: 'text', description: 'Значение поискового запроса.' },
    placeholder: { control: 'text', description: 'Текст-подсказка в пустом поле.' },
    label: { control: 'text', description: 'Подпись поля (опционально).' },
    disabled: { control: 'boolean', description: 'Отключает ввод.' },
  },
} satisfies Meta<typeof SearchField>

export default meta

type Story = StoryObj<typeof meta>

/** Пустое поисковое поле. */
export const Empty: Story = {}

/** Поле с введённым запросом. */
export const WithQuery: Story = {
  args: { value: 'linq' },
}

/** Поле с подписью и подсказкой. */
export const WithLabel: Story = {
  args: { value: 'c#', label: 'Поиск', hint: 'Найдётся по названию и описанию.' },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { value: 'запрос', disabled: true },
}

/** Живой пример: ввод и очистка через локальный стейт. */
export const Interactive: Story = {
  render: (args) => {
    const [value, setValue] = useState('')
    return <SearchField {...args} value={value} onChange={(e) => setValue(e.target.value)} />
  },
}

/** Ввод вызывает onChange с новым значением. */
export const Play: Story = {
  args: { onChange: fn(), placeholder: 'Найти…' },
  play: async ({ args }) => {
    await userEvent.type(screen.getByRole('searchbox'), 'linq')
    await expect(args.onChange).toHaveBeenCalled()
  },
}
