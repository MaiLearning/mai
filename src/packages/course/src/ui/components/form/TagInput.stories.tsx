import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TagInput } from './TagInput'

/** Ввод тегов с чипами, удалением и подсказками автодополнения. */
const meta = {
  title: 'Course/Form/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  args: { onChange: fn() },
  argTypes: {
    suggestions: { control: { disable: true } },
    value: { control: { disable: true } },
  },
} satisfies Meta<typeof TagInput>

export default meta
type Story = StoryObj<typeof meta>

/** Пустое поле ввода тегов без подсказок. */
export const Empty: Story = {
  args: { value: [] },
}

/** Несколько добавленных тегов без подсказок. */
export const WithTags: Story = {
  args: { value: ['Математика', 'Физика', 'Алгебра'] },
}

/** Поле с доступными подсказками для быстрого добавления. */
export const WithSuggestions: Story = {
  args: {
    value: ['Математика'],
    suggestions: ['Физика', 'Химия', 'Биология', 'Информатика'],
  },
}

/** Чистый список подсказок при пустом вводе. */
export const SuggestionsEmptyValue: Story = {
  args: {
    value: [],
    suggestions: ['История', 'Литература', 'География', 'Экономика'],
  },
}
