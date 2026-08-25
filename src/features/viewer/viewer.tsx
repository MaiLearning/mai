import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from '@/app/i18n'
import { Button } from '@/app/theme/components/Button'
import { Spinner } from '@/app/theme/components/Spinner'
import { Text } from '@/app/theme/components/Text'
import type { StructureNodeFlat } from '@/entities/structure'
import { fetchStructure } from '@/entities/structure/services'
import { PluginViewer } from '@/features/plugin'
import { TypePicker } from './typePicker'
import { Center, MessageBlock } from './viewer.styles'

interface ViewerProps {
  resourceId: string
  courseId: string
}

/**
 * Viewer — отображает содержимое ресурса.
 *
 * Загружает структуру курса, находит узел по resourceId и выбирает режим:
 * - у ресурса нет типа → TypePicker для назначения типа;
 * - тип есть → рендер через плагин (PluginViewer).
 */
export function Viewer({ resourceId, courseId }: ViewerProps) {
  const { t } = useTranslation('viewer')
  const [node, setNode] = useState<StructureNodeFlat | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchStructure(courseId)
      .then((nodes) => {
        setNode(nodes.find((n) => n.resource?.id === resourceId) ?? null)
      })
      .catch(() => setError(t('load_failed')))
      .finally(() => setLoading(false))
  }, [courseId, resourceId, t])

  useEffect(() => {
    load()
  }, [load])

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

  if (!node?.resource) {
    return (
      <MessageBlock>
        <Text muted>{t('resource_not_found')}</Text>
      </MessageBlock>
    )
  }

  if (!node.resource.typeKey) {
    return (
      <TypePicker
        resourceId={resourceId}
        courseId={courseId}
        resourceName={node.resource.name}
        onTypeSelected={load}
      />
    )
  }

  return <PluginViewer resourceId={resourceId} courseId={courseId} data={node.resource} />
}
