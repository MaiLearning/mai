import { atom } from 'jotai'
import { fetchSettings } from '../services/fetch'
import { settingsAtom } from './atoms'

/** Загружает настройки из api/ и кладёт в settingsAtom. */
export const loadSettingsAtom = atom(null, async (_get, set) => {
  const data = await fetchSettings()
  set(settingsAtom, data)
})
