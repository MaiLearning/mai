import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './field'

/**
 * Field — примитив поля: подпись с обязательностью и счётчиком символов,
 * контрол (через children) и сообщение под ним (подсказка или ошибка).
 * Универсальный базис для конкретных полей и произвольных контролов.
 */
const meta = {
  title: 'Theme/Components/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Примитив поля: подпись (`label`) с обязательностью (`required`) и счётчиком символов (`count`/`max`), контрол через `children` и сообщение под ним — `hint` или перекрывающая его `error`. Связь подписи с контролом — через `htmlFor`. Поля из `ui/fields/` построены на нём.',
      },
    },
  },
  argTypes: {
    label: { control: 'text', description: 'Подпись поля.' },
    required: { control: 'boolean', description: 'Показывает звёздочку у подписи.' },
    hint: { control: 'text', description: 'Подсказка под контролом.' },
    error: { control: 'text', description: 'Ошибка — перекрывает hint, подсвечивается danger.' },
    count: { control: 'number', description: 'Текущее количество символов.' },
    max: {
      control: 'number',
      description: 'Лимит символов; при превышении счётчик становится danger.',
    },
    disabled: { control: 'boolean', description: 'Приглушает подпись и сообщения.' },
    htmlFor: { control: 'text', description: 'id контрола для связи label ↔ control.' },
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/** Поле с подписью, подсказкой и контролом. */
export const Basic: Story = {
  args: {
    label: 'Название',
    hint: 'Например, «Основы C#».',
    children: <input id="name" defaultValue="React" />,
  },
}

/** Обязательное поле — звёздочка у подписи. */
export const Required: Story = {
  args: {
    label: 'Email',
    required: true,
    children: <input id="email" />,
  },
}

/** Счётчик символов в норме. */
export const Counter: Story = {
  args: {
    label: 'Описание',
    count: 42,
    max: 100,
    children: <input id="desc" />,
  },
}

/** Счётчик превысил лимит — подсветка danger. */
export const CounterOver: Story = {
  args: {
    label: 'Описание',
    count: 101,
    max: 100,
    error: 'Слишком длинное описание.',
    children: <input id="desc" defaultValue={'x'.repeat(101)} />,
  },
}

/** Ошибка перекрывает подсказку и подсвечивается danger. */
export const WithError: Story = {
  args: {
    label: 'Ссылка',
    hint: 'Начинается с https://',
    error: 'Неверный формат ссылки.',
    children: <input id="url" defaultValue="not-a-url" />,
  },
}

/** Отключённое поле — подпись и сообщения приглушены. */
export const Disabled: Story = {
  args: {
    label: 'Только для чтения',
    hint: 'Доступно после публикации.',
    disabled: true,
    children: <input id="ro" defaultValue="значение" disabled />,
  },
}

/** Без подписи — только контрол и сообщение (используют конкретные поля). */
export const WithoutLabel: Story = {
  args: {
    hint: 'Контрол без подписи.',
    children: <input id="bare" />,
  },
}
