import { useAtomValue } from 'jotai'
import { useHydrateAtoms } from 'jotai/react/utils'
import type { ReactNode } from 'react'
import { type SidebarDeps, sidebarDepsAtom } from './deps'

interface SidebarProviderProps {
  deps: SidebarDeps
  children: ReactNode
}

/**
 * SidebarProvider — точка внедрения зависимостей пакета.
 *
 * Гидрирует sidebarDepsAtom значениями хоста (api, ui, notify).
 * Должен располагаться в дереве выше <Sidebar> и любых компонентов пакета.
 * deps желательно передавать стабильные (memo), чтобы api не пересоздавался.
 */
export function SidebarProvider({ deps, children }: SidebarProviderProps) {
  useHydrateAtoms(new Map([[sidebarDepsAtom, deps]]))

  return <>{children}</>
}

/**
 * useSidebarDeps — доступ к внедрённым зависимостям внутри пакета.
 * Бросает ошибку, если провайдер не смонтирован.
 */
export function useSidebarDeps(): SidebarDeps {
  const deps = useAtomValue(sidebarDepsAtom)
  if (!deps) {
    throw new Error(
      'sidebar: зависимости не внедрены — оберните компоненты пакета в <SidebarProvider deps={...}>',
    )
  }

  return deps
}
