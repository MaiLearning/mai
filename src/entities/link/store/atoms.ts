import { atom } from 'jotai'
import type { Link } from '../core/model'

/** Ссылки, сгруппированные по id курса (запись курса — список его ссылок). */
export const linksByCourseAtom = atom<Record<string, Link[]>>({})
