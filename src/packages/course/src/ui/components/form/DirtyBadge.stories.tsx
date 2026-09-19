import type { Meta, StoryObj } from '@storybook/react-vite'
import { DirtyBadge } from './FormFeedback'

/** Бейдж несохранённых изменений в футере окна редактирования. */
const meta = {
  title: 'Course/UI/DirtyBadge',
  component: DirtyBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DirtyBadge>

export default meta
type Story = StoryObj<typeof meta>

/** Статичное отображение бейджа с уведомлением о несохранённых изменениях. */
export const Default: Story = {}
