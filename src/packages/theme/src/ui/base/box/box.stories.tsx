import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from './box'

/**
 * Box — нейтральный блочный контейнер-обёртка. Позиционирование и
 * раскладку задаёт потребитель через обычные CSS-атрибуты; компонент
 * приводит блочную модель (box-sizing, сброс полей) к масштабу темы.
 */
const meta = {
  title: 'Theme/Components/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Нейтральный блочный контейнер. Всё содержимое и стили передаются через стандартные атрибуты `<div>`; Box лишь нормализует блочную модель под тему.',
      },
    },
  },
  argTypes: {
    children: { control: false, description: 'Любой контент внутри контейнера.' },
  },
} satisfies Meta<typeof Box>

export default meta

type Story = StoryObj<typeof meta>

/** Пустой контейнер — ожидается, что содержимое соберёт потребитель. */
export const Playground: Story = {
  args: {
    children: null,
  },
}

/** Контейнер с произвольным содержимым. */
export const WithContent: Story = {
  args: {
    children: 'Содержимое блочного контейнера.',
  },
}
