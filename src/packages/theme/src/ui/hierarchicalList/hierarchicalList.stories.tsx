import type { Meta, StoryObj } from '@storybook/react-vite'
import { HierarchicalList } from './hierarchicalList'

const meta = {
  title: 'Theme/HierarchicalList',
  component: HierarchicalList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Иерархический список строится композицией HierarchicalList.Item. Каждый Item принимает value и произвольное содержимое, включая вложенные Item.',
      },
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof HierarchicalList>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: () => (
    <HierarchicalList defaultExpandedValues={['guides']}>
      <HierarchicalList.Item value="guides">
        Руководства
        <HierarchicalList.Item value="getting-started">Начало работы</HierarchicalList.Item>
        <HierarchicalList.Item value="components">
          Компоненты
          <HierarchicalList.Item value="list">List</HierarchicalList.Item>
          <HierarchicalList.Item value="hierarchical-list">HierarchicalList</HierarchicalList.Item>
        </HierarchicalList.Item>
      </HierarchicalList.Item>
      <HierarchicalList.Item value="about">О проекте</HierarchicalList.Item>
    </HierarchicalList>
  ),
}

export const MultipleSelection: Story = {
  render: () => (
    <HierarchicalList selectionMode="multiple" defaultSelectedKeys={['list', 'about']}>
      <HierarchicalList.Item value="guides">
        Руководства
        <HierarchicalList.Item value="list">List</HierarchicalList.Item>
      </HierarchicalList.Item>
      <HierarchicalList.Item value="about">О проекте</HierarchicalList.Item>
    </HierarchicalList>
  ),
}
