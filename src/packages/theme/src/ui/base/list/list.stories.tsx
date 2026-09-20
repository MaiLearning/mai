import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { List } from './list'

const meta = {
  title: 'Theme/Components/List',
  component: List,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'List управляет порядком, selection и клавиатурной навигацией, а List.Item предоставляет оболочку с произвольным содержимым.',
      },
    },
  },
  args: {
    children: null,
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
