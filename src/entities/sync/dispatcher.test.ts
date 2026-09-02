import { warn } from '@tauri-apps/plugin-log'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { dispatchChangedEvent } from './dispatcher'

vi.mock('@tauri-apps/plugin-log', () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
}))

// Мок-атомы с шпионами вместо реальных appliers сущностей
const spies = vi.hoisted(() => ({
  course: vi.fn(),
  structure: vi.fn(),
  directory: vi.fn(),
  resource: vi.fn(),
  resourceType: vi.fn(),
  plugin: vi.fn(),
}))

vi.mock('@/entities/course', async () => {
  const { atom } = await import('jotai')

  return { applyCourseChangeAtom: atom(null, spies.course) }
})
vi.mock('@/entities/structure', async () => {
  const { atom } = await import('jotai')

  return { applyStructureChangeAtom: atom(null, spies.structure) }
})
vi.mock('@/entities/directory', async () => {
  const { atom } = await import('jotai')

  return { applyDirectoryChangeAtom: atom(null, spies.directory) }
})
vi.mock('@/entities/resource', async () => {
  const { atom } = await import('jotai')

  return {
    applyResourceChangeAtom: atom(null, spies.resource),
    applyResourceTypeChangeAtom: atom(null, spies.resourceType),
  }
})
vi.mock('@/entities/plugins', async () => {
  const { atom } = await import('jotai')

  return { applyPluginChangeAtom: atom(null, spies.plugin) }
})

const baseEvent = {
  entity: 'course',
  action: 'updated',
  id: 'course-1',
  courseId: null,
  origin: 'http',
  timestamp: 1756800000000,
} as const

beforeEach(() => {
  spies.course.mockClear()
  spies.structure.mockClear()
  spies.directory.mockClear()
  spies.resource.mockClear()
  spies.resourceType.mockClear()
  spies.plugin.mockClear()
})

describe('dispatchChangedEvent', () => {
  it('маршрутизирует http-событие в applier нужной сущности', () => {
    dispatchChangedEvent(baseEvent)

    expect(spies.course).toHaveBeenCalledTimes(1)
    // write-atom вызывается как (get, set, event)
    expect(spies.course.mock.calls[0][2]).toEqual(baseEvent)
    expect(spies.structure).not.toHaveBeenCalled()
    expect(spies.directory).not.toHaveBeenCalled()
  })

  it('маршрутизирует события structure и directory по entity', () => {
    dispatchChangedEvent({ ...baseEvent, entity: 'structure', courseId: 'course-1' })
    dispatchChangedEvent({ ...baseEvent, entity: 'directory', courseId: 'course-1' })

    expect(spies.structure).toHaveBeenCalledTimes(1)
    expect(spies.directory).toHaveBeenCalledTimes(1)
    expect(spies.course).not.toHaveBeenCalled()
  })

  it('маршрутизирует события resource, resourceType и plugin по entity', () => {
    dispatchChangedEvent({ ...baseEvent, entity: 'resource', id: 'res-1', courseId: 'course-1' })
    dispatchChangedEvent({ ...baseEvent, entity: 'resourceType', id: 'type-1' })
    dispatchChangedEvent({ ...baseEvent, entity: 'plugin', id: 'plg-1' })

    expect(spies.resource).toHaveBeenCalledTimes(1)
    expect(spies.resourceType).toHaveBeenCalledTimes(1)
    expect(spies.plugin).toHaveBeenCalledTimes(1)
    expect(spies.course).not.toHaveBeenCalled()
  })

  it('маршрутизирует resource-событие и без courseId (guard — дело applier)', () => {
    dispatchChangedEvent({ ...baseEvent, entity: 'resource', id: 'res-1', courseId: null })

    expect(spies.resource).toHaveBeenCalledTimes(1)
  })

  it('игнорирует ipc-событие (фронт уже обновил сторы сам)', () => {
    dispatchChangedEvent({ ...baseEvent, origin: 'ipc' })

    expect(spies.course).not.toHaveBeenCalled()
    expect(spies.structure).not.toHaveBeenCalled()
    expect(spies.directory).not.toHaveBeenCalled()
    expect(warn).not.toHaveBeenCalled()
  })

  it('игнорирует битый payload с warn', () => {
    dispatchChangedEvent({ foo: 'bar' })

    expect(warn).toHaveBeenCalledTimes(1)
    expect(spies.course).not.toHaveBeenCalled()
    expect(spies.structure).not.toHaveBeenCalled()
    expect(spies.directory).not.toHaveBeenCalled()
  })

  it('игнорирует неизвестную entity с warn', () => {
    dispatchChangedEvent({ ...baseEvent, entity: 'widget' })

    expect(warn).toHaveBeenCalledTimes(1)
    expect(spies.course).not.toHaveBeenCalled()
    expect(spies.structure).not.toHaveBeenCalled()
    expect(spies.directory).not.toHaveBeenCalled()
  })
})
