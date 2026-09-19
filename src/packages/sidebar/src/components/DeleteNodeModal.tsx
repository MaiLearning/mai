import { useTranslation } from '@mai/i18n'
import { Button, Modal, Spinner, Text } from '@mai/theme'
import { useState } from 'react'
import type { CourseNode } from '../model/types'

interface DeleteNodeModalProps {
  /** Узел, который пользователь собирается удалить (null — модалка закрыта). */
  target: CourseNode | null
  /** Удаление (уведомления ошибок — внутри useStructureActions). */
  onConfirm: (id: string) => Promise<void>
  onClose: () => void
}

/**
 * Подтверждение удаления узла. Владеет состоянием «идёт удаление»:
 * на время запроса кнопки блокируются, закрытие — только по успеху.
 */
export function DeleteNodeModal({ target, onConfirm, onClose }: DeleteNodeModalProps) {
  const { t } = useTranslation('sidebar')
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    if (!target || deleting) return
    setDeleting(true)
    try {
      await onConfirm(target.id)
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal
      opened={target !== null}
      onClose={onClose}
      dismissible={!deleting}
      title={t('delete.title')}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            {t('actions.cancel')}
          </Button>
          <Button variant="primary" onClick={() => void handleConfirm()} disabled={deleting}>
            {deleting ? <Spinner label={t('actions.deleting')} /> : t('actions.delete')}
          </Button>
        </>
      }
    >
      <Text>
        {target?.type === 'folder'
          ? t('delete.folder', { name: target?.title })
          : t('delete.resource', { name: target?.title })}
      </Text>
    </Modal>
  )
}
