import type { Meta, StoryObj } from '@storybook/react-vite'
import { getDefaultStore } from 'jotai'
import { type ReactNode, useEffect, useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { i18next, initI18n } from '@/app/i18n'
import { DEFAULT_SETTINGS, settingsAtom } from '@/entities/settings'
import { SettingsSidebar } from './SettingsSidebar'

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
  title: 'Settings/SettingsSidebar',
  component: SettingsSidebar,
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
    docs: {
      description: {
        component:
          'Группа «Курсы» наполняется из fake-хранилища (loadCourses в fake-ветке) — в сторибуке это три демо-курса.',
      },
    },
  },
} satisfies Meta<typeof SettingsSidebar>

export default meta
type Story = StoryObj<typeof meta>

/** Общие + Курсы (плагинные группы пусты и не рендерятся). */
export const Default: Story = {}
