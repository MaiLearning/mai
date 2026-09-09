import { atom } from 'jotai'
import type { UpdateSettingsInput } from '../core/model'
import { updateSettings } from '../services/update'
import { settingsAtom } from './atoms'

/** Частично обновляет настройки и возвращает итоговое значение. */
export const updateSettingsAtom = atom(null, async (_get, set, input: UpdateSettingsInput) => {
  const next = await updateSettings(input)
  set(settingsAtom, next)

  return next
})
