import type { Meta, StoryObj } from '@storybook/react-vite'
import { getDefaultStore } from 'jotai'
import { type ReactNode, useEffect, useState } from 'react'
import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { i18next, initI18n } from '@/app/i18n'
import { DEFAULT_SETTINGS, settingsAtom } from '@/entities/settings'
import { CourseSettings, INTERNAL_SETTINGS_SECTIONS, SectionOutlet } from '@/features/settings'
import { mockPluginSection } from '@/features/settings/__mocks__/plugin-section'
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

/** Маршруты /settings — зеркало settingsRoute из app/router. */
function SettingsRoutes({ initialPath = '/settings/general' }: { initialPath?: string }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/settings" element={<SettingsPage />}>
          <Route index element={<Navigate to="general" replace />} />
          <Route path="course/:courseId" element={<CourseSettings />} />
          <Route path=":sectionId" element={<SectionOutlet />} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

const meta = {
  title: 'Pages/Settings/SettingsPage',
  component: SettingsPage,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <StorySetup>
        <Story />
      </StorySetup>
    ),
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SettingsPage>

export default meta
type Story = StoryObj<typeof meta>

/** Шелл целиком: сайдбар (3 группы) + поисковик + секция «Общие». */
export const Default: Story = {
  render: () => <SettingsRoutes />,
}

/** С мок-секцией плагина: группа «Встроенные плагины» и настройки демо-плагина. */
export const WithMockPlugin: Story = {
  render: () => <SettingsRoutes initialPath="/settings/demo-plugin" />,
  decorators: [
    (Story) => {
      INTERNAL_SETTINGS_SECTIONS.push(mockPluginSection)

      return <Story />
    },
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Реальные плагины сюда не подключены (отдельная задача) — секция добавлена моком для демонстрации контракта.',
      },
    },
  },
}
