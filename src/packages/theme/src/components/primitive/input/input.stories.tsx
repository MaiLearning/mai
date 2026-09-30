import { CloseIcon, EyeIcon, EyeOffIcon, Icon } from '@mai/icons'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { Input, InputAdornmentButton } from './input'

const meta = {
  title: 'Theme/Components/Primitive/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Примитив ввода: контейнер-группа с нативным `<input>`, опциональными startContent/endContent, фокус-кольцом и состояниями invalid/disabled.',
      },
    },
  },
  args: {
    placeholder: 'Введите текст',
    size: 'md',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Размер контрола.',
    },
    invalid: {
      control: 'boolean',
      description: 'Переводит контрол в состояние ошибки (danger-граница + aria-invalid).',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает ввод.',
    },
    startContent: {
      control: false,
      description: 'Контент слева внутри группы.',
    },
    endContent: {
      control: false,
      description: 'Контент справа внутри группы.',
    },
    placeholder: {
      control: 'text',
      description: 'Подсказка ввода.',
    },
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input placeholder="Обычный" />
      <Input placeholder="С ошибкой" invalid />
      <Input placeholder="Отключён" disabled />
      <Input placeholder="С ошибкой и отключён" invalid disabled />
    </div>
  ),
}

export const WithContent: Story = {
  render: () => {
    const [value, setValue] = useState('')
    const [visible, setVisible] = useState(false)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
        <Input
          placeholder="Поиск"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          endContent={
            value ? (
              <InputAdornmentButton
                type="button"
                aria-label="Очистить"
                onClick={() => setValue('')}
              >
                <CloseIcon />
              </InputAdornmentButton>
            ) : (
              <Icon aria-hidden="true">
                <SearchGlyph />
              </Icon>
            )
          }
        />
        <Input
          type={visible ? 'text' : 'password'}
          placeholder="Пароль"
          endContent={
            <InputAdornmentButton
              type="button"
              aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
              onClick={() => setVisible((value) => !value)}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </InputAdornmentButton>
          }
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Пример групп ввода: поиск с кнопкой очистки и пароль с переключателем видимости.',
      },
    },
  },
}

/** Ввод текста вызывает onChange со значением поля. */
export const Typing: Story = {
  render: () => <Input aria-label="Текст" onChange={fn()} />,
  play: async () => {
    const input = screen.getByRole('textbox', { name: 'Текст' })
    await userEvent.type(input, 'Привет')
    await expect(input).toHaveValue('Привет')
  },
}

function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}
