import { atom } from 'jotai'
import type { TheoryContent } from '../core/model'

export const theoryContentsAtom = atom<TheoryContent[]>([])
