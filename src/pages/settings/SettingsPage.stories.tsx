import type { Meta, StoryObj } from '@storybook/react-vite'
import { getDefaultStore } from 'jotai'
import { type ReactNode, useEffect, useState } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { i18next, initI18n } from '@/app/i18n'
import { DEFAULT_SETTINGS, settingsAtom } from '@/entities/settings'
import { GlobalSettings } from './global'
import { SettingsPage } from './settings-page'

/**
 * Инициализирует i18next и стартовый пресет настроек до рендера:
 * в сторибуке runner-таски приложения не выполняются.
 */
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
  title: 'Pages/Settings/SettingsPage',
  component: SettingsPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      // Страница рендерит <Outlet /> — нужен роутер с вложенным маршрутом
      <StorySetup>
        <MemoryRouter initialEntries={['/settings']}>
          <Routes>
            <Route path="/settings" element={<Story />}>
              <Route index element={<GlobalSettings />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </StorySetup>
    ),
  ],
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

/** Оболочка страницы с разделом «Общие настройки» в Outlet. */
export const Default: Story = {}
