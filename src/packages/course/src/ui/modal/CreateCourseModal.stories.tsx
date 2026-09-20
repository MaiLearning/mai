import { I18nProvider, initI18n } from '@mai/i18n'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { courseI18NResources } from '../../locales'
import { CreateCourseModal } from './CreateCourseModal'

initI18n({ resources: { course: courseI18NResources } })

const meta = {
  title: 'Course/Modal/CreateCourseModal',
  component: CreateCourseModal,
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
    onClose: () => {},
    onCreated: () => {},
  },
  argTypes: {
    opened: { control: false },
    onClose: { control: false },
    onCreated: { control: false },
  },
} satisfies Meta<typeof CreateCourseModal>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Модалка создания курса: живое превью карточки + поля формы.
 * Создание не выполняется — рендер для проверки вёрстки.
 */
export const Default: Story = {}
