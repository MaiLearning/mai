import type { Meta, StoryObj } from '@storybook/react-vite'
import type { TextColor, TextSize, TextWeight } from '../text/text'
import type { HeadingLevel } from './heading'
import { Heading } from './heading'

const levels: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
const sizes: TextSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const weights: TextWeight[] = ['regular', 'medium', 'semibold', 'bold']
const colors: TextColor[] = [
  'primary',
  'muted',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'danger',
]

/**
 * Heading — заголовок секции дизайн-системы Mai. Композиция поверх `Text`
 * с фиксированным набором уровней `h1..h6`, размером, насыщенностью и
 * цветом из токенов темы.
 */
const meta = {
  title: 'UI/Foundation/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Заголовок секции: семантический уровень `h1..h6`, размер и насыщенность из токенов темы, семантический цвет текста.',
      },
    },
  },
  args: {
    children: 'Заголовок секции',
    as: 'h2',
    size: 'lg',
    weight: 'semibold',
    color: 'primary',
  },
  argTypes: {
    as: { control: 'select', options: levels, description: 'Семантический уровень заголовка.' },
    size: { control: 'select', options: sizes, description: 'Размер шрифта.' },
    weight: { control: 'select', options: weights, description: 'Насыщенность шрифта.' },
    color: { control: 'select', options: colors, description: 'Цвет текста из токенов темы.' },
    children: { control: 'text', description: 'Текст заголовка.' },
  },
} satisfies Meta<typeof Heading>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

/** Семантические уровни заголовков. */
export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 4 }}>
      {levels.map((level) => (
        <Heading key={level} as={level}>
          {`${level} — уровень заголовка`}
        </Heading>
      ))}
    </div>
  ),
}

/** Все размеры шрифта. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 4 }}>
      {sizes.map((size) => (
        <Heading key={size} as="h2" size={size}>
          {`${size} — размер заголовка`}
        </Heading>
      ))}
    </div>
  ),
}

/** Насыщенность шрифта. */
export const Weights: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 4 }}>
      {weights.map((weight) => (
        <Heading key={weight} as="h2" size="lg" weight={weight}>
          {`${weight} — насыщенность`}
        </Heading>
      ))}
    </div>
  ),
}

/** Семантические цвета текста. */
export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 4 }}>
      {colors.map((color) => (
        <Heading key={color} as="h3" size="md" color={color}>
          {`${color} — цвет заголовка`}
        </Heading>
      ))}
    </div>
  ),
}
