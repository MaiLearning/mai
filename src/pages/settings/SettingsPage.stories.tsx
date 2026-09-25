import { type Plugin, pluginSettingsDefinitionsAtom, pluginsAtom } from '@mai/plugin'
import { theorySettingsDefinition } from '@mai-plugin/theory'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { getDefaultStore } from 'jotai'
import { MemoryRouter } from 'react-router-dom'
import { expect, userEvent } from 'storybook/test'
import { SettingsPage } from './SettingsPage'

const store = getDefaultStore()

const theoryPlugin: Plugin = {
  id: 'internal-theory',
  name: 'Теория',
  author: null,
  description: null,
  version: '1.0.0',
  enabled: true,
  kind: 'internal',
  installedAt: 1,
  updatedAt: 1,
}

const meta = {
  title: 'Pages/Settings/SettingsPage',
  component: SettingsPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  beforeEach: () => {
    store.set(pluginsAtom, [theoryPlugin])
    store.set(pluginSettingsDefinitionsAtom, [
      { pluginId: theoryPlugin.id, definition: theorySettingsDefinition },
    ])
  },
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(await canvas.findByRole('button', { name: 'Теория' }))
    await expect(await canvas.findByText('Задержка автосохранения')).toBeInTheDocument()
  },
}

export const DisabledPlugin: Story = {
  beforeEach: () => {
    store.set(pluginsAtom, [{ ...theoryPlugin, enabled: false }])
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('button', { name: 'Теория' })).toBeDisabled()
  },
}
