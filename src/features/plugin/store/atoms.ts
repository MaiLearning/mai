import { atom } from 'jotai'
import type { Plugin } from '../core/model'

/**
 * Плагины, зарегистрированные в рантайме приложения.
 * Не путать с `pluginsAtom` из entities/plugins — тот хранит записи из БД.
 */
export const runtimePluginsAtom = atom<Plugin[]>([])
