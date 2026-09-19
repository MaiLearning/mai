import { Button } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import type { CourseNode } from '../model/types'
import { DeleteNodeModal } from './DeleteNodeModal'

const folderNode: CourseNode = {
  id: 'folder-intro',
  type: 'folder',
  title: 'Введение',
  children: [
    { id: 'res-what', type: 'resource', title: 'Что такое Mai' },
    { id: 'res-setup', type: 'resource', title: 'Установка и запуск' },
  ],
}

const resourceNode: CourseNode = {
  id: 'res-setup',
  type: 'resource',
  title: 'Установка и запуск',
}

/**
 * DeleteNodeModal — подтверждение удаления узла структуры. Папка удаляется
 * вместе с содержимым, ресурс — сам. Пока идёт удаление, закрытие запрещено.
 */
const meta = {
  title: 'sidebar/DeleteNodeModal',
  component: DeleteNodeModal,
  tags: ['autodocs'],
  args: {
    target: resourceNode,
    onConfirm: async () => {},
    onClose: fn(),
  },
  argTypes: {
    target: { control: false },
    onConfirm: { control: false },
  },
} satisfies Meta<typeof DeleteNodeModal>

export default meta

type Story = StoryObj<typeof meta>

/** Удаление ресурса — вопрос про сам узел. */
export const Resource: Story = {}

/** Удаление папки — предупреждение про всё её содержимое. */
export const Folder: Story = {
  args: { target: folderNode },
}

/** Закрытое состояние: `target === null`, модалка не рендерится. */
export const Closed: Story = {
  args: { target: null },
}

/** Живой сценарий: открытие кнопками и закрытие через onClose. */
export const Interactive: Story = {
  render: () => {
    const [target, setTarget] = useState<CourseNode | null>(null)

    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button onClick={() => setTarget(resourceNode)}>Удалить ресурс</Button>
        <Button variant="secondary" onClick={() => setTarget(folderNode)}>
          Удалить папку
        </Button>
        <DeleteNodeModal
          target={target}
          onConfirm={async () => {}}
          onClose={() => setTarget(null)}
        />
      </div>
    )
  },
  args: { target: null },
}
