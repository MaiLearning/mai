import { RotateCcw } from 'lucide-react'
import { useTranslation } from '@/app/i18n'
import {
  SaveDot,
  StatusAutosave,
  StatusBar,
  StatusItem,
  StatusRetry,
  StatusSpacer,
} from './TheoryStatusBar.style'

export interface TheoryStatusBarProps {
  /** Состояние автосохранения — управляет точкой и подписью. */
  saveState: 'idle' | 'saving' | 'saved' | 'error'
  /** Повторная попытка сохранения (показывается при ошибке). */
  onRetry?: () => void
}

/**
 * Строка состояния под документом: индикатор автосохранения и язык интерфейса.
 * Ширина блока автосохранения зарезервирована, поэтому соседние элементы
 * не смещаются при смене статуса.
 */
export function TheoryStatusBar({ saveState, onRetry }: TheoryStatusBarProps) {
  const { t, i18n } = useTranslation('theory')

  const tone = saveState === 'error' ? 'danger' : saveState === 'saving' ? 'warning' : 'success'
  const autosaveLabel =
    saveState === 'error'
      ? t('status_autosave_error')
      : saveState === 'saving'
        ? t('status_autosave_saving')
        : saveState === 'saved'
          ? t('status_autosave_saved')
          : t('status_autosave_on')

  return (
    <StatusBar>
      <StatusAutosave>
        <SaveDot $tone={tone} /> {autosaveLabel}
        {saveState === 'error' && onRetry && (
          <StatusRetry type="button" onClick={onRetry}>
            <RotateCcw size={12} /> {t('status_retry')}
          </StatusRetry>
        )}
      </StatusAutosave>
      <StatusSpacer />
      {/* TODO: определять язык текста документа и показывать его вместо языка интерфейса */}
      <StatusItem>{i18n.language.toUpperCase()}</StatusItem>
    </StatusBar>
  )
}
