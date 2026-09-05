import { EDGE_HIT_TOLERANCE, NODE_HIT_SLOP, NODE_SCREEN_RADIUS_MIN } from '../core/constants'
import { nodeRadius } from './render'
import type { SimLink, SimNode } from './simulation'
import { nodePoint, type Point, type ViewTransform, worldToScreen } from './view-transform'

/** Узел под точкой экрана (сверху вниз по порядку отрисовки). */
export function pickNode(
  nodes: readonly SimNode[],
  t: ViewTransform,
  screen: Point,
): SimNode | null {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i]
    if (node.x == null || node.y == null) continue

    const s = worldToScreen(t, nodePoint(node))
    const r = Math.max(nodeRadius(node.degree) * t.k, NODE_SCREEN_RADIUS_MIN) + NODE_HIT_SLOP
    const dx = screen.x - s.x
    const dy = screen.y - s.y
    if (dx * dx + dy * dy <= r * r) return node
  }

  return null
}

/** Ребро под точкой экрана; при нескольких — ближайшее. */
export function pickEdge(
  links: readonly SimLink[],
  t: ViewTransform,
  screen: Point,
): SimLink | null {
  let best: { link: SimLink; dist: number } | null = null

  for (const link of links) {
    if (link.source.x == null || link.target.x == null) continue
    const a = worldToScreen(t, nodePoint(link.source))
    const b = worldToScreen(t, nodePoint(link.target))
    const dist = distToSegment(screen, a, b)
    if (dist <= EDGE_HIT_TOLERANCE && (best === null || dist < best.dist)) {
      best = { link, dist }
    }
  }

  return best?.link ?? null
}

/** Расстояние от точки до отрезка AB. */
export function distToSegment(p: Point, a: Point, b: Point): number {
  const abx = b.x - a.x
  const aby = b.y - a.y
  const lengthSq = abx * abx + aby * aby
  if (lengthSq === 0) return Math.hypot(p.x - a.x, p.y - a.y)

  const t = Math.max(0, Math.min(1, ((p.x - a.x) * abx + (p.y - a.y) * aby) / lengthSq))

  return Math.hypot(p.x - (a.x + abx * t), p.y - (a.y + aby * t))
}
