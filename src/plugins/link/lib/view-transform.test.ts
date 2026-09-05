import { describe, expect, it } from 'vitest'
import { easeTransform, fitTransform, screenToWorld, worldToScreen, zoomAt } from './view-transform'

const T = { x: 100, y: 50, k: 2 }

describe('worldToScreen / screenToWorld', () => {
  it('переводит мировые координаты в экранные и обратно', () => {
    const world = { x: 10, y: -5 }
    const screen = worldToScreen(T, world)
    expect(screen).toEqual({ x: 120, y: 40 })
    expect(screenToWorld(T, screen)).toEqual(world)
  })
})

describe('zoomAt', () => {
  it('точка под курсором остаётся под курсором', () => {
    const focal = { x: 300, y: 200 }
    const worldBefore = screenToWorld(T, focal)
    const next = zoomAt(T, focal, 1.5)

    expect(next.k).toBe(3)
    const worldAfter = screenToWorld(next, focal)
    expect(worldAfter.x).toBeCloseTo(worldBefore.x)
    expect(worldAfter.y).toBeCloseTo(worldBefore.y)
  })

  it('ограничивает масштаб снизу и сверху', () => {
    const focal = { x: 0, y: 0 }
    expect(zoomAt({ x: 0, y: 0, k: 0.01 }, focal, 0.5).k).toBeGreaterThan(0.01 * 0.5 - 1e-9)
    expect(zoomAt({ x: 0, y: 0, k: 100 }, focal, 10).k).toBeLessThanOrEqual(4)
  })
})

describe('fitTransform', () => {
  it('центрирует bbox узлов и оставляет отступы', () => {
    const nodes = [
      { x: -100, y: -100 },
      { x: 100, y: 100 },
    ]
    const viewport = { width: 1000, height: 800 }
    const t = fitTransform(nodes, viewport)

    expect(t.k).toBeLessThanOrEqual((1000 - 128) / 200)
    // центр bbox (0,0) → центр вьюпорта
    const center = worldToScreen(t, { x: 0, y: 0 })
    expect(center.x).toBeCloseTo(500)
    expect(center.y).toBeCloseTo(400)
  })

  it('на пустом наборе возвращает идентичный трансформ', () => {
    expect(fitTransform([], { width: 500, height: 500 })).toEqual({ x: 0, y: 0, k: 1 })
  })
})

describe('easeTransform', () => {
  it('делает шаг к цели и завершается на цели', () => {
    const current = { x: 0, y: 0, k: 1 }
    const target = { x: 100, y: 100, k: 2 }

    const step = easeTransform(current, target)
    expect(step.next.x).toBeGreaterThan(0)
    expect(step.next.x).toBeLessThan(100)
    expect(step.done).toBe(false)

    let state = current
    for (let i = 0; i < 100; i++) {
      state = easeTransform(state, target).next
    }
    expect(state).toEqual(target)
  })
})
