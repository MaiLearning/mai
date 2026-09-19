import type { Meta, StoryObj } from '@storybook/react-vite'
import { HomeIcon } from './HomeIcon'

/** Иконки карточки курса — набор SVG-символов для визуализации категорий. */
const meta = {
  title: 'Course/UI/HomeIcon',
  component: HomeIcon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    name: {
      control: {
        type: 'select',
        options: [
          'arrow',
          'book',
          'clock',
          'compass',
          'flame',
          'layers',
          'pen',
          'plus',
          'settings',
          'spark',
        ],
      },
    },
    size: { control: { type: 'range', min: 10, max: 32, step: 1 } },
  },
} satisfies Meta<typeof HomeIcon>

export default meta
type Story = StoryObj<typeof meta>

/** Стандартный размер (18px). */
export const Default: Story = {
  args: { name: 'book' },
}

/** Все доступные символы иконок. */
export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {(
        [
          'arrow',
          'book',
          'clock',
          'compass',
          'flame',
          'layers',
          'pen',
          'plus',
          'settings',
          'spark',
        ] as const
      ).map((name) => (
        <div key={name} style={{ textAlign: 'center' }}>
          <HomeIcon name={name} />
          <span style={{ display: 'block', fontSize: 10, color: '#999', marginTop: 4 }}>
            {name}
          </span>
        </div>
      ))}
    </div>
  ),
  args: {
    name: 'book',
    size: 19,
  },
}

/** Размеры от мелкого до крупного. */
export const Sizes: Story = {
  args: { name: 'book' },
  render: (args) => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {[10, 14, 18, 24, 32].map((size) => (
        <HomeIcon {...args} key={size} size={size} />
      ))}
    </div>
  ),
}
