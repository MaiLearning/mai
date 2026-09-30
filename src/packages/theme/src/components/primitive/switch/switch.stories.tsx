import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Text } from '../../foundation/text/text'
import { Switch } from './switch'

/**
 * Switch — переключатель on/off. Управляемый компонент с псевдосе-
 * мантикой нативной кнопки: `role="switch"` и `aria-checked` обеспе-
 * чивают доступность без скрытых инпутов.
 */
const meta = {
  title: 'Theme/Components/Primitive/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Переключатель on/off. Управляемый: состояние живёт в родителе и передаётся через `checked`, переключение — `onChange(checked)`. Для доступности задайте `aria-label`.',
      },
    },
  },
  args: {
    checked: false,
    onChange: fn(),
    'aria-label': 'Включить уведомления',
  },
  argTypes: {
    checked: { control: 'boolean', description: 'Текущее состояние переключателя.' },
    onChange: { action: 'change', description: 'Вызывается с новым значением при переключении.' },
    id: { control: 'text', description: 'Идентификатор элемента.' },
    'aria-label': { control: 'text', description: 'Доступное имя переключателя.' },
    disabled: { control: 'boolean', description: 'Отключает переключение.' },
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

/** Выключенное состояние. */
export const Off: Story = {
  args: { checked: false },
}

/** Включённое состояние. */
export const On: Story = {
  args: { checked: true },
}

/** Отключённый переключатель — клик не работает. */
export const Disabled: Story = {
  args: { checked: true, disabled: true },
}

/** С подписью — как в рядах настроек. */
export const WithLabel: Story = {
  args: {
    checked: true,
    'aria-label': 'Уведомления об обновлениях',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Switch {...args} />
      <Text size="md">Уведомления об обновлениях</Text>
    </div>
  ),
}

/** Живой пример: переключение через локальный стейт. */
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Switch {...args} checked={checked} onChange={setChecked} />
  },
}

/** Клик по переключателю вызывает onChange с инвертированным значением. */
export const Play: Story = {
  args: { checked: false, onChange: fn(), 'aria-label': 'Уведомления' },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('switch'))
    await expect(args.onChange).toHaveBeenCalledWith(true)
  },
}
