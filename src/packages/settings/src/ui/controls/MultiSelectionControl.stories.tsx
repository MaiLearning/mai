import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { MultiSelectionControl } from './MultiSelectionControl'

const options = ['theory', 'practice', 'video', 'quiz']

const labels: Record<string, string> = {
  theory: 'Теория',
  practice: 'Практика',
  video: 'Видео',
  quiz: 'Тест',
}

function Demo() {
  const [value, setValue] = useState<string[]>(['theory'])

  return (
    <MultiSelectionControl value={value} onChange={setValue} options={options} labels={labels} />
  )
}

const meta = {
  title: 'Settings/Controls/MultiSelectionControl',
  component: MultiSelectionControl,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    value: ['theory'],
    onChange: fn(),
    options,
    labels,
    disabled: false,
  },
  argTypes: {
    value: { control: 'object' },
    options: { control: 'object' },
    labels: { control: 'object' },
    onChange: { control: false },
  },
} satisfies Meta<typeof MultiSelectionControl>

export default meta

type Story = StoryObj<typeof meta>

/** Несколько выбранных значений. */
export const Default: Story = {}

/** Ничего не выбрано. */
export const Empty: Story = {
  args: { value: [] },
}

/** Пустой список вариантов — пояснение вместо контрола. */
export const NoOptions: Story = {
  args: { value: [], options: [], labels: {} },
}

/** Отключённый контрол. */
export const Disabled: Story = {
  args: { disabled: true },
}

/** Живой пример: отметки переключаются. */
export const Interactive: Story = {
  render: () => <Demo />,
}
