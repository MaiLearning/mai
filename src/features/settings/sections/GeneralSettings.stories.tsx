import type { Meta, StoryObj } from '@storybook/react-vite'
import { getDefaultStore } from 'jotai'
import { type ReactNode, useEffect, useState } from 'react'
import { i18next, initI18n } from '@/app/i18n'
import {
  DEFAULT_SETTINGS,
  type SettingsLanguage,
  type SettingsTheme,
  settingsAtom,
} from '@/entities/settings'
import { GeneralSettings } from './general'

/**
 * Инициализирует i18next до рендера: в сторибуке runner-таски приложения
 * не выполняются, а селекторы читают подписи через i18next.
 */
function WithI18n({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(i18next.isInitialized)

  useEffect(() => {
    if (!ready) void initI18n().then(() => setReady(true))
  }, [ready])

  return ready ? <>{children}</> : null
}

/**
 * Пресет настроек для стори: сидируется в дефолтный jotai-стор, откуда
 * ThemeProvider (глобальный декоратор preview) читает тему реактивно.
 * Каждый стори задаёт полный пресет — порядок обхода сторий не важен.
 */
function preset(theme: SettingsTheme, language: SettingsLanguage) {
  getDefaultStore().set(settingsAtom, { ...DEFAULT_SETTINGS, theme })
  i18next.changeLanguage(language)
}

const meta = {
  title: 'Settings/GeneralSettings',
  component: GeneralSettings,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <WithI18n>
        <Story />
      </WithI18n>
    ),
  ],
} satisfies Meta<typeof GeneralSettings>

export default meta
type Story = StoryObj<typeof meta>

/** Стартовое состояние: тема «Системная», язык «Русский». */
export const Default: Story = {
  decorators: [
    (Story) => {
      preset('system', 'ru')

      return <Story />
    },
  ],
}

/** Тема «Светлая» — селектор применяет её через настройки, мимо локального стейта. */
export const LightTheme: Story = {
  decorators: [
    (Story) => {
      preset('light', 'ru')

      return <Story />
    },
  ],
}

/** Тема «Тёмная». */
export const DarkTheme: Story = {
  decorators: [
    (Story) => {
      preset('dark', 'ru')

      return <Story />
    },
  ],
}

/** Язык «English» — все подписи переключаются через i18next. */
export const English: Story = {
  decorators: [
    (Story) => {
      preset('system', 'en')

      return <Story />
    },
  ],
}
