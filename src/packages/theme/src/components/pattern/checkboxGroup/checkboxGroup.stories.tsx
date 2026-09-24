import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { CheckboxGroup } from './checkboxGroup'

const frameworks = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
] as const

/**
 * CheckboxGroup — группа флажков выбора нескольких значений. Значения
 * хранятся в массиве: переключение элемента добавляет или убирает его
 * из `value`. Подписи элементов идут рядом с флажками.
 */
const meta = {
  title: 'UI/Pattern/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Группа флажков множественного выбора. Управляемая через массив `value` и `onChange(value[])`; переключение пункта добавляет или удаляет его из массива.',
      },
    },
  },
  args: {
    items: [...frameworks],
    value: ['react'],
    onChange: fn(),
    'aria-label': 'Технологии',
  },
  argTypes: {
    items: { control: false, description: 'Список пунктов с ключом value и подписью label.' },
    onChange: { action: 'change', description: 'Вызывается с новым массивом выбранных значений.' },
    'aria-label': { control: 'text', description: 'Доступное имя группы.' },
    disabled: { control: 'boolean', description: 'Отключает все флажки группы.' },
  },
} satisfies Meta<typeof CheckboxGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState<string[]>(['react'])
    return <CheckboxGroup {...args} value={value} onChange={setValue} />
  },
}

/** Все флажки отключены — выбор недоступен. */
export const Disabled: Story = {
  args: { disabled: true, value: ['react'] },
}

/** Живой пример с множественным выбором. */
export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['react', 'vue'])
    return <CheckboxGroup items={[...frameworks]} value={value} onChange={setValue} />
  },
}

/** Клик по пункту добавляет или удаляет его из value. */
export const Play: Story = {
  args: {
    items: [...frameworks],
    value: ['react'],
    onChange: fn(),
    'aria-label': 'Технологии',
  },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('checkbox', { name: 'Vue' }))
    await expect(args.onChange).toHaveBeenCalledWith(['react', 'vue'])
  },
}
