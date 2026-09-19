import { atom } from 'jotai'
import type { RuntimePlugin } from './model'

/**
 * Плагины, зарегистрированные в рантайме приложения.
 * Не путать с `pluginsAtom` из entities/plugins — тот хранит записи из БД.
 */
export const runtimePluginsAtom = atom<RuntimePlugin[]>([])
