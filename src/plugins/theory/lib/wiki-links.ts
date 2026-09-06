import { error as logError, warn as logWarn } from '@tauri-apps/plugin-log'
import type { JSONContent } from '@tiptap/react'
import { z } from 'zod'
import { type Link, LinkSchema } from '@/entities/link'
import { callGateway } from '@/features/plugin'
import { setWikiStatuses, type WikiStatusMap } from './wiki-status'

const LINK_PLUGIN_ID = 'internal-link'
/** Владелец рёбер theory — выводится из caller-а на backend (caller = ownerPluginId). */
const THEORY_CALLER = 'internal-theory'

/** Упоминание ресурса в документе: цель + подпись (первой вставки). */
export interface WikiMention {
  resourceId: string
  label: string
}

/** Рекурсивно собирает упоминания wiki-ссылок из JSON-документа, уникальные по цели. */
export function extractWikiMentions(doc: JSONContent): WikiMention[] {
  const byId = new Map<string, WikiMention>()

  function walk(node: JSONContent): void {
    if (node.type === 'wikiLink') {
      const resourceId = typeof node.attrs?.resourceId === 'string' ? node.attrs.resourceId : ''
      if (resourceId && !byId.has(resourceId)) {
        byId.set(resourceId, {
          resourceId,
          label: typeof node.attrs?.label === 'string' ? node.attrs.label : '',
        })
      }
    }
    node.content?.forEach(walk)
  }

  walk(doc)

  return [...byId.values()]
}

/** Чистый diff рёбер: что создать и что удалить (лишние — рёбра без упоминаний). */
export function planEdgeSync(
  existingIds: string[],
  mentionedIds: string[],
): { toCreate: string[]; toDelete: string[] } {
  const mentioned = new Set(mentionedIds)
  const existing = new Set(existingIds)

  return {
    toCreate: [...mentioned].filter((id) => !existing.has(id)),
    toDelete: [...existing].filter((id) => !mentioned.has(id)),
  }
}

/** Рёбра теории по источнику-ресурсу: владелец — theory, цель — ресурс курса. */
async function listTheoryEdges(resourceId: string): Promise<Link[]> {
  const edges = await callGateway(
    z.array(LinkSchema),
    LINK_PLUGIN_ID,
    'listBySource',
    { sourceType: 'resource', sourceId: resourceId },
    THEORY_CALLER,
  )

  return edges.filter(
    (edge) => edge.ownerPluginId === THEORY_CALLER && edge.target.kind === 'resource',
  )
}

async function createTheoryEdge(
  courseId: string,
  sourceId: string,
  mention: WikiMention,
): Promise<void> {
  await callGateway(
    LinkSchema,
    LINK_PLUGIN_ID,
    'create',
    {
      sourceType: 'resource',
      sourceId,
      target: { kind: 'resource', courseId, resourceId: mention.resourceId },
      title: mention.label || null,
    },
    THEORY_CALLER,
  )
}

async function deleteTheoryEdge(edgeId: string): Promise<void> {
  await callGateway(z.unknown(), LINK_PLUGIN_ID, 'delete', { id: edgeId }, THEORY_CALLER)
}

/** Приводит рёбра ресурса в соответствие упоминаниям в документе. */
export async function syncWikiEdges(input: {
  courseId: string
  resourceId: string
  doc: JSONContent
}): Promise<void> {
  const { courseId, resourceId, doc } = input

  try {
    const edges = await listTheoryEdges(resourceId)
    const mentions = extractWikiMentions(doc)
    const plan = planEdgeSync(
      edges.map((edge) => (edge.target.kind === 'resource' ? edge.target.resourceId : '')),
      mentions.map((mention) => mention.resourceId),
    )

    for (const mention of mentions) {
      if (plan.toCreate.includes(mention.resourceId)) {
        await createTheoryEdge(courseId, resourceId, mention)
      }
    }
    for (const edge of edges) {
      if (edge.target.kind !== 'resource') continue
      if (plan.toDelete.includes(edge.target.resourceId)) await deleteTheoryEdge(edge.id)
    }

    await refreshWikiStatuses(resourceId)
  } catch (e) {
    logWarn(`plugins/theory: wiki edge sync failed: ${e instanceof Error ? e.message : String(e)}`)
  }
}

/** Обновляет карту статусов целей (broken подсветка) по рёбрам ресурса. */
export async function refreshWikiStatuses(resourceId: string): Promise<void> {
  try {
    const edges = await listTheoryEdges(resourceId)
    const map: WikiStatusMap = {}
    for (const edge of edges) {
      if (edge.target.kind === 'resource') map[edge.target.resourceId] = edge.targetStatus
    }
    setWikiStatuses(map)
  } catch (e) {
    logError(
      `plugins/theory: wiki statuses refresh failed: ${e instanceof Error ? e.message : String(e)}`,
    )
  }
}
