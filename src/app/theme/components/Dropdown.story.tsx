import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'
import { useState } from 'react'
import { fn } from 'storybook/test'
import type { DropdownOption } from './Dropdown'
import { Dropdown } from './Dropdown'

const LANGUAGES: DropdownOption[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
]

const THEMES: DropdownOption[] = [
  { value: 'light', label: 'Светлая' },
  { value: 'dark', label: 'Тёмная' },
  { value: 'sepia', label: 'Сепия' },
  { value: 'midnight', label: 'Полночь' },
]

const MANY_ITEMS: DropdownOption[] = Array.from({ length: 30 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Материал ${i + 1}`,
}))

const meta = {
  title: 'Theme/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { onChange: fn() },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Выпадающий список: триггер-кнопка и портал-меню в body — фон меню всегда соответствует ' +
          'активной теме (нативный <select> не используется). Меню открывается под триггером, ' +
          'а при нехватке места снизу — над ним. Клавиатура: Enter/Space/↑/↓ — открыть, ' +
          '↑/↓/Home/End — навигация, Enter/Space — выбрать, Escape/Tab/клик вне — закрыть.',
      },
    },
  },
} satisfies Meta<typeof Dropdown>

export default meta
type Story = StoryObj<typeof meta>

function ControlledDropdown({
  value: initialValue = '',
  options = [],
  ...args
}: Partial<ComponentProps<typeof Dropdown>>) {
  const [value, setValue] = useState(initialValue)

  return <Dropdown {...args} value={value} options={options} onChange={setValue} />
}

/** Типовое использование: выбор одного значения. */
export const Default: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: { value: 'ru', options: LANGUAGES, 'aria-label': 'Язык' },
}

/** Вариантов немного, проверка на разных темах через переключатель темы приложения. */
export const ThemeOptions: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: { value: 'dark', options: THEMES, 'aria-label': 'Тема' },
}

/** Длинный список — меню ограничено по высоте и прокручивается. */
export const LongList: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: { value: 'item-1', options: MANY_ITEMS, 'aria-label': 'Материалы' },
}

/** Заблокированный триггер не открывается ни мышью, ни клавиатурой. */
export const Disabled: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: { value: 'ru', options: LANGUAGES, disabled: true, 'aria-label': 'Язык' },
}

/** Пустой список опций: в меню заглушка «Нет вариантов». */
export const EmptyOptions: Story = {
  render: (args) => <ControlledDropdown {...args} />,
  args: { value: '', options: [], placeholder: 'Выберите…', 'aria-label': 'Пусто' },
}
