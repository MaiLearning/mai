import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { DangerPlate } from './DangerPlate'

/** Опасная зона редактирования — двухэтапное удаление курса. */
const meta = {
  title: 'Course/UI/DangerPlate',
  component: DangerPlate,
  tags: ['autodocs'],
  args: { onArm: fn(), onDisarm: fn(), onDelete: fn() },
} satisfies Meta<typeof DangerPlate>

export default meta
type Story = StoryObj<typeof meta>

/** Обычный режим — кнопка удаления. */
export const Disarmed: Story = {
  args: {
    armed: false,
    busy: false,
    courseName: 'Математический анализ',
  },
}

/** Режим подтверждения — предупреждение с двумя кнопками. */
export const Armed: Story = {
  args: {
    armed: true,
    busy: false,
    courseName: 'Математический анализ',
  },
}

/** Удаление выполняется — кнопки заблокированы. */
export const Deleting: Story = {
  args: {
    armed: true,
    busy: true,
    courseName: 'Математический анализ',
  },
}
