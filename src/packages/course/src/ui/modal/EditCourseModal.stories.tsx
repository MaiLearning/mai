import { I18nProvider, initI18n } from '@mai/i18n'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Course } from '../../core'
import { courseI18NResources } from '../../locales'
import { EditCourseModal } from './EditCourseModal'

initI18n({ resources: { course: courseI18NResources } })

const course: Course = {
  id: 'course-1',
  name: 'TypeScript для React-разработчика',
  description: 'Типизация компонентов, хуков и API без лишней магии.',
  tags: ['Frontend', 'Средний'],
  colorFrom: '#6a54ff',
  colorTo: '#9d7bff',
  status: 'in_progress',
  createdAt: 0,
  updatedAt: 0,
}

const meta = {
  title: 'Course/Modal/EditCourseModal',
  component: EditCourseModal,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <I18nProvider>
        <Story />
      </I18nProvider>
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    opened: true,
    course,
    onClose: () => {},
    onSaved: () => {},
    onDeleted: () => {},
  },
  argTypes: {
    opened: { control: false },
    course: { control: false },
    onClose: { control: false },
    onSaved: { control: false },
    onDeleted: { control: false },
  },
} satisfies Meta<typeof EditCourseModal>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Модалка настроек курса: редактирование полей, зона удаления
 * и несохранённые изменения (без dirty-состояния — чистый рендер).
 */
export const Default: Story = {}
