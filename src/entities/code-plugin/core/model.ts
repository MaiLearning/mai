import type { z } from 'zod'
import type {
  CodeContentDataSchema,
  CodeLanguageSchema,
  CodeLessonContentSchema,
  CodeRunResultSchema,
  CodeStepResultSchema,
  CodeStepSchema,
  RunCodeInputSchema,
  UpdateCodeContentInputSchema,
} from './schema'

export type CodeLanguage = z.infer<typeof CodeLanguageSchema>
export type CodeStep = z.infer<typeof CodeStepSchema>
export type CodeStepResult = z.infer<typeof CodeStepResultSchema>
export type CodeLessonContent = z.infer<typeof CodeLessonContentSchema>
export type CodeContentData = z.infer<typeof CodeContentDataSchema>
export type CodeRunResult = z.infer<typeof CodeRunResultSchema>

export type UpdateCodeContentInput = z.infer<typeof UpdateCodeContentInputSchema>
export type RunCodeInput = z.infer<typeof RunCodeInputSchema>
