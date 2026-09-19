import { I18nProvider, initI18n } from '@mai/i18n'
import { ThemeProvider } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import type { Course } from '../../../core'
import { courseI18NResources } from '../../../locales'
import { CourseGridCard } from './CourseGridCard'

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
  title: 'Course/UI/CourseGridCard',
  component: CourseGridCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <I18nProvider>
          <div style={{ maxWidth: 360 }}>
            <Story />
          </div>
        </I18nProvider>
      </ThemeProvider>
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    course: baseCourse,
    lessons: 24,
    onEdit: () => {},
    onOpen: () => {},
  },
  argTypes: {
    course: { control: false },
    onEdit: { control: false },
    onOpen: { control: false },
  },
} satisfies Meta<typeof CourseGridCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Все статусы: черновик, в процессе, завершён. */
export const Statuses: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <CourseGridCard {...args} course={{ ...baseCourse, status: 'draft' }} />
      <CourseGridCard {...args} course={{ ...baseCourse, status: 'in_progress' }} />
      <CourseGridCard {...args} course={{ ...baseCourse, status: 'completed' }} />
    </div>
  ),
}

/** Со строкой длительности. */
export const WithDuration: Story = {
  args: { durationLabel: '6 ч 40 мин' },
}

/** Без описания и счётчика уроков. */
export const Minimal: Story = {
  args: {
    course: { ...baseCourse, description: null, tags: [] },
    lessons: undefined,
  },
}
