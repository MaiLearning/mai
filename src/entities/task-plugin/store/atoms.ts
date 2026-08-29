import { atom } from 'jotai'
import type { TaskContentData } from '../core/model'

export const taskContentsAtom = atom<TaskContentData[]>([])
