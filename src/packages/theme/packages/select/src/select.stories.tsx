import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Select } from './select'

const items = [
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'js', label: 'JavaScript' },
  { value: 'ts', label: 'TypeScript' },
] as const

/**
 * Select — выпадающий список одиночного выбора. Раскрывается панелью
 * под триггером; выбор — кликом или клавиатурой (↑ ↓ Home End Enter Esc),
 * закрытие — кликом вне или Esc. Управляемый компонент.
 */
const meta = {
  title: 'Theme/Packages/Select/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Выпадающий список одиночного выбора. Панель рендерится порталом в body; выбор кликом или клавиатурой, закрытие — кликом вне или Esc. Управляемый: `value` + `onChange(value)`.',
      },
    },
  },
  args: {
    items: [...items],
    value: 'js',
    onChange: fn(),
    placeholder: 'Язык',
    'aria-label': 'Язык',
  },
  argTypes: {
    items: { control: false, description: 'Варианты с ключом value и подписью label.' },
    onChange: { action: 'change', description: 'Вызывается со значением выбранного варианта.' },
    placeholder: { control: 'text', description: 'Подпись, пока значение не выбрано.' },
    'aria-label': { control: 'text', description: 'Доступное имя списка.' },
    disabled: { control: 'boolean', description: 'Отключает открытие и выбор.' },
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState('js')
    return <Select {...args} value={value} onChange={setValue} />
  },
}

/** Плейсхолдер показывается, когда value не совпадает ни с одним пунктом. */
export const Placeholder: Story = {
  args: {
    value: '',
    placeholder: 'Выберите язык…',
  },
}

/** Отключённый список. */
export const Disabled: Story = {
  args: { disabled: true, value: 'js' },
}

/** Клик по триггеру открывает панель, выбор пункта закрывает и вызывает onChange. */
export const Play: Story = {
  args: { items: [...items], value: 'js', onChange: fn(), 'aria-label': 'Язык' },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('combobox'))
    await expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('option', { name: 'TypeScript' }))
    await expect(args.onChange).toHaveBeenCalledWith('ts')
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  },
}

/** Esc закрывает открытый список. */
export const PlayEsc: Story = {
  args: { items: [...items], value: 'js', onChange: fn(), 'aria-label': 'Язык' },
  play: async () => {
    await userEvent.click(screen.getByRole('combobox'))
    await expect(screen.getByRole('listbox')).toBeInTheDocument()
    await userEvent.keyboard('{Escape}')
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  },
}
