import type { z } from 'zod'
import type {
  BlankSegmentSchema,
  ChoiceSchema,
  DifficultySchema,
  FillInBlankTaskSchema,
  MatchingTaskSchema,
  MatchPairSchema,
  MultipleChoiceTaskSchema,
  OpenAnswerTaskSchema,
  OrderingItemSchema,
  OrderingTaskSchema,
  SaveTaskContentInputSchema,
  SingleChoiceTaskSchema,
  TaskContentDataSchema,
  TaskContentSchema,
  TaskKindSchema,
  TaskSchema,
  TrueFalseTaskSchema,
} from './schema'

export type TaskKind = z.infer<typeof TaskKindSchema>
export type Difficulty = z.infer<typeof DifficultySchema>
export type Choice = z.infer<typeof ChoiceSchema>
export type MatchPair = z.infer<typeof MatchPairSchema>
export type OrderingItem = z.infer<typeof OrderingItemSchema>
export type BlankSegment = z.infer<typeof BlankSegmentSchema>

export type SingleChoiceTask = z.infer<typeof SingleChoiceTaskSchema>
export type MultipleChoiceTask = z.infer<typeof MultipleChoiceTaskSchema>
export type TrueFalseTask = z.infer<typeof TrueFalseTaskSchema>
export type MatchingTask = z.infer<typeof MatchingTaskSchema>
export type OrderingTask = z.infer<typeof OrderingTaskSchema>
export type FillInBlankTask = z.infer<typeof FillInBlankTaskSchema>
export type OpenAnswerTask = z.infer<typeof OpenAnswerTaskSchema>

export type AnyTask = z.infer<typeof TaskSchema>
export type TaskContent = z.infer<typeof TaskContentSchema>
export type TaskContentData = z.infer<typeof TaskContentDataSchema>
export type SaveTaskContentInput = z.infer<typeof SaveTaskContentInputSchema>
