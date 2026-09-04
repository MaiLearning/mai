import type { Edge, Node } from '@xyflow/react'
import type { Link } from '@/entities/link'

/** Режим отображения LinkViewer. v1 — только граф; переключатель режимов — v2. */
export type LinkViewMode = 'graph'

/** Вид узла графа. */
export type GraphNodeKind = 'course' | 'resource' | 'uri'

/** Данные кастомного узла React Flow (type-алиас — нужен для Record<string, unknown>). */
export type GraphNodeData = {
  kind: GraphNodeKind
  /** Идентификатор узла без префикса вида: id сущности или сам URI. */
  nodeId: string
  label: string
  sublabel?: string
  /** Текущий (открытый) курс. */
  isCurrentCourse: boolean
}

/** Узел графа React Flow. */
export type GraphFlowNode = Node<GraphNodeData>

/** Данные ребра графа. */
export type GraphEdgeData = {
  link: Link
}

/** Ребро графа React Flow. */
export type GraphFlowEdge = Edge<GraphEdgeData>

/** Префиксы составных id узлов графа. */
export const COURSE_NODE_PREFIX = 'course:'
export const RESOURCE_NODE_PREFIX = 'resource:'
export const URI_NODE_PREFIX = 'uri:'
