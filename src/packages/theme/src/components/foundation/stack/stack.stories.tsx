import type { Meta, StoryObj } from '@storybook/react-vite'
import type { SpacingKey } from '../../../base/theme'
import { Stack } from './stack'

const gapKeys: SpacingKey[] = ['xs', 'sm', 'md', 'lg', 'xl']

/**
 * Stack — foundation-контейнер для вертикального или горизонтального
 * расположения элементов. Ось задаётся `direction`, отступ между
 * элементами — `gap` (ключ каталога `theme.spacing` или число шагов),
 * выравнивание по поперечной оси — `align`.
 */
const meta = {
  title: 'UI/Foundation/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Базовый контейнер раскладки: вертикальное (column) или горизонтальное (row) расположение элементов с управляемым зазором.',
      },
    },
  },
  args: {
    gap: 'md',
    direction: 'vertical',
    children: null,
  },
  argTypes: {
    direction: {
      control: 'inline-radio',
      options: ['vertical', 'horizontal'],
      description: 'Ось раскладки элементов.',
    },
    gap: { control: 'select', options: gapKeys, description: 'Отступ между элементами.' },
    align: {
      control: 'select',
      options: ['flex-start', 'center', 'flex-end', 'stretch', 'baseline'],
      description: 'Выравнивание по поперечной оси.',
    },
    children: {
      control: false,
      description: 'Элементы внутри контейнера. Для демонстрации задаются в стори.',
    },
  },
} satisfies Meta<typeof Stack>

export default meta

type Story = StoryObj<typeof meta>

const block = (label: string) => (
  <div style={{ padding: '8px 16px', border: '1px solid currentColor', borderRadius: 8 }}>
    {label}
  </div>
)

export const Playground: Story = {
  render: (args) => (
    <Stack {...args} style={{ maxWidth: 300 }}>
      {block('A')}
      {block('B')}
      {block('C')}
    </Stack>
  ),
}

/** Обе оси раскладки. */
export const Directions: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Stack gap="md" style={{ maxWidth: 300 }}>
        {block('vertical A')}
        {block('B')}
        {block('C')}
      </Stack>
      <Stack direction="horizontal" gap="md">
        {block('horizontal A')}
        {block('B')}
        {block('C')}
      </Stack>
    </div>
  ),
}

/** Зазор ключом каталога и числом базовых шагов. */
export const Gap: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Stack gap="sm" style={{ maxWidth: 300 }}>
        {block('токен sm')}
        {block('B')}
      </Stack>
      <Stack gap="lg" style={{ maxWidth: 300 }}>
        {block('токен lg')}
        {block('B')}
      </Stack>
      <Stack gap={12} style={{ maxWidth: 300 }}>
        {block('12 шагов = 1.5rem')}
        {block('B')}
      </Stack>
    </div>
  ),
}

/** Выравнивание по поперечной оси. */
export const Align: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Stack
        direction="horizontal"
        align="flex-start"
        gap="md"
        style={{ height: 80, borderBottom: '1px dashed currentColor' }}
      >
        {block('flex-start')}
        {block('B')}
      </Stack>
      <Stack
        direction="horizontal"
        align="center"
        gap="md"
        style={{ height: 80, borderBottom: '1px dashed currentColor' }}
      >
        {block('center')}
        {block('B')}
      </Stack>
    </div>
  ),
}
