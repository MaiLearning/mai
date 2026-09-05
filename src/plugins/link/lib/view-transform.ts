import { FIT_PADDING, NODE_RADIUS_MAX, ZOOM_MAX, ZOOM_MIN } from '../core/constants'
import type { SimNode } from './simulation'

export type Point = { x: number; y: number }

/** Трансформ холста: screen = world * k + offset. */
export type ViewTransform = { x: number; y: number; k: number }

export const IDENTITY_TRANSFORM: ViewTransform = { x: 0, y: 0, k: 1 }

export function worldToScreen(t: ViewTransform, p: Point): Point {
  return { x: p.x * t.k + t.x, y: p.y * t.k + t.y }
}

export function screenToWorld(t: ViewTransform, p: Point): Point {
  return { x: (p.x - t.x) / t.k, y: (p.y - t.y) / t.k }
}

/** Точка из узла симуляции (координаты опциональны — guard остаётся у вызывающего). */
export function nodePoint(n: { x?: number | null; y?: number | null }): Point {
  return { x: n.x ?? 0, y: n.y ?? 0 }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Зум к точке экрана (курсору); factor > 1 — приближение. Мир под курсором остаётся под курсором. */
export function zoomAt(t: ViewTransform, focal: Point, factor: number): ViewTransform {
  const k = clamp(t.k * factor, ZOOM_MIN, ZOOM_MAX)
  const scale = k / t.k

  return { k, x: focal.x - (focal.x - t.x) * scale, y: focal.y - (focal.y - t.y) * scale }
}

/** Вписать bbox узлов (мировые координаты) в вьюпорт с отступом. */
export function fitTransform(
  nodes: readonly Pick<SimNode, 'x' | 'y'>[],
  viewport: { width: number; height: number },
): ViewTransform {
  const visible = nodes.filter((n) => n.x != null && n.y != null)
  if (visible.length === 0) return IDENTITY_TRANSFORM

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const node of visible) {
    minX = Math.min(minX, node.x! - NODE_RADIUS_MAX)
    minY = Math.min(minY, node.y! - NODE_RADIUS_MAX)
    maxX = Math.max(maxX, node.x! + NODE_RADIUS_MAX)
    maxY = Math.max(maxY, node.y! + NODE_RADIUS_MAX)
  }

  const innerWidth = Math.max(maxX - minX, 1)
  const innerHeight = Math.max(maxY - minY, 1)
  const k = clamp(
    Math.min(
      (viewport.width - FIT_PADDING * 2) / innerWidth,
      (viewport.height - FIT_PADDING * 2) / innerHeight,
    ),
    ZOOM_MIN,
    ZOOM_MAX,
  )

  return {
    k,
    x: viewport.width / 2 - ((minX + maxX) / 2) * k,
    y: viewport.height / 2 - ((minY + maxY) / 2) * k,
  }
}

const EASE_FACTOR = 0.22
const EPS_PX = 0.5
const EPS_K = 0.001

/** Плавный шаг к целевому трансформу (критическое демпфирование). */
export function easeTransform(
  current: ViewTransform,
  target: ViewTransform,
): { next: ViewTransform; done: boolean } {
  const next: ViewTransform = {
    x: current.x + (target.x - current.x) * EASE_FACTOR,
    y: current.y + (target.y - current.y) * EASE_FACTOR,
    k: current.k + (target.k - current.k) * EASE_FACTOR,
  }
  const done =
    Math.abs(target.x - next.x) < EPS_PX &&
    Math.abs(target.y - next.y) < EPS_PX &&
    Math.abs(target.k - next.k) < EPS_K

  return { next: done ? target : next, done }
}
