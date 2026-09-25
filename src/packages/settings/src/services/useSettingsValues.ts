import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { SettingsDefinition } from '../core/definition'
import type { SettingsDocument } from '../core/model'
import {
  cloneSettingsValues,
  loadSettingsDocument,
  resetSettingsDocument,
  type SettingsValues,
  saveSettingsValues,
  setSettingsValues,
  settingsDefaults,
  settingsDefinitionSignature,
  settingsDocumentFamily,
  settingsStateKey,
} from './settingsDocumentStore'

export type { SettingsDocumentState, SettingsValues } from './settingsDocumentStore'

/** Пауза автосохранения после последнего изменения значения, мс. */
export const SETTINGS_AUTOSAVE_DELAY = 400

export type UseSettingsValuesResult = {
  /** Значения пункта; до загрузки — дефолты определения. */
  values: SettingsValues
  document: SettingsDocument | null
  /** Значения соответствуют текущему определению: можно править и сбрасывать. */
  ready: boolean
  loading: boolean
  saving: boolean
  error: string | null
  /** Изменить одно значение: состояние сразу, запись — после паузы автосохранения. */
  setValue: (fieldKey: string, value: unknown) => void
  /** Сохранить полный набор значений немедленно. */
  saveValues: (values: SettingsValues) => Promise<boolean>
  /** Сбросить пункт: удалить документ и вернуться к дефолтам. */
  reset: () => Promise<void>
  canReset: boolean
}

/**
 * Доступ к значениям пункта настроек: загрузка по определению, правка значений
 * с автосохранением и сброс. Состояние живёт по ключу `domain:itemId`, поэтому
 * все потребители пункта видят одни и те же значения.
 */
export function useSettingsValues(
  definition: SettingsDefinition,
  domain: SettingsDocument['domain'],
  itemId: string,
  autoLoad = true,
): UseSettingsValuesResult {
  const key = settingsStateKey(domain, itemId)
  const signature = useMemo(() => settingsDefinitionSignature(definition), [definition])
  const stateAtom = useMemo(() => settingsDocumentFamily(key), [key])
  const state = useAtomValue(stateAtom)
  const ready = state.signature === signature

  useEffect(() => {
    if (autoLoad) void loadSettingsDocument(key, definition, domain, itemId)
  }, [autoLoad, definition, domain, itemId, key])

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingValues = useRef<SettingsValues | null>(null)

  const cancelPending = useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current)
      timer.current = null
    }
    pendingValues.current = null
  }, [])

  const flushPending = useCallback(() => {
    const values = pendingValues.current
    cancelPending()
    if (values) void saveSettingsValues(key, definition, domain, itemId, values)
  }, [cancelPending, definition, domain, itemId, key])

  // Незаписанное изменение дописывается при уходе со страницы или смене пункта.
  useEffect(() => () => flushPending(), [flushPending])

  const saveValues = useCallback(
    (values: SettingsValues) => {
      cancelPending()

      return saveSettingsValues(key, definition, domain, itemId, values)
    },
    [cancelPending, definition, domain, itemId, key],
  )

  const setValue = useCallback(
    (fieldKey: string, value: unknown) => {
      if (!ready) return
      const next = { ...cloneSettingsValues(state.values), [fieldKey]: value }
      setSettingsValues(key, signature, next)
      pendingValues.current = next
      if (timer.current !== null) clearTimeout(timer.current)
      timer.current = setTimeout(flushPending, SETTINGS_AUTOSAVE_DELAY)
    },
    [flushPending, key, ready, signature, state.values],
  )

  const reset = useCallback(async () => {
    cancelPending()
    await resetSettingsDocument(key, definition, domain, itemId)
  }, [cancelPending, definition, domain, itemId, key])

  return {
    values: ready ? state.values : settingsDefaults(definition),
    document: state.document,
    ready,
    loading: state.loading,
    saving: state.saving,
    error: state.error,
    setValue,
    saveValues,
    reset,
    canReset: state.document !== null,
  }
}
