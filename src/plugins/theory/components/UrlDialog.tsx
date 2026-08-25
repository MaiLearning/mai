import { useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Button } from '@/app/theme/components/Button'
import { Input } from '@/app/theme/components/Input'
import { Modal } from '@/app/theme/components/Modal'
import { Text } from '@/app/theme/components/Text'

export interface UrlDialogState {
  kind: 'link' | 'image' | 'video'
  /** Начальное значение (например, существующий href ссылки). */
  initial: string
}

export interface UrlDialogProps {
  state: UrlDialogState | null
  onClose: () => void
  onSubmit: (url: string) => void
}

/** Проверяет, что строка — корректный http(s)/относительный URL. */
function isValidUrl(value: string): boolean {
  if (value.trim().length === 0) return true
  try {
    const parsed = new URL(value)

    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Модальный диалог ввода URL для вставок (ссылка / изображение / видео).
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

  const valid = isValidUrl(value)
  const titles = {
    link: t('dialog_link_title'),
    image: t('dialog_image_title'),
    video: t('dialog_video_title'),
  } as const

  const placeholders = {
    link: t('dialog_link_placeholder'),
    image: t('dialog_image_placeholder'),
    video: t('dialog_video_placeholder'),
  } as const

  const hints = {
    link: t('dialog_link_hint'),
    image: t('dialog_image_hint'),
    video: t('dialog_video_hint'),
  } as const

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
