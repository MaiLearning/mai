import { atom } from 'jotai'
import type { Resource, ResourceType } from '../core/model'

export const resourcesAtom = atom<Resource[]>([])
export const resourceTypesAtom = atom<ResourceType[]>([])
