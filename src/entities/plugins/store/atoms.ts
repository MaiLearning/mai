import { atom } from 'jotai'
import type { Plugin } from '../core/model'

export const pluginsAtom = atom<Plugin[]>([])
