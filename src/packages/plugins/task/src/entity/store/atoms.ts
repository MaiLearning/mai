import { atom } from 'jotai'
import type { TaskSnapshotData } from '../core/model'

/** Снапшоты контента задач по id ресурса. */
export const taskSnapshotsAtom = atom<Record<string, TaskSnapshotData>>({})
