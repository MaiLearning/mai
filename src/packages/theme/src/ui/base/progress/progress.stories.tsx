import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

/**
 * Progress — индикатор выполнения дизайн-системы Mai. Ширина заливки
 * задаётся пропом `percent` (0–100) и строится из токенов темы.
 */
const meta = {
  title: 'Theme/Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    percent: 50,
    'aria-label': 'Загрузка курса',
  },
  argTypes: {
    percent: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
      description: 'Процент выполнения. Значение ограничивается диапазоном 0–100.',
    },
    'aria-label': {
      control: 'text',
      description: 'Доступное имя индикатора прогресса.',
    },
  },
} satisfies Meta<typeof Progress>

export default meta

type Story = StoryObj<typeof meta>

/** Половина выполнения. */
export const Half: Story = {}

/** Начало выполнения. */
export const Start: Story = {
  args: {
    percent: 5,
  },
}

/** Значение у края — заливка на всю ширину трека. */
export const Complete: Story = {
  args: {
    percent: 100,
  },
}

/** Ряд значений — для сравнения шкалы. */
export const Values: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12, width: 420 }}>
      <Progress {...args} percent={0} />
      <Progress {...args} percent={25} />
      <Progress {...args} percent={50} />
      <Progress {...args} percent={75} />
      <Progress {...args} percent={100} />
    </div>
  ),
}
