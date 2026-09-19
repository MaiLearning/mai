import { warn } from '@mai/tauri/logs'
import { atom } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type ChangedEventAppliers, createEventDispatcher } from './dispatcher'

vi.mock('@mai/tauri/logs', () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
}))

// Шпионы-аплаеры: диспетчер вызывает их через атомы-обёртки (defaultStore.set)
const spies = {
  course: vi.fn(),
  structure: vi.fn(),
  directory: vi.fn(),
  resource: vi.fn(),
  resourceType: vi.fn(),
  plugin: vi.fn(),
  link: vi.fn(),
}

const appliers: ChangedEventAppliers = {
  course: atom(null, spies.course),
  structure: atom(null, spies.structure),
  directory: atom(null, spies.directory),
  resource: atom(null, spies.resource),
  resourceType: atom(null, spies.resourceType),
  plugin: atom(null, spies.plugin),
  link: atom(null, spies.link),
}

const dispatchChangedEvent = createEventDispatcher(appliers)

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
  spies.link.mockClear()
})

describe('createEventDispatcher', () => {
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

  it('маршрутизирует событие link по entity', () => {
    dispatchChangedEvent({ ...baseEvent, entity: 'link', id: 'link-1', courseId: 'course-1' })

    expect(spies.link).toHaveBeenCalledTimes(1)
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
