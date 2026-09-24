import { Button, Card, Flex, Text } from '@mai/theme'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { SettingsSection } from './SettingsSection'

const meta = {
  title: 'Settings/Layout/SettingsSection',
  component: SettingsSection,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    title: 'Общие',
    description: 'Внешний вид и язык интерфейса приложения.',
    children: (
      <Card>
        <Flex direction="column" gap="sm">
          <Text size="sm">Тема оформления</Text>
          <Text size="sm" color="gray">
            Язык интерфейса
          </Text>
        </Flex>
      </Card>
    ),
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof SettingsSection>

export default meta

type Story = StoryObj<typeof meta>

/** Заголовок, пояснение и содержимое. */
export const Default: Story = {}

/** Без заголовка — только содержимое. */
export const WithoutHead: Story = {
  args: { title: undefined, description: undefined },
}

/** С кнопкой действия в содержимом. */
export const WithContent: Story = {
  args: {
    children: <Button variant="secondary">Действие</Button>,
  },
}
