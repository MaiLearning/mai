import { atom } from 'jotai'
import type { Directory } from '../core/model'

export const directoriesAtom = atom<Directory[]>([])
