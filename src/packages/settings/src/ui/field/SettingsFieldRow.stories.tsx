import { Button } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsFieldRow } from './SettingsFieldRow'

const meta = {
  title: 'Settings/Field/SettingsFieldRow',
  component: SettingsFieldRow,
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
    label: 'Название поля',
    hint: 'Пояснение под контролом.',
    children: <Button variant="secondary">Контрол</Button>,
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof SettingsFieldRow>

export default meta

type Story = StoryObj<typeof meta>

/** Подпись, контрол и пояснение. */
export const Default: Story = {}

/** Без пояснения. */
export const WithoutHint: Story = {
  args: { hint: undefined },
}

/** Ошибка вместо пояснения. */
export const WithError: Story = {
  args: { error: 'Обязательное поле' },
}
