import type { SidebarApi, SidebarNode } from '@mai/sidebar'
import { createDirectory, renameDirectory } from '@/entities/directory/services'
import {
  createResourceInStructure,
  deleteNode,
  fetchStructure,
  moveNode,
} from '@/entities/structure/services'
import type { StructureNodeFlat } from '@/entities/structure/core/model'

/**
 * sidebarApi — реализация SidebarApi (контракт пакета @mai/sidebar)
 * поверх data-слоя app/mai (entities/structure + entities/directory).
 *
 * Конвертация DTO бэкенда (StructureNodeFlat) → SidebarNode пакета.
 * Пакет не знает ни про Tauri IPC, ни про zod — только SidebarNode.
 */

function toSidebarNode(node: StructureNodeFlat): SidebarNode {
  return {
    id: node.id,
    name: node.name,
    isFolder: node.isDirectory,
    resourceId: node.resource?.id ?? null,
    parentId: node.parentId,
    position: node.position,
  }
}

export const sidebarApi: SidebarApi = {
  async fetchStructure(courseId: string): Promise<SidebarNode[]> {
    const nodes = await fetchStructure(courseId)
    return nodes.map(toSidebarNode)
  },

  async createDirectory(courseId, name, parentId): Promise<SidebarNode> {
    const dir = await createDirectory({ courseId, name, parentId })
    /**
     * Сервис createDirectory возвращает Directory (без parentId/position),
     * поэтому позиция неизвестна — используем MAX_SAFE_INTEGER для вставки
     * в конец (Tree.insert через splice сам ограничит до длины массива).
     * Бэкенд вычисляет корректную позицию; при следующем fetch она исправится.
     */
    return {
      id: dir.id,
      name: dir.name,
      isFolder: true,
      resourceId: null,
      parentId,
      position: Number.MAX_SAFE_INTEGER,
    }
  },

  async createResource(courseId, name, parentId, typeKey): Promise<SidebarNode> {
    const node = await createResourceInStructure({
      courseId,
      name,
      parentId,
      typeKey: typeKey ?? null,
    })
    return toSidebarNode(node)
  },

  async renameDirectory(id, name): Promise<void> {
    await renameDirectory(id, name)
  },

  async deleteNode(id): Promise<void> {
    await deleteNode(id)
  },

  async moveNode(id, newParentId, position): Promise<void> {
    await moveNode(id, newParentId, position)
  },
}
