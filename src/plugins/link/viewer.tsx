import '@xyflow/react/dist/style.css'
import { error as logError } from '@tauri-apps/plugin-log'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '@/app/i18n'
import { Button, Spinner } from '@/app/theme/components'
import { coursesAtom, loadCoursesAtom } from '@/entities/course'
import { type Link, linksByCourseAtom, loadCourseLinksAtom } from '@/entities/link'
import type { StructureNodeFlat } from '@/entities/structure'
import { fetchStructure } from '@/entities/structure/services'
import type { PluginRenderProps } from '@/features/plugin/core/types'
import { CreateLinkModal } from './components/CreateLinkModal'
import { EdgeDetailsPanel } from './components/EdgeDetailsPanel'
import { LinkGraph } from './components/LinkGraph'
import type { PickerResource } from './components/TargetPicker'
import type { GraphFlowNode } from './core/types'
import { buildGraph } from './lib/graph'
import { applyLayout } from './lib/layout'
import { openLinkTarget } from './lib/navigation'
import {
  Body,
  EmptyState,
  GraphArea,
  Header,
  HeaderSubtitle,
  HeaderTitle,
  HeaderTitles,
  ViewerRoot,
} from './viewer.style'

/**
 * LinkViewer — граф связей курса.
 *
 * Загружает рёбра курса и структуру (имена узлов), раскладывает граф
 * силовым алгоритмом ELK и отдаёт на холст @xyflow/react. Клик по узлу —
 * переход (роутер или системный обработчик URI), клик по ребру — панель
 * правки. Управление рёбрами — от имени плагина-владельца internal-link.
 */
export function LinkViewer({ courseId, onReady }: PluginRenderProps) {
  const { t } = useTranslation('link')
  const navigate = useNavigate()

  const linksByCourse = useAtomValue(linksByCourseAtom)
  const links = useMemo(() => linksByCourse[courseId] ?? [], [linksByCourse, courseId])
  const loadLinks = useSetAtom(loadCourseLinksAtom)
  const courses = useAtomValue(coursesAtom)
  const loadCourses = useSetAtom(loadCoursesAtom)

  const [structureNodes, setStructureNodes] = useState<StructureNodeFlat[]>([])
  const [layouted, setLayouted] = useState<GraphFlowNode[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const readyRef = useRef(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [, , structure] = await Promise.all([
        loadLinks(courseId),
        loadCourses(),
        fetchStructure(courseId),
      ])
      setStructureNodes(structure)
    } catch (e) {
      logError(
        `Не удалось загрузить граф курса ${courseId}: ${e instanceof Error ? e.message : String(e)}`,
      )
    } finally {
      setLoading(false)
      if (!readyRef.current) {
        readyRef.current = true
        onReady?.()
      }
    }
  }, [courseId, loadLinks, loadCourses, onReady])

  useEffect(() => {
    void load()
  }, [load])

  const resources: PickerResource[] = useMemo(
    () =>
      structureNodes
        .filter((node) => node.resource)
        .map((node) => ({
          id: node.resource!.id,
          name: node.resource!.name,
          courseId: node.resource!.courseId,
        })),
    [structureNodes],
  )

  const courseNames = useMemo(() => {
    const map: Record<string, string> = {}
    for (const item of courses) map[item.id] = item.name

    return map
  }, [courses])

  const { nodes: nodesRaw, edges } = useMemo(
    () => buildGraph({ courseId, links, structureNodes, courseNames }),
    [courseId, links, structureNodes, courseNames],
  )

  useEffect(() => {
    let cancelled = false
    void applyLayout(nodesRaw, edges).then((positioned) => {
      if (!cancelled) setLayouted(positioned)
    })

    return () => {
      cancelled = true
    }
  }, [nodesRaw, edges])

  const selectedLink: Link | null = links.find((link) => link.id === selectedLinkId) ?? null

  const handleNodeActivate = (kind: string, nodeId: string) => {
    void openLinkTarget(
      kind === 'uri'
        ? { kind: 'uri', uri: nodeId }
        : kind === 'course'
          ? { kind: 'course', courseId: nodeId }
          : { kind: 'resource', courseId, resourceId: nodeId },
      navigate,
      t('open_failed'),
    )
  }

  return (
    <ViewerRoot>
      <Header>
        <HeaderTitles>
          <HeaderTitle>{t('title')}</HeaderTitle>
          <HeaderSubtitle>{t('subtitle')}</HeaderSubtitle>
        </HeaderTitles>
        <Button onClick={() => setCreating(true)}>{t('add_edge')}</Button>
      </Header>

      <Body>
        <GraphArea>
          {loading ? (
            <EmptyState>
              <Spinner label={t('loading')} />
            </EmptyState>
          ) : links.length === 0 ? (
            <EmptyState>
              {t('empty')}
              <Button variant="secondary" onClick={() => setCreating(true)}>
                {t('add_edge')}
              </Button>
            </EmptyState>
          ) : (
            <LinkGraph
              nodes={layouted}
              edges={edges}
              onNodeActivate={(data) => handleNodeActivate(data.kind, data.nodeId)}
              onEdgeSelect={(link) => setSelectedLinkId(link.id)}
            />
          )}
        </GraphArea>

        {selectedLink && (
          <EdgeDetailsPanel
            link={selectedLink}
            resourceNames={Object.fromEntries(resources.map((r) => [r.id, r.name]))}
            courseNames={courseNames}
            resources={resources}
            courses={courses}
            currentCourseId={courseId}
            onClose={() => setSelectedLinkId(null)}
            onNavigate={(target) => void openLinkTarget(target, navigate, t('open_failed'))}
          />
        )}
      </Body>

      {creating && (
        <CreateLinkModal
          opened
          onClose={() => setCreating(false)}
          courseId={courseId}
          resources={resources}
          courses={courses}
        />
      )}
    </ViewerRoot>
  )
}
