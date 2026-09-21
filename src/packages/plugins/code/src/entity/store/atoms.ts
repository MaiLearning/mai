import { atom } from 'jotai'
import type { CodeContentData } from '../core/model'

/** Снапшоты контента кода по id ресурса. */
export const codeSnapshotsAtom = atom<Record<string, CodeContentData>>({})
