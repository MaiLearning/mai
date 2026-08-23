import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Button } from '@/app/theme/components/Button'
import { Spinner } from '@/app/theme/components/Spinner'
import { Text } from '@/app/theme/components/Text'
import type { ResourceType } from '@/entities/resource'
import { fetchResourceTypes, updateResource } from '@/entities/resource/services'
import { notifyError, notifySuccess } from '@/utils/notifications'
import { Center, Hint, MessageBlock, PickerRoot, Title, TypeButton } from './viewer.styles'

interface TypePickerProps {
  resourceId: string
  courseId: string
  resourceName: string
  onTypeSelected: () => void
}

/**
 * TypePicker — выбор типа для ресурса, у которого typeKey ещё не назначен.
 * После успешного назначения вызывает `onTypeSelected`.
 */
export function TypePicker({
  resourceId,
  courseId,
  resourceName,
  onTypeSelected,
}: TypePickerProps) {
  const { t } = useTranslation('viewer')
  const [types, setTypes] = useState<ResourceType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assigning, setAssigning] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchResourceTypes()
      .then(setTypes)
      .catch(() => setError(t('types_load_failed')))
      .finally(() => setLoading(false))
  }, [t])

  useEffect(() => {
    load()
  }, [load])

  async function handleSelect(type: ResourceType) {
    setAssigning(type.key)
    try {
      await updateResource({ resourceId, courseId, name: resourceName, typeKey: type.key })
      notifySuccess(t('type_assigned_title'), t('type_assigned_message', { name: type.name }))
      onTypeSelected()
    } catch {
      notifyError(t('type_assigned_title'), t('assign_failed'))
    } finally {
      setAssigning(null)
    }
  }

  if (loading) {
    return (
      <Center>
        <Spinner label={t('loading')} />
      </Center>
    )
  }

  if (error) {
    return (
      <MessageBlock>
        <Text muted>{error}</Text>
        <Button variant="secondary" onClick={load}>
          {t('retry')}
        </Button>
      </MessageBlock>
    )
  }

  if (types.length === 0) {
    return (
      <MessageBlock>
        <Text muted>{t('no_types')}</Text>
      </MessageBlock>
    )
  }

  return (
    <PickerRoot>
      <Title>{t('pick_type_title')}</Title>
      <Hint muted>{t('pick_type_hint')}</Hint>
      {types.map((type) => (
        <TypeButton
          key={type.key}
          variant="secondary"
          disabled={assigning !== null}
          onClick={() => handleSelect(type)}
        >
          {type.name}
        </TypeButton>
      ))}
    </PickerRoot>
  )
}
