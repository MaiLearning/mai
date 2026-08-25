import { useTranslation } from '@/app/i18n'
import { SaveDot, StatusBar, StatusItem, StatusSpacer } from '../styles/layout.style'

export interface TheoryStatusBarProps {
  /** Состояние автосохранения — управляет точкой и подписью. */
  saveState: 'idle' | 'saving' | 'saved' | 'error'
}

/**
 * Строка состояния под документом: индикатор автосохранения,
 * версия (заглушка) и формат. Правая часть — язык интерфейса.
 */
export function TheoryStatusBar({ saveState }: TheoryStatusBarProps) {
  const { t, i18n } = useTranslation('theory')

  const tone = saveState === 'error' ? 'danger' : saveState === 'saving' ? 'warning' : 'success'
  const autosaveLabel =
    saveState === 'error'
      ? t('status_autosave_error')
      : saveState === 'saving'
        ? t('status_autosave_saving')
        : t('status_autosave_on')

  return (
    <StatusBar>
      <StatusItem>
        <SaveDot $tone={tone} /> {autosaveLabel}
      </StatusItem>
      <StatusItem>{t('status_version', { version: 1 })}</StatusItem>
      <StatusItem>theory · tiptap</StatusItem>
      <StatusSpacer />
      <StatusItem>{t('status_page')}</StatusItem>
      <StatusItem>{i18n.language.toUpperCase()}</StatusItem>
    </StatusBar>
  )
}
