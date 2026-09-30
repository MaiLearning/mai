import type { Meta, StoryObj } from '@storybook/react-vite'
import { Box } from './box'

/**
 * Box — нейтральный блочный контейнер и **база всех layout-компонентов
 * фонда**: приводит блочную модель к масштабу темы и служит точкой
 * подключения для специализаций (`Container`, `Flex`, `Stack`).
 */
const meta = {
  title: 'Theme/Components/Foundation/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Нейтральный блочный контейнер. Правил раскладки не имеет: нормализует блочную модель (`box-sizing`, сброс полей, `min-width: 0`) и передаёт все стандартные атрибуты `<div>`. Отступы, размеры и ось раскладки — зона специализаций: `Container`, `Flex`, `Stack`.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'main', 'article', 'header', 'footer', 'aside', 'nav'],
      description: 'Семантический тег корня.',
    },
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

/** Семантический тег корня. */
export const SemanticTag: Story = {
  args: {
    as: 'section',
    children: 'Контейнер отрисован как <section>.',
  },
}
