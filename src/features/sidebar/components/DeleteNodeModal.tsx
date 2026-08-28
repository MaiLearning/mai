import { useState } from 'react'
import { Button, Modal, Spinner, Text } from '@/app/theme/components'
import type { CourseNode } from '../model/types'

interface DeleteNodeModalProps {
  /** Узел, который пользователь собирается удалить (null — модалка закрыта). */
  target: CourseNode | null
  /** Удаление (тосты ошибок — внутри useStructureActions). */
  onConfirm: (id: string) => Promise<void>
  onClose: () => void
}

/**
 * Подтверждение удаления узла. Владеет состоянием «идёт удаление»:
 * на время запроса кнопки блокируются, закрытие — только по успеху.
 */
export function DeleteNodeModal({ target, onConfirm, onClose }: DeleteNodeModalProps) {
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
      title="Подтверждение удаления"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={deleting}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => void handleConfirm()} disabled={deleting}>
            {deleting ? <Spinner label="Удаление" /> : 'Удалить'}
          </Button>
        </>
      }
    >
      <Text>
        {target?.type === 'folder'
          ? `Удалить папку «${target?.title}» и всё её содержимое?`
          : `Удалить ресурс «${target?.title}»?`}
      </Text>
    </Modal>
  )
}
