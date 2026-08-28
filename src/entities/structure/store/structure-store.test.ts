import { createStore } from 'jotai'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDirectory } from '../../directory/services/create'
import { renameDirectory } from '../../directory/services/update'
import { createResourceInStructure } from '../services/create'
import { deleteNode } from '../services/delete'
import { fetchStructure } from '../services/fetch'
import { moveNode } from '../services/update'
import {
  canRedoAtom,
  canUndoAtom,
  createDirectoryAtom,
  createResourceAtom,
  deleteNodeAtom,
  loadStructureAtom,
  moveNodeAtom,
  redoStructureAtom,
  renameNodeAtom,
  structureNodesAtom,
  undoStructureAtom,
} from './index'

vi.mock('@tauri-apps/plugin-log', () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  trace: vi.fn(),
}))
vi.mock('../services/fetch', () => ({ fetchStructure: vi.fn() }))
vi.mock('../services/create', () => ({ createResourceInStructure: vi.fn() }))
vi.mock('../services/delete', () => ({ deleteNode: vi.fn() }))
vi.mock('../services/update', () => ({ moveNode: vi.fn() }))
vi.mock('../../directory/services/create', () => ({ createDirectory: vi.fn() }))
vi.mock('../../directory/services/update', () => ({ renameDirectory: vi.fn() }))
vi.mock('../../directory/services/delete', () => ({ deleteDirectory: vi.fn() }))
vi.mock('../../directory/services/fetch', () => ({ fetchDirectories: vi.fn() }))

const invokeFetch = vi.mocked(fetchStructure)
const invokeMove = vi.mocked(moveNode)
const invokeDelete = vi.mocked(deleteNode)
const invokeCreateResource = vi.mocked(createResourceInStructure)
const invokeCreateDirectory = vi.mocked(createDirectory)
const invokeRename = vi.mocked(renameDirectory)

const folder = {
  id: 'folder-1',
  courseId: 'course-1',
  parentId: null,
  position: 0,
  isDirectory: true,
  resource: null,
  directoryId: 'dir-1',
  name: 'Папка',
}
const resourceNode = {
  id: 'node-1',
  courseId: 'course-1',
  parentId: null,
  position: 1,
  isDirectory: false,
  resource: {
    id: 'res-1',
    courseId: 'course-1',
    typeKey: null,
    name: 'Ресурс',
    metadata: null,
    files: [],
    createdAt: 1,
    updatedAt: 1,
  },
  directoryId: null,
  name: 'Тема',
}
const child = {
  id: 'node-2',
  courseId: 'course-1',
  parentId: 'folder-1',
  position: 0,
  isDirectory: false,
  resource: null,
  directoryId: null,
  name: 'Вложенный',
}

async function load(store: ReturnType<typeof createStore>) {
  invokeFetch.mockResolvedValue([folder, resourceNode, child])
  await store.set(loadStructureAtom, 'course-1')
}

describe('structure store', () => {
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    invokeFetch.mockReset()
    invokeMove.mockReset()
    invokeDelete.mockReset()
    invokeCreateResource.mockReset()
    invokeCreateDirectory.mockReset()
    invokeRename.mockReset()
  })

  describe('load', () => {
    it('собирает плоскую проекцию из дерева', async () => {
      await load(store)

      // toNodes() обходит дерево вглубину: folder → его ребёнок → resource
      expect(store.get(structureNodesAtom)).toEqual([
        { ...folder, position: 0 },
        { ...child, position: 0 },
        { ...resourceNode, position: 1 },
      ])
      expect(store.get(canUndoAtom)).toBe(false)
      expect(store.get(canRedoAtom)).toBe(false)
    })

    it('очищает историю при повторной загрузке', async () => {
      await load(store)
      invokeMove.mockResolvedValue(undefined)
      await store.set(moveNodeAtom, { nodeId: 'node-1', newParentId: 'folder-1', position: 0 })
      expect(store.get(canUndoAtom)).toBe(true)

      await store.set(loadStructureAtom, 'course-1')

      expect(store.get(canUndoAtom)).toBe(false)
    })
  })

  describe('move', () => {
    it('оптимистично перемещает узел и сохраняет payload', async () => {
      await load(store)
      invokeMove.mockResolvedValue(undefined)

      await store.set(moveNodeAtom, { nodeId: 'node-1', newParentId: 'folder-1', position: 1 })

      const nodes = store.get(structureNodesAtom)
      const moved = nodes.find((node) => node.id === 'node-1')
      expect(moved?.parentId).toBe('folder-1')
      expect(moved?.position).toBe(1)
      // Инвариант: дерево владеет только name/parentId/position,
      // payload (resource, courseId, directoryId) сохраняется из оригинала
      expect(moved?.resource).toEqual(resourceNode.resource)
      expect(moved?.courseId).toBe('course-1')
      expect(invokeMove).toHaveBeenCalledWith('node-1', 'folder-1', 1)
      expect(store.get(canUndoAtom)).toBe(true)
    })

    it('откатывает перемещение при ошибке backend', async () => {
      await load(store)
      invokeMove.mockResolvedValue(undefined)
      await store.set(moveNodeAtom, { nodeId: 'node-1', newParentId: 'folder-1', position: 1 })
      const afterFirstMove = store.get(structureNodesAtom)

      invokeMove.mockRejectedValueOnce(new Error('boom'))
      await expect(
        store.set(moveNodeAtom, { nodeId: 'node-2', newParentId: null, position: 2 }),
      ).rejects.toThrow('boom')

      expect(store.get(structureNodesAtom)).toEqual(afterFirstMove)
    })

    it('undo/redo перемещения работают backend-first', async () => {
      await load(store)
      invokeMove.mockResolvedValue(undefined)
      await store.set(moveNodeAtom, { nodeId: 'node-1', newParentId: 'folder-1', position: 1 })
      invokeMove.mockClear()

      await store.set(undoStructureAtom)

      expect(invokeMove).toHaveBeenCalledWith('node-1', null, 1)
      expect(store.get(structureNodesAtom).find((n) => n.id === 'node-1')?.parentId).toBeNull()
      expect(store.get(canRedoAtom)).toBe(true)

      await store.set(redoStructureAtom)

      expect(invokeMove).toHaveBeenLastCalledWith('node-1', 'folder-1', 1)
      expect(store.get(structureNodesAtom).find((n) => n.id === 'node-1')?.parentId).toBe(
        'folder-1',
      )
    })
  })

  describe('rename', () => {
    it('оптимистично переименовывает узел через directory-сервис', async () => {
      await load(store)
      invokeRename.mockResolvedValue(undefined)

      await store.set(renameNodeAtom, { nodeId: 'folder-1', name: 'Новое имя' })

      expect(invokeRename).toHaveBeenCalledWith('folder-1', 'Новое имя')
      expect(store.get(structureNodesAtom).find((n) => n.id === 'folder-1')?.name).toBe('Новое имя')
    })

    it('откатывает переименование при ошибке backend', async () => {
      await load(store)
      invokeRename.mockRejectedValueOnce(new Error('boom'))

      await expect(store.set(renameNodeAtom, { nodeId: 'folder-1', name: 'X' })).rejects.toThrow(
        'boom',
      )

      expect(store.get(structureNodesAtom).find((n) => n.id === 'folder-1')?.name).toBe('Папка')
      expect(store.get(canUndoAtom)).toBe(false)
    })
  })

  describe('create', () => {
    it('создаёт папку backend-first и добавляет в дерево', async () => {
      await load(store)
      const created = {
        ...folder,
        id: 'folder-2',
        name: 'Новая папка',
        parentId: null,
        position: 2,
      }
      invokeCreateDirectory.mockResolvedValue(created)

      const result = await store.set(createDirectoryAtom, {
        courseId: 'course-1',
        name: 'Новая папка',
        parentId: null,
      })

      expect(result).toEqual(created)
      expect(store.get(structureNodesAtom)).toContainEqual(created)
      expect(store.get(canUndoAtom)).toBe(true)
    })

    it('undo создания удаляет узел через backend', async () => {
      await load(store)
      const created = {
        ...folder,
        id: 'folder-2',
        name: 'Новая папка',
        parentId: null,
        position: 2,
      }
      invokeCreateDirectory.mockResolvedValue(created)
      await store.set(createDirectoryAtom, {
        courseId: 'course-1',
        name: 'Новая папка',
        parentId: null,
      })
      invokeDelete.mockResolvedValue(undefined)

      await store.set(undoStructureAtom)

      expect(invokeDelete).toHaveBeenCalledWith('folder-2')
      expect(store.get(structureNodesAtom)).not.toContainEqual(created)
    })

    it('падение backend не меняет дерево', async () => {
      await load(store)
      const before = store.get(structureNodesAtom)
      invokeCreateResource.mockRejectedValue(new Error('boom'))

      await expect(
        store.set(createResourceAtom, { courseId: 'course-1', name: 'Р', parentId: null }),
      ).rejects.toThrow('boom')

      expect(store.get(structureNodesAtom)).toEqual(before)
      expect(store.get(canUndoAtom)).toBe(false)
    })
  })

  describe('delete', () => {
    it('оптимистично удаляет узел, undo отклоняется (ограничение backend)', async () => {
      await load(store)
      invokeDelete.mockResolvedValue(undefined)

      await store.set(deleteNodeAtom, 'node-1')

      expect(invokeDelete).toHaveBeenCalledWith('node-1')
      expect(store.get(structureNodesAtom).find((n) => n.id === 'node-1')).toBeUndefined()
      expect(store.get(canUndoAtom)).toBe(true)

      await expect(store.set(undoStructureAtom)).rejects.toThrow(
        'Не удалось отменить действие на сервере',
      )
      // Дерево не тронуто: узел так и остался удалённым
      expect(store.get(structureNodesAtom).find((n) => n.id === 'node-1')).toBeUndefined()
    })

    it('откатывает удаление при ошибке backend', async () => {
      await load(store)
      invokeDelete.mockRejectedValueOnce(new Error('boom'))

      await expect(store.set(deleteNodeAtom, 'node-1')).rejects.toThrow('boom')

      expect(store.get(structureNodesAtom).find((n) => n.id === 'node-1')).toBeDefined()
      expect(store.get(canUndoAtom)).toBe(false)
    })
  })
})
