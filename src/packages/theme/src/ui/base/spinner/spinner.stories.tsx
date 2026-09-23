import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './spinner'

/**
 * Spinner — индикатор загрузки дизайн-системы Mai. Доступность через
 * `role="status"` и aria-label, который задаётся пропом `label`.
 */
const meta = {
  title: 'Theme/Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Индикатор загрузки. Доступность — через `role="status"` и aria-label из пропа `label`; скорость вращения выбирается из slow/normal/fast.',
      },
    },
  },
  argTypes: {
    label: { description: 'aria-label для скринридеров' },
    speed: {
      control: 'select',
      options: ['slow', 'normal', 'fast'],
      description: 'Скорость вращения',
    },
  },
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

/** Индикатор с подписью по умолчанию («Загрузка»). */
export const Default: Story = {}

/** Своя подпись для контекста — например, сохранение урока. */
export const CustomLabel: Story = {
  args: {
    label: 'Сохранение урока',
  },
}

/** Все скорости рядом — для сравнения. */
export const Speeds: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', fontSize: 32 }}>
      <Spinner speed="slow" label="Медленный" />
      <Spinner speed="normal" label="Обычный" />
      <Spinner speed="fast" label="Быстрый" />
    </div>
  ),
}
