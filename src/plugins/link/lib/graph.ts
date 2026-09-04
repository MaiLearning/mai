import type { Link, LinkTarget } from '@/entities/link'
import type { StructureNodeFlat } from '@/entities/structure'
import {
  COURSE_NODE_PREFIX,
  type GraphFlowEdge,
  type GraphFlowNode,
  RESOURCE_NODE_PREFIX,
  URI_NODE_PREFIX,
} from '../core/types'

interface BuildGraphInput {
  courseId: string
  links: Link[]
  /** Плоские узлы структуры курса — имена ресурсов. */
  structureNodes: StructureNodeFlat[]
  /** Имена курсов для целей-курсов (могут быть из другого курса). */
  courseNames: Record<string, string>
}

function targetNodeId(target: LinkTarget): string {
  if (target.kind === 'resource') return `${RESOURCE_NODE_PREFIX}${target.resourceId}`
  if (target.kind === 'course') return `${COURSE_NODE_PREFIX}${target.courseId}`

  return `${URI_NODE_PREFIX}${target.uri}`
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`
}

function courseNode(courseId: string, courseName: string | undefined): GraphFlowNode {
  return {
    id: `${COURSE_NODE_PREFIX}${courseId}`,
    position: { x: 0, y: 0 },
    data: {
      kind: 'course',
      nodeId: courseId,
      label: courseName ?? '…',
      isCurrentCourse: true,
    },
  }
}

function resourceNode(resourceId: string, label: string): GraphFlowNode {
  return {
    id: `${RESOURCE_NODE_PREFIX}${resourceId}`,
    position: { x: 0, y: 0 },
    data: { kind: 'resource', nodeId: resourceId, label, isCurrentCourse: false },
  }
}

function uriNode(uri: string): GraphFlowNode {
  return {
    id: `${URI_NODE_PREFIX}${uri}`,
    position: { x: 0, y: 0 },
    data: { kind: 'uri', nodeId: uri, label: truncate(uri, 32), isCurrentCourse: false },
  }
}

/**
 * Собирает узлы и рёбра графа курса из рёбер Link и структуры курса.
 *
 * Узлы — курс (всегда), ресурсы курса и URI-цели, участвовующие хотя бы
 * в одном ребре. Позиции проставляет раскладчик (lib/layout), здесь — нули.
 */
export function buildGraph(input: BuildGraphInput): {
  nodes: GraphFlowNode[]
  edges: GraphFlowEdge[]
} {
  const { courseId, links, structureNodes, courseNames } = input

  const resourceLabels = new Map<string, string>()
  for (const node of structureNodes) {
    if (node.resource) resourceLabels.set(node.resource.id, node.resource.name)
  }

  const nodes = new Map<string, GraphFlowNode>()
  const addNode = (node: GraphFlowNode) => {
    if (!nodes.has(node.id)) nodes.set(node.id, node)
  }

  const edges: GraphFlowEdge[] = links.map((link) => {
    const sourceId =
      link.sourceType === 'course'
        ? `${COURSE_NODE_PREFIX}${link.sourceId}`
        : `${RESOURCE_NODE_PREFIX}${link.sourceId}`
    const targetId = targetNodeId(link.target)

    if (link.sourceType === 'course') {
      addNode(courseNode(link.sourceId, courseNames[link.sourceId]))
    } else {
      const label = resourceLabels.get(link.sourceId) ?? truncate(link.sourceId, 12)
      addNode(resourceNode(link.sourceId, label))
    }

    if (link.target.kind === 'resource') {
      const label =
        resourceLabels.get(link.target.resourceId) ?? truncate(link.target.resourceId, 12)
      addNode(resourceNode(link.target.resourceId, label))
    } else if (link.target.kind === 'course') {
      addNode(courseNode(link.target.courseId, courseNames[link.target.courseId]))
    } else {
      addNode(uriNode(link.target.uri))
    }

    return {
      id: link.id,
      source: sourceId,
      target: targetId,
      label: link.title ?? undefined,
      data: { link },
    }
  })

  const currentCourse = courseNode(courseId, courseNames[courseId])
  if (edges.length === 0) return { nodes: [currentCourse], edges: [] }
  addNode(currentCourse)

  return { nodes: [...nodes.values()], edges }
}
