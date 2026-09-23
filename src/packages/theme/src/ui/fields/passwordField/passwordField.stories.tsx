import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { PasswordField } from './passwordField'

/**
 * PasswordField — поле пароля с переключателем видимости. Нативный
 * `<input type="password">` в обвязке Field.
 */
const meta = {
  title: 'Theme/Fields/PasswordField',
  component: PasswordField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Поле пароля: нативный `<input type="password">` в обвязке `Field` с кнопкой переключения видимости справа. Все стандартные атрибуты (value, onChange, placeholder, disabled, autoComplete и т.д.) прокидываются.',
      },
    },
  },
  args: {
    label: 'Пароль',
    placeholder: 'Введите пароль',
    defaultValue: 'secret',
    autoComplete: 'current-password',
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text', description: 'Подпись поля.' },
    defaultVisible: { control: 'boolean', description: 'Начальное состояние видимости пароля.' },
    showToggle: { control: 'boolean', description: 'Скрыть кнопку переключения видимости.' },
    disabled: { control: 'boolean', description: 'Отключает ввод.' },
  },
} satisfies Meta<typeof PasswordField>

export default meta

type Story = StoryObj<typeof meta>

/** Скрытый пароль по умолчанию. */
export const Basic: Story = {}

/** Пароль виден сразу. */
export const Visible: Story = {
  args: { defaultVisible: true },
}

/** Отключённое поле. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Без кнопки переключения видимости. */
export const WithoutToggle: Story = {
  args: { showToggle: false },
}

/** Клик по глазу переключает видимость. */
export const Play: Story = {
  play: async () => {
    await expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password')
    await userEvent.click(screen.getByRole('button', { name: 'Показать пароль' }))
    await expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  },
}
