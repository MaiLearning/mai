import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, screen, userEvent } from 'storybook/test'
import { List } from './list'

/**
 * List — список дизайн-системы Mai. Управляет порядком, selection и
 * клавиатурной навигацией, а List.Item предоставляет оболочку с
 * произвольным содержимым.
 */
const meta = {
  title: 'Theme/Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'List управляет порядком, selection и клавиатурной навигацией, а List.Item предоставляет оболочку с произвольным содержимым. Режимы выборки: none, single, multiple.',
      },
    },
  },
  args: {
    children: null,
    selectionMode: 'none',
  },
  argTypes: {
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
      description: 'Режим выбора элементов.',
    },
    direction: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Направление раскладки элементов.',
    },
    gap: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Отступ между элементами.',
    },
    keyboardNavigation: {
      control: 'boolean',
      description: 'Клавиатурная навигация (↑ ↓ Home End Enter).',
    },
  },
} satisfies Meta<typeof List>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: function PlaygroundStory() {
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['document'])

    return (
      <List
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        style={{ maxWidth: 320 }}
      >
        <List.Item id="document">Документ</List.Item>
        <List.Item id="image">
          <span style={{ flex: 1 }}>Изображение</span>
          <button type="button" onClick={(event) => event.stopPropagation()}>
            Открыть
          </button>
        </List.Item>
        <List.Item id="archive" disabled>
          Архив
        </List.Item>
      </List>
    )
  },
}

/** Клик по элементу выбирает его в режиме single. */
export const Play: Story = {
  args: {
    children: null,
    selectionMode: 'single',
    onSelectionChange: fn(),
  },
  render: (args) => (
    <List {...args} style={{ maxWidth: 320 }}>
      <List.Item id="document">Документ</List.Item>
      <List.Item id="image">Изображение</List.Item>
    </List>
  ),
  play: async ({ args }) => {
    await userEvent.click(screen.getByRole('option', { name: 'Изображение' }))
    await expect(args.onSelectionChange).toHaveBeenCalledWith(['image'])
  },
}

export const MultipleSelection: Story = {
  render: () => (
    <List selectionMode="multiple" defaultSelectedKeys={['theory']} style={{ maxWidth: 320 }}>
      <List.Item id="theory">Теория</List.Item>
      <List.Item id="tasks">Задания</List.Item>
      <List.Item id="examples">Примеры</List.Item>
    </List>
  ),
}

export const DirectionsAndGaps: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <List direction="vertical" gap="sm">
        <List.Item id="vertical-1">Вертикальный элемент</List.Item>
        <List.Item id="vertical-2">Ещё один элемент</List.Item>
      </List>
      <List direction="horizontal" gap="12px">
        <List.Item id="horizontal-1">Горизонтальный элемент</List.Item>
        <List.Item id="horizontal-2">Ещё один элемент</List.Item>
      </List>
    </div>
  ),
}
