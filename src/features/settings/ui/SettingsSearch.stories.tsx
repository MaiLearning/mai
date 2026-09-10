import type { Meta, StoryObj } from '@storybook/react-vite'
import { getDefaultStore } from 'jotai'
import { type ReactNode, useEffect, useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { i18next, initI18n } from '@/app/i18n'
import { DEFAULT_SETTINGS, settingsAtom } from '@/entities/settings'
import { SettingsSearch } from './SettingsSearch'

/** Инициализация i18next + пресет настроек до рендера (см. SettingsPage.stories). */
function StorySetup({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(i18next.isInitialized)

  useEffect(() => {
    if (!ready) void initI18n().then(() => setReady(true))
  }, [ready])

  useEffect(() => {
    if (!ready) return
    getDefaultStore().set(settingsAtom, { ...DEFAULT_SETTINGS, theme: 'system' })
    i18next.changeLanguage('ru')
  }, [ready])

  return ready ? <>{children}</> : null
}

const meta = {
  title: 'Settings/SettingsSearch',
  component: SettingsSearch,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <StorySetup>
        <MemoryRouter initialEntries={['/settings/general']}>
          <Story />
        </MemoryRouter>
      </StorySetup>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SettingsSearch>

export default meta
type Story = StoryObj<typeof meta>

/** Пустой поисковик — топбар над main. Введите запрос: «тем», «язык», курс. */
export const Default: Story = {}
