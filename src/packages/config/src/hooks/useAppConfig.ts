import { useAtomValue } from 'jotai'
import { appConfigAtom } from '../services/configStore'

/** Текущий конфиг проекта с подпиской на изменение mai.toml. */
export function useAppConfig() {
  return useAtomValue(appConfigAtom)
}
