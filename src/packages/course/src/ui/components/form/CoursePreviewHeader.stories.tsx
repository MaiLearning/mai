import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { CoursePreviewHeader } from './CoursePreviewHeader'
import { GRADIENT_PRESETS } from './constants'

/** Градиентный хедер превью карточки — живой предпросмотр названия, статуса и тегов. */
const meta = {
  title: 'Course/Form/CoursePreviewHeader',
  component: CoursePreviewHeader,
  tags: ['autodocs'],
  args: { onClose: fn() },
  argTypes: { values: { control: { disable: true } } },
} satisfies Meta<typeof CoursePreviewHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Превью нового курса — заголовок-заглушка, статус черновик, нет тегов. */
export const NewDraft: Story = {
  args: {
    eyebrow: 'Новый курс',
    onClose: fn(),
    titleId: 'preview-title',
    values: {
      name: '',
      description: '',
      tags: [],
      gradient: GRADIENT_PRESETS[0],
      status: 'draft' as const,
    },
  },
}

/** Превью сохранённого курса с заполненным названием и статусом «В процессе». */
export const InProgress: Story = {
  args: {
    eyebrow: 'Настройки',
    onClose: fn(),
    titleId: 'preview-title',
    values: {
      name: 'Основы программирования',
      description: '',
      tags: ['программирование', 'beginner'],
      gradient: GRADIENT_PRESETS[1],
      status: 'in_progress' as const,
    },
  },
}

/** Завершённый курс с множеством тегов. */
export const CompletedWithManyTags: Story = {
  args: {
    eyebrow: 'Настройки',
    onClose: fn(),
    titleId: 'preview-title',
    values: {
      name: 'Продвинутая математика',
      description: '',
      tags: ['алгебра', 'анализ', 'геометрия', 'топология', 'мат.логика'],
      gradient: GRADIENT_PRESETS[7],
      status: 'completed' as const,
    },
  },
}
