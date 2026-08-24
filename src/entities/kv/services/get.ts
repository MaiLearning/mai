import { sendKvGet } from '../api/get'
import { KvKeySchema } from '../core/schema'

/**
 * Получить значение по ключу.
 * Отсутствующий ключ — не ошибка, возвращается null.
 * Значение приходит из БД без схемы — типизация на вызывающей стороне.
 */
export async function getKvValue<T = unknown>(key: string): Promise<T | null> {
  const resolvedKey = KvKeySchema.parse(key)
  const data = await sendKvGet(resolvedKey)
  return (data ?? null) as T | null
}
