import { I18nProvider, initI18n } from '@mai/i18n'
import { ThemeProvider } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Course } from '../../../core'
import { courseI18NResources } from '../../../locales'
import { FeaturedCourseCard } from './FeaturedCourseCard'

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

const meta = {
  title: 'Course/UI/FeaturedCourseCard',
  component: FeaturedCourseCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <I18nProvider>
          <div style={{ maxWidth: 720 }}>
            <Story />
          </div>
        </I18nProvider>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    course: baseCourse,
    lessonsTotal: 24,
    // TODO: моки прогресса — убрать, когда появятся реальные данные
    currentLessonTitle: 'Урок 16: Generic constraints',
    currentLessonIndex: 16,
    lastOpenedLabel: 'Открывали сегодня в 10:42',
    onOpen: () => {},
    onEdit: () => {},
  },
  argTypes: {
    course: { control: false },
    onOpen: { control: false },
    onEdit: { control: false },
  },
} satisfies Meta<typeof FeaturedCourseCard>

export default meta
type Story = StoryObj<typeof meta>

/** Полностью заполненный hero — как в референсе. */
export const Default: Story = {}

/** Без данных прогресса: название курса, без счётчика и времени открытия. */
export const NoProgress: Story = {
  args: {
    currentLessonTitle: undefined,
    currentLessonIndex: undefined,
    lastOpenedLabel: undefined,
    lessonsTotal: undefined,
  },
}
