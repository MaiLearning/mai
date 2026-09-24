import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { SegmentedControl } from './segmentedControl'

const views = [
  { value: 'list', label: 'Список' },
  { value: 'grid', label: 'Сетка' },
  { value: 'table', label: 'Таблица' },
] as const

/**
 * SegmentedControl — сегментированный переключатель. Один выбор из
 * 2–4 вариантов: активный сегмент выделяется подложкой выбранного
 * состояния и акцентной границей. Управляемый компонент.
 */
const meta = {
  title: 'UI/Primitive/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Сегментированный переключатель одной опции из нескольких. Активный сегмент выделен выбранной подложкой и акцентной границей. Управляемый: `value` + `onChange(value)`.',
      },
    },
  },
  args: {
    items: [...views],
    value: 'list',
    onChange: fn(),
    'aria-label': 'Вид',
  },
  argTypes: {
    items: { control: false, description: 'Сегменты с ключом value и подписью label.' },
    onChange: { action: 'change', description: 'Вызывается со значением выбранного сегмента.' },
    'aria-label': { control: 'text', description: 'Доступное имя элемента (radiogroup).' },
    disabled: { control: 'boolean', description: 'Отключает переключение.' },
  },
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('list')
    return <SegmentedControl {...args} value={value} onChange={setValue} />
  },
}

/** Отключённый переключатель. */
export const Disabled: Story = {
  args: { disabled: true, value: 'grid' },
}

/** Клик по сегменту вызывает onChange с его значением. */
export const Play: Story = {
  args: { items: [...views], value: 'list', onChange: fn(), 'aria-label': 'Вид' },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('radio', { name: 'Сетка' }))
    await expect(args.onChange).toHaveBeenCalledWith('grid')
  },
}
