import { atom } from 'jotai'
import type { StructureNodeFlat } from '../core/model'

export const structureNodesAtom = atom<StructureNodeFlat[]>([])
