import type { Link } from '../../entity'

/** Режим отображения LinkViewer. v1 — только граф; переключатель режимов — v2. */
export type LinkViewMode = 'graph'

/** Вид узла графа. */
export type GraphNodeKind = 'course' | 'resource' | 'uri'

/**
 * Узел графа связей — доменная модель без привязки к рендеру.
 * Позиции и скорости узла живут в симуляции (lib/simulation).
 */
export type GraphNode = {
  id: string
  kind: GraphNodeKind
  /** Идентификатор узла без префикса вида: id сущности или сам URI. */
  nodeId: string
  label: string
  sublabel?: string
  /** Текущий (открытый) курс. */
  isCurrentCourse: boolean
  /** Число инцидентных рёбер — задаёт радиус точки. */
  degree: number
}

/** Ребро графа связей. */
export type GraphEdge = {
  id: string
  source: string
  target: string
  link: Link
}

/** Параметры физики графа (панель настроек). */
export type PhysicsParams = {
  /** Сила отталкивания узлов (модуль). */
  repulsion: number
  /** Желаемая длина ребра. */
  linkDistance: number
  /** Притяжение узлов к центру сцены. */
  centerStrength: number
}

/** Префиксы составных id узлов графа. */
export const COURSE_NODE_PREFIX = 'course:'
export const RESOURCE_NODE_PREFIX = 'resource:'
export const URI_NODE_PREFIX = 'uri:'
