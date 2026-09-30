import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './divider'

/**
 * Divider — тонкая линия-разделитель в нейтральном цвете границы темы.
 * Горизонтальный растягивается по ширине контейнера, вертикальный — по
 * высоте строки/ряда.
 */
const meta = {
  title: 'Theme/Components/Foundation/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Разделитель между группами контента. Горизонтальный — линия во всю ширину контейнера, вертикальный (`vertical`) — по высоте ряда.',
      },
    },
  },
  args: {
    vertical: false,
  },
  argTypes: {
    vertical: {
      control: 'boolean',
      description: 'Вертикальная ориентация: линия растягивается по высоте контейнера.',
    },
  },
} satisfies Meta<typeof Divider>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Горизонтальные разделители между блоками. */
export const Horizontal: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <span>Первый блок</span>
      <Divider />
      <span>Второй блок</span>
      <Divider />
      <span>Третий блок</span>
    </div>
  ),
}

/** Вертикальный разделитель в ряду элементов. */
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 32 }}>
      <span>Левый</span>
      <Divider vertical />
      <span>Центр</span>
      <Divider vertical />
      <span>Правый</span>
    </div>
  ),
}
