import i18next from 'i18next'
import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

export interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}
