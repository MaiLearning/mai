import { error as logError } from '@mai/tauri/logs'
import { atom, getDefaultStore } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { sendSettingsDelete, sendSettingsGet, sendSettingsUpdate } from '../api'
import type { SettingsDefinition } from '../core/definition'
import { createDefaultDocument, documentToValues, valuesToSettings } from '../core/documentAdapter'
import type { SettingsDocument } from '../core/model'
import { parseSettingsDocument } from '../core/schema'

/** Значения полей пункта настроек: `{ [ключ поля]: значение }`. */
export type SettingsValues = Record<string, unknown>

/** Состояние документа пункта настроек — общее для всех потребителей пункта. */
export type SettingsDocumentState = {
  /** Документ пункта; null — пункт ещё не загружен. */
  document: SettingsDocument | null
  /** Текущие значения, включая несохранённые (правит форма). */
  values: SettingsValues
  /** Подпись определения, по которой получены значения; null — ещё не загружено. */
  signature: string | null
  loading: boolean
  saving: boolean
  error: string | null
}

const store = getDefaultStore()

/** Состояние по ключу `domain:itemId`. */
export const settingsDocumentFamily = atomFamily((_key: string) =>
  atom<SettingsDocumentState>({
    document: null,
    values: {},
    signature: null,
    loading: false,
    saving: false,
    error: null,
  }),
)

/** Ключ состояния: домен и пункт настроек. */
export function settingsStateKey(domain: string, itemId: string): string {
  return `${domain}:${itemId}`
}

/** Подпись определения: смена JSON Schema делает загруженные значения неактуальными. */
export function settingsDefinitionSignature(definition: SettingsDefinition): string {
  return JSON.stringify(definition.jsonSchema)
}

export function cloneSettingsValues(values: SettingsValues): SettingsValues {
  return JSON.parse(JSON.stringify(values)) as SettingsValues
}

/** Дефолтные значения определения. */
export function settingsDefaults(definition: SettingsDefinition): SettingsValues {
  return cloneSettingsValues(definition.defaults as SettingsValues)
}

export function settingsErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

/** Текущее состояние пункта (вне React). */
export function readSettingsState(key: string): SettingsDocumentState {
  return store.get(settingsDocumentFamily(key))
}

function patchSettingsState(key: string, patch: Partial<SettingsDocumentState>): void {
  const stateAtom = settingsDocumentFamily(key)
  store.set(stateAtom, { ...store.get(stateAtom), ...patch })
}

/**
 * Значения из документа: отсутствующие поля берутся из дефолтов определения.
 * Несовместимый со схемой документ — дефолты и текст ошибки.
 */
function adaptDocument(
  document: SettingsDocument,
  definition: SettingsDefinition,
): { values: SettingsValues; error: string | null } {
  try {
    return { values: cloneSettingsValues(documentToValues(document, definition)), error: null }
  } catch (e) {
    return { values: settingsDefaults(definition), error: settingsErrorMessage(e) }
  }
}

/** Значения документа с откатом на дефолты определения. */
function valuesOf(
  document: SettingsDocument | null,
  definition: SettingsDefinition,
): SettingsValues {
  return document ? adaptDocument(document, definition).values : settingsDefaults(definition)
}

const loadRequests = new Map<string, Promise<void>>()

/**
 * Загрузить пункт настроек: чтение документа, адаптация к определению и запись
 * в общее состояние. Повторный вызов для той же подписи определения — no-op,
 * параллельные вызовы переиспользуют один запрос.
 */
export function loadSettingsDocument(
  key: string,
  definition: SettingsDefinition,
  domain: SettingsDocument['domain'],
  itemId: string,
): Promise<void> {
  const signature = settingsDefinitionSignature(definition)
  if (readSettingsState(key).signature === signature) return Promise.resolve()
  const existing = loadRequests.get(key)
  if (existing) return existing

  const request = (async () => {
    patchSettingsState(key, { loading: true, error: null })

    try {
      const raw = await sendSettingsGet(domain, itemId)
      const document =
        raw === null
          ? createDefaultDocument(domain, itemId, definition)
          : parseSettingsDocument(raw)
      if (document.domain !== domain || document.itemId !== itemId) {
        throw new Error('Документ настроек принадлежит другому пункту')
      }

      const adapted = adaptDocument(document, definition)
      patchSettingsState(key, {
        document,
        values: adapted.values,
        signature,
        loading: false,
        error: adapted.error,
      })
    } catch (e) {
      const message = settingsErrorMessage(e)
      logError(`Не удалось загрузить настройки '${key}': ${message}`)
      patchSettingsState(key, { loading: false, error: message })
    } finally {
      loadRequests.delete(key)
    }
  })()

  loadRequests.set(key, request)

  return request
}

const writeQueues = new Map<string, Promise<unknown>>()

/** Последовательные записи по одному пункту: очередь исключает гонку сохранений. */
function enqueueSettingsWrite<T>(key: string, operation: () => Promise<T>): Promise<T> {
  const previous = writeQueues.get(key) ?? Promise.resolve()
  const next = previous.catch(() => undefined).then(operation)
  writeQueues.set(key, next)

  return next
}

/** Локальное изменение значений пункта: сразу в состояние, без записи на бэкенд. */
export function setSettingsValues(key: string, signature: string, values: SettingsValues): void {
  if (readSettingsState(key).signature !== signature) return

  patchSettingsState(key, { values: cloneSettingsValues(values), error: null })
}

/**
 * Сохранить значения пункта. На бэкенд уходит полная замена документа: значения
 * проверяются схемой определения, собираются в self-describing payload и
 * нормализуются бэкендом. Ошибка записи откатывает значения к документу.
 */
export function saveSettingsValues(
  key: string,
  definition: SettingsDefinition,
  domain: SettingsDocument['domain'],
  itemId: string,
  values: SettingsValues,
): Promise<boolean> {
  const signature = settingsDefinitionSignature(definition)
  const parsed = definition.schema.safeParse(values)
  if (!parsed.success) return Promise.resolve(false)

  const parsedValues = cloneSettingsValues(parsed.data as SettingsValues)
  patchSettingsState(key, { values: parsedValues, saving: true, error: null })

  return enqueueSettingsWrite(key, async () => {
    try {
      const raw = await sendSettingsUpdate(
        domain,
        itemId,
        valuesToSettings(parsedValues, definition),
      )
      const saved = parseSettingsDocument(raw)
      const adapted = adaptDocument(saved, definition)
      patchSettingsState(key, {
        document: saved,
        values: adapted.values,
        signature,
        loading: false,
        saving: false,
        error: adapted.error,
      })

      return true
    } catch (e) {
      const message = settingsErrorMessage(e)
      patchSettingsState(key, {
        values: valuesOf(readSettingsState(key).document, definition),
        saving: false,
        error: message,
      })

      return false
    }
  })
}

/** Сбросить пункт: удалить документ на бэкенде и вернуться к дефолтам определения. */
export function resetSettingsDocument(
  key: string,
  definition: SettingsDefinition,
  domain: SettingsDocument['domain'],
  itemId: string,
): Promise<boolean> {
  const signature = settingsDefinitionSignature(definition)
  patchSettingsState(key, { values: settingsDefaults(definition), saving: true, error: null })

  return enqueueSettingsWrite(key, async () => {
    try {
      await sendSettingsDelete(domain, itemId)
      patchSettingsState(key, {
        document: createDefaultDocument(domain, itemId, definition),
        values: settingsDefaults(definition),
        signature,
        saving: false,
        error: null,
      })

      return true
    } catch (e) {
      const message = settingsErrorMessage(e)
      patchSettingsState(key, {
        values: valuesOf(readSettingsState(key).document, definition),
        saving: false,
        error: message,
      })

      return false
    }
  })
}
