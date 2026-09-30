import type { Meta, StoryObj } from '@storybook/react-vite'
import { Grid } from '../grid/grid'
import type { ContainerSize } from './container'
import { Container } from './container'

const sizes: ContainerSize[] = ['narrow', 'read', 'code', 'wide']

/** Подложка, на которой виден потолок ширины. */
const backdrop = { background: 'color-mix(in srgb, currentColor 8%, transparent)' } as const

/**
 * Container — центрированная область ограниченной ширины. Потолок
 * берётся из шкалы `layout.containerWidths`, горизонтальные отступы
 * растут вместе с контейнером.
 */
const meta = {
  title: 'UI/Foundation/Container',
  component: Container,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Центрированная область с потолком ширины. Отступы горизонтальные и адаптивные: считаются контейрным запросом от самого контейнера, поэтому правило прописано один раз. `fluid` снимает потолок, оставляя отступы.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: sizes,
      description: 'Потолок ширины из шкалы `theme.layout.containerWidths`.',
    },
    fluid: {
      control: 'boolean',
      description: 'Снять потолок ширины: контейнер занимает всю ширину родителя.',
    },
    as: {
      control: 'select',
      options: ['div', 'main', 'section', 'article', 'aside'],
      description: 'Семантический тег внешнего слоя.',
    },
    children: { control: false, description: 'Содержимое области.' },
  },
} satisfies Meta<typeof Container>

export default meta

type Story = StoryObj<typeof meta>

/** Контейнер с содержимым. */
export const Playground: Story = {
  args: {
    size: 'read',
    fluid: false,
    children: 'Содержимое центрированной области.',
  },
  render: (args) => (
    <div style={{ background: 'color-mix(in srgb, currentColor 8%, transparent)' }}>
      <Container {...args} />
    </div>
  ),
}

/** Все ступени шкалы ширин: потолок виден по краям подложки. */
export const Sizes: Story = {
  render: () => (
    <Grid gap="lg" style={backdrop}>
      {sizes.map((size) => (
        <Container key={size} size={size} style={{ outline: '1px dashed currentColor' }}>
          {size}
        </Container>
      ))}
    </Grid>
  ),
}

/** `fluid` снимает потолок, но сохраняет горизонтальные отступы. */
export const Fluid: Story = {
  render: () => (
    <Grid gap="lg" style={backdrop}>
      <Container size="narrow" style={{ outline: '1px dashed currentColor' }}>
        size="narrow" — потолок 400px
      </Container>
      <Container size="narrow" fluid style={{ outline: '1px dashed currentColor' }}>
        size="narrow" fluid — во всю ширину родителя
      </Container>
    </Grid>
  ),
}

/**
 * Поля растут по ширине контейнера: 1rem → 1.5rem → 3rem.
 * Слева узкая ступень, справа широкая — при разной ширине контейнера
 * внутренние поля различаются.
 */
export const ResponsiveGutters: Story = {
  render: () => (
    <Grid columns="300px 1fr" gap="lg">
      <Container size="narrow" style={backdrop}>
        Узкий контейнер (400px): поля 1rem — 8 шагов.
      </Container>
      <Container size="wide" style={backdrop}>
        Широкий контейнер: поля 3rem — 24 шага, потому что он шире 64rem.
      </Container>
    </Grid>
  ),
}

/** Семантический тег внешнего слоя. */
export const SemanticTag: Story = {
  args: {
    as: 'main',
    size: 'read',
    children: 'Контейнер отрисован как <main>.',
  },
}
