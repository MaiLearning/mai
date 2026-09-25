import { z } from 'zod'

/** Режим приложения. */
export const AppModeSchema = z.enum(['development', 'production', 'release'])
export type AppMode = z.infer<typeof AppModeSchema>

export const DatabaseSettingsSchema = z
  .object({
    path: z.string().min(1),
    max_connections: z.number().int().positive().max(0xffffffff),
  })
  .transform((value) => ({
    path: value.path,
    maxConnections: value.max_connections,
  }))

/** Секция `[mode.<name>]` — настройки, применяемые в режиме. */
const ModeSettingsSchema = z
  .object({
    debug: z.boolean().default(false),
    fake_data: z.boolean().default(false),
    hot_reload: z.boolean().default(false),
    database: DatabaseSettingsSchema,
  })
  .transform((value) => ({
    debug: value.debug,
    fakeData: value.fake_data,
    hotReload: value.hot_reload,
    database: value.database,
  }))

export type ModeConfig = z.infer<typeof ModeSettingsSchema>

/** Точно валидируемая часть конфига: без секций режимов (их распарсиваю отдельно). */
const ProjectMetaSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(1),
    description: z.string().default(''),
    mode: z.object({
      default: AppModeSchema,
      available: z.array(AppModeSchema).min(1),
    }),
  })
  .superRefine((value, ctx) => {
    if (!value.mode.available.includes(value.mode.default)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mode', 'available'],
        message: 'available должен содержать default',
      })
    }
  })

/** Единый конфиг проекта: метаданные + настройки по всем режимам. */
export interface AppConfig {
  name: string
  version: string
  description: string
  /** Активный режим — из `[mode].default`. */
  mode: AppMode
  /** Настройки активного режима. */
  modeConfig: ModeConfig
  /** Настройки всех режимов из `available`. */
  modes: Record<AppMode, ModeConfig>
}

/**
 * Распарсить сырое значение (JSON из `mai.toml`) в типизированный конфиг.
 * Секции режимов — `[mode.<имя>]` — собираются по `available`;
 * каждая доступная секция должна содержать обязательную базу данных.
 * Неизвестные ключи внутри секций не ломают парсинг (поле для расширения).
 */
export function parseAppConfig(raw: unknown): AppConfig {
  const meta = ProjectMetaSchema.parse(raw)

  const rawModeTable = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<
    string,
    unknown
  >
  const modeTable =
    typeof rawModeTable.mode === 'object' && rawModeTable.mode !== null
      ? (rawModeTable.mode as Record<string, unknown>)
      : {}

  const modes = {} as Record<AppMode, ModeConfig>
  for (const name of meta.mode.available) {
    modes[name] = ModeSettingsSchema.parse(modeTable[name] ?? {})
  }

  return {
    name: meta.name,
    version: meta.version,
    description: meta.description,
    mode: meta.mode.default,
    modes,
    modeConfig: modes[meta.mode.default],
  }
}
