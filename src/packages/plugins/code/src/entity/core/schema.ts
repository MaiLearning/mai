import { z } from 'zod'

// ─────────────────────────  Границы полей  ─────────────────────────

/** Заголовок шага: до 200 символов. Может быть пустым — имя отображается с фолбэком «Шаг N». */
export const MAX_TITLE_LENGTH = 200
/** Инструкция шага (простой текст): до 5000 символов. */
export const MAX_INSTRUCTIONS_LENGTH = 5000
/** Стартовый код, ожидаемый stdout и код ученика: до 100 000 символов. */
export const MAX_CODE_LENGTH = 100_000

// ─────────────────────────  Модель контента  ─────────────────────────

export const CodeLanguageSchema = z.enum(['python', 'javascript', 'rust'])

export const CodeStepSchema = z.object({
  id: z.string(),
  title: z.string().max(MAX_TITLE_LENGTH),
  /** Инструкция к шагу (простой текст). */
  instructions: z.string().max(MAX_INSTRUCTIONS_LENGTH),
  /** Стартовый код, подставляемый в редактор ученику. */
  starterCode: z.string().max(MAX_CODE_LENGTH),
  /** Ожидаемый stdout; сравнение — с обрезкой пробелов по краям. */
  expectedOutput: z.string().max(MAX_CODE_LENGTH),
})

/** Исход проверки шага. */
export const CodeStepResultSchema = z.enum(['passed', 'failed'])

export const CodeLessonContentSchema = z.object({
  language: CodeLanguageSchema.default('python'),
  steps: z.array(CodeStepSchema).default([]),
  /** Код ученика по шагам: id шага → код. */
  code: z.record(z.string(), z.string()).default({}),
  /** Результаты проверок: id шага → исход. Отсутствие записи — шаг не проверялся. */
  results: z.record(z.string(), CodeStepResultSchema).default({}),
})

/** Снапшот контента ресурса (ответ `code_snapshot` и `update_code_content`). */
export const CodeContentDataSchema = z.object({
  resourceId: z.string(),
  content: CodeLessonContentSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const CodeRunResultSchema = z.object({
  stdout: z.string(),
  stderr: z.string(),
  /** Код завершения процесса; null, если процесс убит по таймауту или не стартовал. */
  exitCode: z.number().nullable(),
  /** true — исполнение прервано по таймауту. */
  timedOut: z.boolean(),
  durationMs: z.number(),
})

// ─────────────────────────  Входы команд  ─────────────────────────

export const UpdateCodeContentInputSchema = z.object({
  resourceId: z.string(),
  content: CodeLessonContentSchema,
})

export const RunCodeInputSchema = z.object({
  language: CodeLanguageSchema,
  code: z.string().max(MAX_CODE_LENGTH),
})
