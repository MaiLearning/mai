import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import type { SettingsField as SettingsFieldModel } from '../../core'
import { SettingsFieldRenderer } from './SettingsFieldRenderer'

const themeField: SettingsFieldModel = {
  type: 'single_selection',
  params: { options: ['system', 'light', 'dark'] },
  default: 'system',
  value: 'system',
}

const themeLabels: Record<string, string> = {
  system: 'Системная',
  light: 'Светлая',
  dark: 'Тёмная',
}

const meta = {
  title: 'Settings/Field/SettingsFieldRenderer',
  component: SettingsFieldRenderer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    fieldKey: 'theme',
    field: themeField,
    label: 'Тема оформления',
    hint: 'Системная тема следует за оформлением ОС.',
    labels: themeLabels,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    field: { control: 'object' },
    labels: { control: 'object' },
    onChange: { control: false },
  },
} satisfies Meta<typeof SettingsFieldRenderer>

export default meta

type Story = StoryObj<typeof meta>

/** Одиночный выбор (мало вариантов) — сегментированный переключатель. */
export const SingleSelection: Story = {}

/** Одиночный выбор (много вариантов) — выпадающий список. */
export const SingleSelectionSelect: Story = {
  args: {
    fieldKey: 'mode',
    field: {
      type: 'single_selection',
      params: { options: ['a', 'b', 'c', 'd', 'e'] },
      value: 'b',
    },
    label: 'Режим',
    hint: undefined,
    labels: {},
  },
}

/** Множественный выбор — группа чекбоксов. */
export const MultiSelection: Story = {
  args: {
    fieldKey: 'formats',
    field: {
      type: 'multi_selection',
      params: { options: ['theory', 'practice', 'video'] },
      value: ['theory'],
    },
    label: 'Форматы',
    hint: 'Можно выбрать несколько.',
    labels: { theory: 'Теория', practice: 'Практика', video: 'Видео' },
  },
}

/** Переключатель on/off. */
export const Toggle: Story = {
  args: {
    fieldKey: 'autoSave',
    field: { type: 'toggle', value: true },
    label: 'Автосохранение',
    hint: undefined,
    labels: undefined,
  },
}

/** Ввод текста. */
export const Text: Story = {
  args: {
    fieldKey: 'name',
    field: { type: 'text_input', value: 'Название', params: { maxLength: 120 } },
    label: 'Название',
    hint: undefined,
    labels: undefined,
  },
}

/** Ссылка. */
export const Url: Story = {
  args: {
    fieldKey: 'homepage',
    field: { type: 'url_input', value: 'https://mai.dev', params: {} },
    label: 'Домашняя страница',
    hint: undefined,
    labels: undefined,
  },
}

/** Дата (ISO-8601). */
export const Date: Story = {
  args: {
    fieldKey: 'deadline',
    field: { type: 'date_input', value: '2026-09-21', params: {} },
    label: 'Дедлайн',
    hint: undefined,
    labels: undefined,
  },
}

/** Состояние ошибки перекрывает пояснение. */
export const WithError: Story = {
  args: {
    error: 'Значение не прошло валидацию',
  },
}

/** Все типы полей подряд. */
export const AllTypes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <SettingsFieldRenderer {...args} />
      <SettingsFieldRenderer
        {...args}
        fieldKey="formats"
        field={{
          type: 'multi_selection',
          params: { options: ['theory', 'practice'] },
          value: ['theory'],
        }}
        label="Форматы"
        hint="Можно несколько."
        labels={{ theory: 'Теория', practice: 'Практика' }}
      />
      <SettingsFieldRenderer
        {...args}
        fieldKey="autoSave"
        field={{ type: 'toggle', value: true }}
        label="Автосохранение"
        hint={undefined}
        labels={undefined}
      />
      <SettingsFieldRenderer
        {...args}
        fieldKey="homepage"
        field={{ type: 'url_input', value: 'https://mai.dev', params: {} }}
        label="Домашняя страница"
        hint={undefined}
        labels={undefined}
      />
      <SettingsFieldRenderer
        {...args}
        fieldKey="deadline"
        field={{ type: 'date_input', value: '2026-09-21', params: {} }}
        label="Дедлайн"
        hint={undefined}
        labels={undefined}
      />
    </div>
  ),
}
