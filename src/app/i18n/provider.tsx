import { type ReactNode, Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import { i18next } from './init'

interface I18nProviderProps {
  children: ReactNode
}

/**
 * Провайдер i18next: передает инициализированный инстанс в дерево
 * и страхует Suspense-загрузку переводов пустым fallback'ом.
 */
export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18next}>
      <Suspense fallback={null}>{children}</Suspense>
    </I18nextProvider>
  )
}
