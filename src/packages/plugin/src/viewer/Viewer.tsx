import { useTranslation } from '@mai/i18n'
import type { StructureNodeFlat } from '@mai/structure'
import { fetchStructure } from '@mai/structure'
import { Button, Spinner, Text } from '@mai/theme'
import { useCallback, useEffect, useState } from 'react'
import { PluginViewer } from './PluginViewer'
import { Center, MessageBlock } from './shared.style'
import { TypePicker } from './TypePicker'

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
  const { t } = useTranslation('plugin')
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
        <Text color="muted">{error}</Text>
        <Button variant="secondary" onClick={load}>
          {t('retry')}
        </Button>
      </MessageBlock>
    )
  }

  if (!node?.resource) {
    return (
      <MessageBlock>
        <Text color="muted">{t('resource_not_found')}</Text>
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
