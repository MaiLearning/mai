import { I18nProvider, initI18n } from '@mai/i18n'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { courseI18NResources } from '../../../locales'
import { CourseCover } from './CourseCover'

initI18n({ resources: { course: courseI18NResources } })

const meta = {
  title: 'Course/Cards/CourseCover',
  component: CourseCover,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <I18nProvider>
        <div style={{ maxWidth: 640, containerType: 'inline-size', containerName: 'course-card' }}>
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
  parameters: { layout: 'padded' },
  args: {
    colorFrom: '#6a54ff',
    colorTo: '#9d7bff',
    tags: ['Frontend', 'Средний'],
    editLabel: 'Настройки курса',
    onEdit: () => {},
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'lg'] },
    onEdit: { control: false },
    overlay: { control: false },
  },
} satisfies Meta<typeof CourseCover>

export default meta
type Story = StoryObj<typeof meta>

/** Компактная обложка для сетки. */
export const Small: Story = {}

/** Крупная обложка hero с оверлеем названия. */
export const Large: Story = {
  args: {
    size: 'lg',
    overlay: { eyebrow: 'Продолжить обучение', title: 'TypeScript для React-разработчика' },
  },
}

/** Без тегов. */
export const NoTags: Story = {
  args: { tags: [] },
}
