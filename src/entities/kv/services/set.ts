import { sendKvSet } from '../api/set'
import { KvEntrySchema, KvKeySchema } from '../core/schema'

/** Сохранить значение (upsert). Возвращает итоговую запись. */
export async function setKvValue(key: string, value: unknown): Promise<void> {
  const resolvedKey = KvKeySchema.parse(key)
  const data = await sendKvSet(resolvedKey, value)
  KvEntrySchema.parse(data)
}
