import { describe, expect, it } from 'vitest'
import { distToSegment, pickEdge, pickNode } from './picking'
import type { SimLink, SimNode } from './simulation'
import { IDENTITY_TRANSFORM } from './viewTransform'

function node(id: string, x: number, y: number, degree = 1): SimNode {
  return {
    id,
    kind: 'resource',
    nodeId: id,
    label: id,
    isCurrentCourse: false,
    degree,
    x,
    y,
  }
}

describe('pickNode', () => {
  const nodes = [node('a', 0, 0), node('b', 200, 200)]

  it('находит узел в радиусе', () => {
    expect(pickNode(nodes, IDENTITY_TRANSFORM, { x: 4, y: 0 })?.id).toBe('a')
  })

  it('не находит вне радиуса', () => {
    expect(pickNode(nodes, IDENTITY_TRANSFORM, { x: 20, y: 0 })).toBeNull()
  })

  it('учитывает масштаб: при отдалении радиус на экране сжимается до минимума', () => {
    const zoomedOut = { x: 0, y: 0, k: 0.05 }
    // 5px мир * 0.05 → на экране минимум 1.6 + допуск 3
    expect(pickNode(nodes, zoomedOut, { x: 100, y: 0 })).toBeNull()
  })
})

describe('pickEdge', () => {
  const a = node('a', 0, 0)
  const b = node('b', 300, 0)
  const link: SimLink = { id: 'l1', source: a, target: b, broken: false }

  it('находит ребро в допуске от середины', () => {
    expect(pickEdge([link], IDENTITY_TRANSFORM, { x: 150, y: 5 })?.id).toBe('l1')
    expect(pickEdge([link], IDENTITY_TRANSFORM, { x: 150, y: 20 })).toBeNull()
  })

  it('из двух рёбер выбирает ближайшее', () => {
    const c = node('c', 300, 40)
    const second: SimLink = { id: 'l2', source: b, target: c, broken: false }
    const hit = pickEdge([link, second], IDENTITY_TRANSFORM, { x: 295, y: 20 })
    expect(hit?.id).toBe('l2')
  })
})

describe('distToSegment', () => {
  it('считает перпендикуляр внутри отрезка', () => {
    expect(distToSegment({ x: 5, y: 3 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(3)
  })

  it('за концами отрезка — расстояние до конца', () => {
    expect(distToSegment({ x: 15, y: 0 }, { x: 0, y: 0 }, { x: 10, y: 0 })).toBe(5)
  })

  it('нулевой отрезок — расстояние до точки', () => {
    expect(distToSegment({ x: 3, y: 4 }, { x: 0, y: 0 }, { x: 0, y: 0 })).toBe(5)
  })
})
