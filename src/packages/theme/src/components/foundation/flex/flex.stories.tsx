import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SpacingKey } from '../../../base/theme'
import type { FlexAlign, FlexDirection, FlexJustify, FlexWrap } from './flex'
import { Flex } from './flex'

const directions: FlexDirection[] = ['row', 'column', 'row-reverse', 'column-reverse']
const justifications: FlexJustify[] = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
]
const alignments: FlexAlign[] = ['flex-start', 'center', 'flex-end', 'stretch', 'baseline']
const wraps: FlexWrap[] = ['nowrap', 'wrap', 'wrap-reverse']
const gapKeys: SpacingKey[] = ['xs', 'sm', 'md', 'lg', 'xl']

/**
 * Flex — контейнер раскладки дизайн-системы Mai. Направление,
 * выравнивание, перенос и зазор задаются пропсами; отступ маппится
 * на токены `theme.spacing` (ключ) или принимает px-число.
 */
const meta = {
  title: 'UI/Foundation/Flex',
  component: Flex,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Flex-контейнер для раскладки: направление, выравнивание, перенос и зазор между элементами. `gap` принимает ключ токена темы (`sm`, `md`, …) или число пикселей.',
      },
    },
  },
  args: {
    gap: 'md',
    direction: 'row',
    align: 'center',
    justify: 'flex-start',
    children: null,
  },
  argTypes: {
    direction: { control: 'select', options: directions, description: 'Направление раскладки.' },
    align: {
      control: 'select',
      options: alignments,
      description: 'Выравнивание по поперечной оси.',
    },
    justify: {
      control: 'select',
      options: justifications,
      description: 'Распределение по главной оси.',
    },
    wrap: { control: 'select', options: wraps, description: 'Перенос элементов на новые строки.' },
    gap: { control: 'select', options: gapKeys, description: 'Отступ между элементами.' },
    children: {
      control: false,
      description: 'Элементы внутри контейнера. Для демонстрации задаются в стори.',
    },
  },
} satisfies Meta<typeof Flex>

export default meta

type Story = StoryObj<typeof meta>

const block = (label: string) => (
  <div style={{ padding: '8px 16px', border: '1px solid currentColor', borderRadius: 8 }}>
    {label}
  </div>
)

export const Playground: Story = {
  render: (args) => (
    <Flex {...args} style={{ flex: 1 }}>
      {block('A')}
      {block('B')}
      {block('C')}
    </Flex>
  ),
}

/** Все направления раскладки. */
export const Directions: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {directions.map((direction) => (
        <Flex key={direction} direction={direction} gap="md" align="center">
          {block(direction)}
          {block('B')}
          {block('C')}
        </Flex>
      ))}
    </div>
  ),
}

/** Распределение по главной оси. */
export const Justify: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {justifications.map((justify) => (
        <Flex
          key={justify}
          gap="sm"
          justify={justify}
          style={{ borderBottom: '1px dashed currentColor' }}
        >
          {block('A')}
          {block('B')}
          {block('C')}
        </Flex>
      ))}
    </div>
  ),
}

/** Выравнивание по поперечной оси. */
export const Align: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {alignments.map((align) => (
        <Flex
          key={align}
          gap="sm"
          align={align}
          style={{ height: 80, border: '1px dashed currentColor' }}
        >
          {block('A')}
          {block('B')}
          {block('C')}
        </Flex>
      ))}
    </div>
  ),
}

/** Перенос элементов при нехватке ширины. */
export const Wrap: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {wraps.map((wrap) => (
        <Flex key={wrap} wrap={wrap} gap="sm" style={{ maxWidth: 320 }}>
          {block('A')}
          {block('B')}
          {block('C')}
          {block('D')}
          {block('E')}
        </Flex>
      ))}
    </div>
  ),
}

/** Зазор ключом токена и числом пикселей. */
export const Gap: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Flex gap="sm">
        {block('токен sm')}
        {block('B')}
      </Flex>
      <Flex gap="lg">
        {block('токен lg')}
        {block('B')}
      </Flex>
      <Flex gap={24}>
        {block('24px')}
        {block('B')}
      </Flex>
    </div>
  ),
}
