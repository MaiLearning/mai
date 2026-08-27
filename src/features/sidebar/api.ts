import type { SidebarApi, SidebarNode } from '@mai/sidebar'
import { createDirectory, renameDirectory } from '@/entities/directory/services'
import type { StructureNodeFlat } from '@/entities/structure/core/model'
import {
  createResourceInStructure,
  deleteNode,
  fetchStructure,
  moveNode,
} from '@/entities/structure/services'

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
    return toSidebarNode(await createDirectory({ courseId, name, parentId }))
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
