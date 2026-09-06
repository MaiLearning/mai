import { error as logError } from '@tauri-apps/plugin-log'
import { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Button } from '@/app/theme/components/Button'
import { Input } from '@/app/theme/components/Input'
import { Modal } from '@/app/theme/components/Modal'
import { Text } from '@/app/theme/components/Text'
import { notifyError, notifySuccess } from '@/utils/notifications'
import { openExternal } from '../lib/open-external'
import { isValidHttpUrl } from '../lib/url-validation'
import type { InsertDialogKind } from './TheoryToolbar'

export interface UrlDialogState {
  kind: InsertDialogKind
  /** Начальное значение (например, существующий href ссылки). */
  initial: string
}

export interface UrlDialogProps {
  state: UrlDialogState | null
  onClose: () => void
  onSubmit: (url: string) => void
}

/**
 * Модальный диалог ввода URL для вставок (ссылка / изображение).
 * Пустое значение для «Ссылка» означает снятие ссылки с выделения.
 */
export function UrlDialog({ state, onClose, onSubmit }: UrlDialogProps) {
  const { t } = useTranslation('theory')
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  // Сброс состояния при каждом открытии (kind меняется → пересоздаём значение).
  useEffect(() => {
    setValue(state?.initial ?? '')
    setTouched(false)
  }, [state])

  if (!state) return null

  // Пустое значение допустимо только для ссылки (семантика «снять ссылку»).
  const valid = value.trim().length === 0 ? state.kind === 'link' : isValidHttpUrl(value)
  const titles = {
    link: t('dialog_link_title'),
    image: t('dialog_image_title'),
  } as const

  const placeholders = {
    link: t('dialog_link_placeholder'),
    image: t('dialog_image_placeholder'),
  } as const

  const hints = {
    link: t('dialog_link_hint'),
    image: t('dialog_image_hint'),
  } as const

  const hasExisting = state.kind === 'link' && isValidHttpUrl(state.initial)

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(state!.initial)
      notifySuccess(t('dialog_copy_success_title'), t('dialog_copy_success_message'))
    } catch (e) {
      logError(`plugins/theory: copy link failed: ${e instanceof Error ? e.message : String(e)}`)
      notifyError(t('dialog_copy_failed'))
    }
  }

  function submit() {
    setTouched(true)
    if (!valid) return

    onSubmit(value.trim())
  }

  return (
    <Modal
      opened
      onClose={onClose}
      title={titles[state.kind]}
      width={480}
      footer={
        <>
          {hasExisting && (
            <>
              <Button type="button" variant="ghost" onClick={() => void copyLink()}>
                {t('dialog_copy')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => void openExternal(state.initial)}
              >
                {t('dialog_open')}
              </Button>
            </>
          )}
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('dialog_cancel')}
          </Button>
          <Button type="button" variant="primary" onClick={submit}>
            {t('dialog_apply')}
          </Button>
        </>
      }
    >
      <Input
        autoFocus
        value={value}
        placeholder={placeholders[state.kind]}
        aria-label={titles[state.kind]}
        error={touched && !valid ? t('dialog_invalid_url') : undefined}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            submit()
          }
        }}
      />
      <Text muted>{hints[state.kind]}</Text>
    </Modal>
  )
}
