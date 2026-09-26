import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Breadcrumbs } from './breadcrumbs'

/**
 * Breadcrumbs — навигационная цепочка пути. Ссылки (`Link`), текстовые
 * крошки и разделители; текущий элемент помечается `aria-current` и не
 * является ссылкой.
 */
const meta = {
  title: 'UI/Pattern/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Цепочка пути: показывает расположение пользователя и путь назад. Состоит из ссылок и текстовых крошек, разделённых шевроном. Текущий (последний) элемент выделен и получает aria-current="page". Длинные цепочки сворачиваются в многоточие через maxItems.',
      },
    },
  },
  args: {
    ariaLabel: 'Путь',
    items: [
      { label: 'Курс', href: '/course/1' },
      { label: 'Модуль', href: '/course/1/module/2' },
      { label: 'Общие', current: true },
    ],
  },
  argTypes: {
    items: { control: 'object' },
    separator: { control: false },
    ariaLabel: { control: 'text' },
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Ссылки с обработчиком вместо href. */
export const WithOnClick: Story = {
  args: {
    items: [
      { label: 'Главная', onClick: fn() },
      { label: 'Настройки', onClick: fn() },
      { label: 'Общие', current: true },
    ],
  },
}

/** Свёрнутая цепочка: первый пункт + последние при `maxItems`. */
export const Collapsed: Story = {
  args: {
    maxItems: 2,
    items: [
      { label: 'Главная', href: '/' },
      { label: 'Курс', href: '/course/1' },
      { label: 'Модуль', href: '/course/1/module/2' },
      { label: 'Тема', href: '/course/1/module/2/lesson/3' },
      { label: 'Общие', current: true },
    ],
  },
}

/** Свой разделитель вместо шеврона. */
export const CustomSeparator: Story = {
  args: {
    separator: <span>/</span>,
  },
}

/** Одна крошка — только текущий раздел. */
export const Single: Story = {
  args: {
    items: [{ label: 'Общие', current: true }],
  },
}
