import { type AppTheme, getColor } from '@mai/theme'
import {
  EDGE_CURVATURE,
  LABEL_FADE_RANGE,
  LABEL_FONT_SIZE,
  LABEL_MAX_CHARS,
  LABEL_ZOOM_MIN,
  NODE_RADIUS_MAX,
  NODE_RADIUS_MIN,
  NODE_SCREEN_RADIUS_MIN,
} from '../core/constants'
import type { SimLink, SimNode } from './simulation'
import { nodePoint, type ViewTransform, worldToScreen } from './viewTransform'

/** Цвета и шрифты темы, разрешённые для canvas (строки, не CSS). */
export type GraphRenderTheme = {
  edge: string
  edgeHighlighted: string
  edgeBroken: string
  nodeCourse: string
  nodeResource: string
  nodeUri: string
  label: string
  labelHalo: string
  ring: string
  font: string
}

/** Маппинг темы приложения в цвета canvas-рендера. */
export function toRenderTheme(theme: AppTheme): GraphRenderTheme {
  return {
    edge: getColor(theme, 'neutral', 'border', 'strong'),
    edgeHighlighted: getColor(theme, 'accent', 'solid', 'base'),
    edgeBroken: getColor(theme, 'danger', 'solid', 'base'),
    nodeCourse: getColor(theme, 'accent', 'solid', 'base'),
    nodeResource: getColor(theme, 'neutral', 'border', 'strong'),
    nodeUri: getColor(theme, 'neutral', 'foreground', 'muted'),
    label: getColor(theme, 'neutral', 'foreground', 'primary'),
    labelHalo: getColor(theme, 'neutral', 'background', 'body'),
    ring: getColor(theme, 'accent', 'solid', 'base'),
    font: `600 ${LABEL_FONT_SIZE}px ${theme.typography.fontFamily}`,
  }
}

export type RenderInput = {
  ctx: CanvasRenderingContext2D
  /** Размеры вьюпорта в CSS-пикселях. */
  width: number
  height: number
  transform: ViewTransform
  nodes: readonly SimNode[]
  links: readonly SimLink[]
  theme: GraphRenderTheme
  hoveredId: string | null
  selectedEdgeId: string | null
}

/** Радиус точки по степени узла: листы — маленькие, хабы — крупные. */
export function nodeRadius(degree: number): number {
  const t = Math.min(1, Math.sqrt(Math.max(0, degree - 1)) / 3)

  return NODE_RADIUS_MIN + (NODE_RADIUS_MAX - NODE_RADIUS_MIN) * t
}

/** Множество наведённого узла и его соседей. */
function focusSet(hoveredId: string | null, links: readonly SimLink[]): Set<string> | null {
  if (!hoveredId) return null
  const set = new Set<string>([hoveredId])
  for (const link of links) {
    if (link.source.id === hoveredId) set.add(link.target.id)
    if (link.target.id === hoveredId) set.add(link.source.id)
  }

  return set
}

function truncateLabel(value: string): string {
  return value.length <= LABEL_MAX_CHARS ? value : `${value.slice(0, LABEL_MAX_CHARS - 1)}…`
}

function edgeCurve(
  ctx: CanvasRenderingContext2D,
  ax: number,
  ay: number,
  bx: number,
  by: number,
  sign: number,
): void {
  const dx = bx - ax
  const dy = by - ay
  const len = Math.hypot(dx, dy)
  if (len === 0) return
  const nx = -dy / len
  const ny = dx / len
  const bow = len * EDGE_CURVATURE * sign
  ctx.beginPath()
  ctx.moveTo(ax, ay)
  ctx.quadraticCurveTo((ax + bx) / 2 + nx * bow, (ay + by) / 2 + ny * bow, bx, by)
  ctx.stroke()
}

function edgeSign(id: string): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0

  return hash % 2 === 0 ? 1 : -1
}

function drawEdges(input: RenderInput, focus: Set<string> | null): void {
  const { ctx, links, theme, transform: t } = input
  ctx.lineCap = 'round'

  const width = Math.max(0.7, Math.min(1.5, t.k)) * 1.4

  for (const link of links) {
    if (link.source.x == null || link.target.x == null) continue
    const a = worldToScreen(t, nodePoint(link.source))
    const b = worldToScreen(t, nodePoint(link.target))

    const selected = link.id === input.selectedEdgeId
    const incident = focus !== null && (focus.has(link.source.id) || focus.has(link.target.id))

    ctx.setLineDash(link.broken ? [6, 5] : [])
    ctx.strokeStyle =
      selected || incident ? theme.edgeHighlighted : link.broken ? theme.edgeBroken : theme.edge
    ctx.lineWidth = selected ? width + 1 : width
    ctx.globalAlpha = selected ? 1 : focus === null ? 0.5 : incident ? 0.85 : 0.07

    edgeCurve(ctx, a.x, a.y, b.x, b.y, edgeSign(link.id))
  }

  ctx.setLineDash([])
  ctx.globalAlpha = 1
}

function nodeFill(kind: SimNode['kind'], theme: GraphRenderTheme): string {
  if (kind === 'course') return theme.nodeCourse
  if (kind === 'uri') return theme.nodeUri

  return theme.nodeResource
}

function drawNodes(input: RenderInput, focus: Set<string> | null): void {
  const { ctx, nodes, theme, transform: t, hoveredId } = input

  for (const node of nodes) {
    if (node.x == null || node.y == null) continue
    const s = worldToScreen(t, nodePoint(node))
    const r = Math.max(nodeRadius(node.degree) * t.k, NODE_SCREEN_RADIUS_MIN)
    const inFocus = focus === null || focus.has(node.id)
    const active = node.id === hoveredId

    ctx.globalAlpha = inFocus ? 1 : 0.15
    ctx.beginPath()
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2)
    ctx.fillStyle = nodeFill(node.kind, theme)
    ctx.fill()

    if (node.isCurrentCourse || active) {
      ctx.beginPath()
      ctx.arc(s.x, s.y, r + 3, 0, Math.PI * 2)
      ctx.strokeStyle = theme.ring
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }

  ctx.globalAlpha = 1
}

function labelAlphaFor(k: number, inFocus: boolean): number {
  const base = Math.max(0, Math.min(1, (k - LABEL_ZOOM_MIN) / LABEL_FADE_RANGE))

  return inFocus ? Math.max(base, 0.95) : base
}

function drawLabels(input: RenderInput, focus: Set<string> | null): void {
  const { ctx, nodes, theme, transform: t } = input

  ctx.font = theme.font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  for (const node of nodes) {
    if (node.x == null || node.y == null || node.label.length === 0) continue
    const inFocus = focus === null || focus.has(node.id)
    const alpha = labelAlphaFor(t.k, inFocus)
    if (alpha <= 0.02) continue

    const s = worldToScreen(t, nodePoint(node))
    const r = Math.max(nodeRadius(node.degree) * t.k, NODE_SCREEN_RADIUS_MIN)
    ctx.globalAlpha = alpha
    ctx.lineWidth = 3
    ctx.strokeStyle = theme.labelHalo
    const text = truncateLabel(node.label)
    ctx.strokeText(text, s.x, s.y + r + 4)
    ctx.fillStyle = theme.label
    ctx.fillText(text, s.x, s.y + r + 4)
  }

  ctx.globalAlpha = 1
}

/** Полный кадр графа: рёбра → узлы → подписи. */
export function renderGraph(input: RenderInput): void {
  const { ctx, width, height } = input
  ctx.clearRect(0, 0, width, height)

  const focus = focusSet(input.hoveredId, input.links)
  drawEdges(input, focus)
  drawNodes(input, focus)
  drawLabels(input, focus)
}
