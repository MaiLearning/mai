import { atom } from 'jotai'
import type { Node } from './tree/core/types'

// ================================================================
//  Данные
// ================================================================

/**
 * SidebarApi — контракт доступа к структуре курса, который хост внедряет
 * через <SidebarProvider>. Пакет не знает ни о Tauri IPC, ни о zod-схемах:
 * конвертация DTO бэкенда во внутренний Node — обязанность хоста.
 */
export interface SidebarApi {
  fetchStructure(courseId: string): Promise<SidebarNode[]>
  createDirectory(courseId: string, name: string, parentId: string | null): Promise<SidebarNode>
  createResource(
    courseId: string,
    name: string,
    parentId: string | null,
    typeKey?: string | null,
  ): Promise<SidebarNode>
  renameDirectory(id: string, name: string): Promise<void>
  deleteNode(id: string): Promise<void>
  moveNode(id: string, newParentId: string | null, position: number): Promise<void>
}

/**
 * SidebarNode — публичный псевдоним внутреннего Node дерева.
 * Формат: id/name/isFolder/resourceId/parentId/position.
 */
export type SidebarNode = Node

// ================================================================
//  Внедрение зависимостей (jotai)
// ================================================================

/**
 * SidebarDeps — всё, что пакет ожидает от хоста.
 * Передаётся один раз через <SidebarProvider deps={...}>.
 *
 * Пакет содержит только голую логику (Tree/Store/Service/History/hooks);
 * весь визуал (стили, UI-компоненты, уведомления, dnd) живёт в хосте
 * (app/mai/src/features/sidebar) и обращается к пакету через useTreeController.
 * Поэтому пакету от хоста нужен только SidebarApi.
 */
export interface SidebarDeps {
  api: SidebarApi
}

/**
 * sidebarDepsAtom — хранилище зависимостей пакета.
 * Гидрируется SidebarProvider'ом через useHydrateAtoms.
 */
export const sidebarDepsAtom = atom<SidebarDeps | null>(null)
