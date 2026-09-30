import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Text } from '../../foundation/text/text'
import { Checkbox } from './checkbox'

/**
 * Checkbox — флажок выбора дизайн-системы Mai. Управляемый компонент:
 * состояние передаётся пропом `checked`, переключение — через `onChange`.
 * Доступность обеспечивают `role="checkbox"` и `aria-checked`.
 */
const meta = {
  title: 'Theme/Components/Primitive/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Флажок выбора одного значения. Управляемый: состояние живёт в родителе и передаётся через `checked`, переключение — `onChange(checked)`. Для доступности задайте `aria-label`.',
      },
    },
  },
  args: {
    checked: false,
    onChange: fn(),
    'aria-label': 'Согласен с условиями',
  },
  argTypes: {
    checked: { control: 'boolean', description: 'Текущее состояние флажка.' },
    'aria-label': { control: 'text', description: 'Доступное имя флажка.' },
    onChange: { action: 'change', description: 'Вызывается с новым значением при переключении.' },
    id: { control: 'text', description: 'Идентификатор элемента.' },
    disabled: { control: 'boolean', description: 'Отключает переключение.' },
  },
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

/** Выбранное состояние. */
export const Checked: Story = {
  args: { checked: true },
}

/** Снятый флажок — состояние по умолчанию. */
export const Unchecked: Story = {
  args: { checked: false },
}

/** Отключённый флажок — выглядит приглушённым, клик не работает. */
export const Disabled: Story = {
  args: { checked: true, disabled: true },
}

/** С подписью рядом — как в реальных формах. */
export const WithLabel: Story = {
  args: {
    checked: true,
    'aria-label': 'Уведомлять об изменениях',
  },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Checkbox {...args} />
      <Text size="md">Уведомлять об изменениях</Text>
    </div>
  ),
}

/** Живой пример: переключение через локальный стейт. */
export const Interactive: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false)
    return <Checkbox {...args} checked={checked} onChange={setChecked} />
  },
}

/** Клик по флажку вызывает onChange с инвертированным значением. */
export const Play: Story = {
  args: { checked: false, onChange: fn(), 'aria-label': 'Отметьте пункт' },
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('checkbox'))
    await expect(args.onChange).toHaveBeenCalledWith(true)
  },
}
