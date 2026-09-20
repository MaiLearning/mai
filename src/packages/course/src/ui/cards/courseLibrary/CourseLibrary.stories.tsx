import { I18nProvider, initI18n } from '@mai/i18n'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Course } from '../../../core'
import { courseI18NResources } from '../../../locales'
import { CourseLibrary } from './CourseLibrary'

initI18n({ resources: { course: courseI18NResources } })

const baseCourse: Course = {
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

const courses: Course[] = [
  baseCourse,
  {
    ...baseCourse,
    id: 'course-2',
    name: 'Основы системного дизайна',
    description: 'Как собирать устойчивые и масштабируемые системы.',
    tags: ['Backend', 'Продвинутый'],
    colorFrom: '#0ea5e9',
    colorTo: '#38bdf8',
    status: 'draft',
  },
  {
    ...baseCourse,
    id: 'course-3',
    name: 'Git: командная работа',
    description: 'Ветки, pull request и история, которой можно доверять.',
    tags: ['Инструменты', 'Начальный'],
    colorFrom: '#f59e0b',
    colorTo: '#fb923c',
    status: 'completed',
  },
]

const meta = {
  title: 'Course/Cards/CourseLibrary',
  component: CourseLibrary,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <I18nProvider>
        <div style={{ maxWidth: 960 }}>
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    courses,
    lessonCounts: { 'course-1': 24, 'course-2': 18, 'course-3': 12 },
    onCreateCourse: () => {},
    onEditCourse: () => {},
    onOpenCourse: () => {},
  },
  argTypes: {
    courses: { control: false },
    lessonCounts: { control: false },
    onCreateCourse: { control: false },
    onEditCourse: { control: false },
    onOpenCourse: { control: false },
  },
} satisfies Meta<typeof CourseLibrary>

export default meta
type Story = StoryObj<typeof meta>

/** Библиотека с поиском, переключателем вида и карточкой создания. */
export const Default: Story = {}

/** Пустая библиотека: только карточка создания. */
export const Empty: Story = {
  args: { courses: [], lessonCounts: {} },
}
