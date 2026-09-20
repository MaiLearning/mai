import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { CourseStatus } from '../../../core'
import { StatusPicker } from './StatusPicker'

/** Выбор статуса курса радио-карточками с иконками и подсказками. */
const meta = {
  title: 'Course/Form/StatusPicker',
  component: StatusPicker,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    value: { control: { type: 'radio', options: ['draft', 'in_progress', 'completed'] } },
  },
} satisfies Meta<typeof StatusPicker>

export default meta
type Story = StoryObj<typeof meta>

/** Черновик — статус по умолчанию, нейтральный внешний вид. */
export const Draft: Story = {
  args: {
    value: 'draft' as CourseStatus,
    options: [
      { value: 'draft' as CourseStatus, label: 'Черновик', hint: 'Курс ещё не опубликован' },
      { value: 'in_progress' as CourseStatus, label: 'В процессе', hint: 'Добавляются материалы' },
      { value: 'completed' as CourseStatus, label: 'Завершён', hint: 'Все материалы добавлены' },
    ],
  },
}

/** В процессе — жёлтый акцент на активном статусе. */
export const InProgress: Story = {
  args: {
    value: 'in_progress' as CourseStatus,
    options: [
      { value: 'draft' as CourseStatus, label: 'Черновик', hint: 'Курс ещё не опубликован' },
      { value: 'in_progress' as CourseStatus, label: 'В процессе', hint: 'Добавляются материалы' },
      { value: 'completed' as CourseStatus, label: 'Завершён', hint: 'Все материалы добавлены' },
    ],
  },
}

/** Завершён — зелёный акцент на активном статусе. */
export const Completed: Story = {
  args: {
    value: 'completed' as CourseStatus,
    options: [
      { value: 'draft' as CourseStatus, label: 'Черновик', hint: 'Курс ещё не опубликован' },
      { value: 'in_progress' as CourseStatus, label: 'В процессе', hint: 'Добавляются материалы' },
      { value: 'completed' as CourseStatus, label: 'Завершён', hint: 'Все материалы добавлены' },
    ],
  },
}
