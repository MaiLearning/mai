import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field'

/** Поле формы с лейблом, обязательностью, счётчиком символов и сообщениями об ошибках. */
const meta = {
  title: 'Course/UI/Field',
  component: Field,
  tags: ['autodocs'],
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

/** Базовое текстовое поле без подсказок. */
export const Default: Story = {
  args: {
    label: 'Название',
    children: (
      <input
        type="text"
        defaultValue="Пример текста"
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          width: 280,
          fontFamily: 'inherit',
        }}
      />
    ),
  },
}

/** Обязательное поле с индикатором. */
export const Required: Story = {
  args: {
    label: 'Название',
    required: true,
    children: (
      <input
        type="text"
        defaultValue="Важное значение"
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          width: 280,
          fontFamily: 'inherit',
        }}
      />
    ),
  },
}

/** Поле со счётчиком символов (норма). */
export const WithCounter: Story = {
  args: {
    label: 'Описание',
    count: 42,
    max: 200,
    children: (
      <textarea
        defaultValue="Достаточно длинный текст для демонстрации счётчика символов в форме"
        rows={3}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          width: 280,
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
    ),
  },
}

/** Поле со счётчиком символов (превышение лимита). */
export const CounterOverLimit: Story = {
  args: {
    label: 'Описание',
    count: 215,
    max: 200,
    children: (
      <textarea
        defaultValue="Превышен лимит символов, счётчик показывает красным цветом текущее значение"
        rows={3}
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          width: 280,
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
    ),
  },
}

/** Поле с ошибкой валидации. */
export const WithError: Story = {
  args: {
    label: 'Email',
    error: 'Необходимо ввести корректный email адрес',
    children: (
      <input
        type="text"
        defaultValue="некорректный@email"
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          width: 280,
          fontFamily: 'inherit',
        }}
      />
    ),
  },
}

/** Поле с подсказкой. */
export const WithHint: Story = {
  args: {
    label: 'Теги',
    hint: 'Можно добавить несколько тегов через запятую или Enter',
    children: (
      <input
        type="text"
        defaultValue="раз, два, три"
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #ccc',
          width: 280,
          fontFamily: 'inherit',
        }}
      />
    ),
  },
}
