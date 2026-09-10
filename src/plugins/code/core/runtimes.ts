import { z } from 'zod'

/**
 * Конфигурация рантаймов Code-плагина — хранится в app_kv под ключом
 * RUNTIMES_KEY. Значение — путь до исполняемого файла интерпретатора
 * на машине пользователя; null/пустая строка = рантайм не настроен.
 */
export const RUNTIMES_KEY = 'code-plugin/runtimes'

export const RuntimesConfigSchema = z.object({
  python: z.string().nullable(),
  javascript: z.string().nullable(),
})

export type RuntimesConfig = z.infer<typeof RuntimesConfigSchema>

/** Пустая конфигурация: ни один рантайм не настроен. */
export const EMPTY_RUNTIMES: RuntimesConfig = {
  python: null,
  javascript: null,
}

/** Нормализация значения из kv: отсутствие/битость полей трактуем как «не настроен». */
export function parseRuntimesConfig(raw: unknown): RuntimesConfig {
  const parsed = RuntimesConfigSchema.safeParse(raw)
  if (!parsed.success) return EMPTY_RUNTIMES

  const trimmed = (value: string | null) => {
    const s = value?.trim() ?? ''

    return s === '' ? null : s
  }

  return {
    python: trimmed(parsed.data.python),
    javascript: trimmed(parsed.data.javascript),
  }
}
