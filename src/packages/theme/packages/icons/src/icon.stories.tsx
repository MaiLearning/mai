import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './icon'
import type { IconName } from './registry'
import { iconRegistry } from './registry'

const meta = {
  title: 'Theme/Packages/Icons/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Системная иконка: контейнер с фиксированным размером и выбором глифа из каталога по имени.',
      },
    },
  },
  argTypes: {
    name: {
      control: 'select',
      options: Object.keys(iconRegistry),
      description: 'Имя иконки из каталога.',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер бокса иконки.',
    },
    children: {
      control: false,
      description: 'Собственный SVG вместо иконки из каталога.',
    },
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    name: 'check',
    size: 'md',
  },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon name="check" size="xs" />
      <Icon name="check" size="sm" />
      <Icon name="check" size="md" />
      <Icon name="check" size="lg" />
      <Icon name="check" size="xl" />
    </div>
  ),
}

export const Catalog: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        gap: 16,
        padding: 24,
      }}
    >
      {(Object.keys(iconRegistry) as IconName[]).map((name) => (
        <div
          key={name}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
        >
          <Icon name={name} size="lg" />
          <span style={{ fontSize: 12 }}>{name}</span>
        </div>
      ))}
    </div>
  ),
}
