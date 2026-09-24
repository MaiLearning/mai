import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from './text'

/**
 * Текстовый примитив дизайн-системы Mai. Единственная точка стилизации
 * текста через токены темы: размеры, насыщенность, семантические цвета
 * и межстрочные интервалы. Через `as` закрывает заголовки и абзацы
 * без отдельных компонентов.
 */
const meta = {
  title: 'UI/Foundation/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Текстовый примитив: размеры, насыщенность, семантические цвета и межстрочные интервалы из токенов темы. Через `as` закрывает заголовки и абзацы без отдельных компонентов, `ellipsis` — одна строка с многоточием.',
      },
    },
  },
  args: {
    children: 'Текст дизайн-системы Mai',
  },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

/** Базовое применение: текстовый абзац (as="p", размер по умолчанию). */
export const Default: Story = {
  args: {
    as: 'p',
  },
}

/** Заголовки всех уровней через `as` — без отдельных компонентов. */
export const Headings: Story = {
  args: {
    as: 'h2',
    size: 'xl',
    weight: 'bold',
    children: 'Заголовок',
  },
}

/** Семантические цвета текста из токенов темы. */
export const Colors: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Text {...args} color="primary">
        primary — основной текст
      </Text>
      <Text {...args} color="muted">
        muted — вторичный текст
      </Text>
      <Text {...args} color="danger">
        danger — ошибка/опасность
      </Text>
      <Text {...args} color="success">
        success — успех
      </Text>
      <Text {...args} color="warning">
        warning — предупреждение
      </Text>
      <Text {...args} color="info">
        info — информация
      </Text>
      <Text {...args} color="#8b91a3">
        произвольный CSS-цвет
      </Text>
    </div>
  ),
}

/** Все размеры шрифта. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Text key={size} {...args} size={size}>
          {size} — размер шрифта
        </Text>
      ))}
    </div>
  ),
}

/** Насыщенность шрифта. */
export const Weights: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['regular', 'medium', 'semibold', 'bold'] as const).map((weight) => (
        <Text key={weight} {...args} weight={weight}>
          {weight} — насыщенность
        </Text>
      ))}
    </div>
  ),
}

/** Межстрочные интервалы. */
export const LineHeights: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      {(['tight', 'normal', 'relaxed'] as const).map((lineHeight) => (
        <Text key={lineHeight} {...args} lineHeight={lineHeight}>
          {lineHeight} — межстрочный интервал. Текст, который переносится на несколько строк, чтобы
          интервал был виден.
        </Text>
      ))}
    </div>
  ),
}

/** Одна строка с многоточием при нехватке места. */
export const Ellipsis: Story = {
  render: (args) => (
    <div style={{ width: 200 }}>
      <Text {...args} ellipsis>
        Очень длинный текст, который обрезается по ширине контейнера и заканчивается многоточием.
      </Text>
    </div>
  ),
}
