import type { Meta, StoryObj } from '@storybook/react-vite'
import { SystemSettingsPanel } from './SystemSettingsPanel'

const meta = {
  title: 'Settings/System/SystemSettingsPanel',
  component: SystemSettingsPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SystemSettingsPanel>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Системные настройки «Общие», подключённые к стору @mai/settings.
 * В Storybook активен fake-режим: чтение и сохранение идут в fake-состояние.
 */
export const Default: Story = {}
