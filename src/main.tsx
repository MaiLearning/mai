import React from 'react'
import ReactDOM from 'react-dom/client'
import Application from './app/app'
import { initI18n } from '@/app/i18n'

/**
 * i18next инициализируется до первого рендера, чтобы избежать пустого
 * Suspense-кадра и рассинхрона стартового языка с `localStorage`.
 */
initI18n()
  .then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <Application />
      </React.StrictMode>,
    )
  })
  .catch((e) => {
    console.error('[main] i18n init failed:', e)
  })
