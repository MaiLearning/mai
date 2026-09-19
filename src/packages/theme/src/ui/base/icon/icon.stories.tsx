import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './icon'

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    </svg>
  )
}

const meta = {
  title: 'Design/Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Контейнер для иконок с единым размером и выравниванием. Поддерживает размеры от xs до xl и масштабирует вложенный SVG.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Размер контейнера иконки.',
    },
    children: {
      control: false,
      description: 'SVG или другой визуальный контент иконки.',
    },
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  args: {
    children: <StarIcon />,
    size: 'md',
    'aria-label': 'Избранное',
  },
}

export const Sizes: Story = {
  args: {
    children: <StarIcon />,
  },
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Icon size="xs">
        <StarIcon />
      </Icon>
      <Icon size="sm">
        <StarIcon />
      </Icon>
      <Icon size="md">
        <StarIcon />
      </Icon>
      <Icon size="lg">
        <StarIcon />
      </Icon>
      <Icon size="xl">
        <StarIcon />
      </Icon>
    </div>
  ),
}
