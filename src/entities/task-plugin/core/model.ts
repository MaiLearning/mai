import type { z } from 'zod'
import type {
  BlankSegmentSchema,
  ChoiceSchema,
  CustomDifficultySchema,
  DifficultySchema,
  FillInBlankAnswerSchema,
  FillInBlankTaskSchema,
  MatchingAnswerSchema,
  MatchingTaskSchema,
  MatchPairSchema,
  MultipleChoiceAnswerSchema,
  MultipleChoiceTaskSchema,
  OpenAnswerAnswerSchema,
  OpenAnswerTaskSchema,
  OrderingAnswerSchema,
  OrderingItemSchema,
  OrderingTaskSchema,
  SaveTaskContentInputSchema,
  SingleChoiceAnswerSchema,
  SingleChoiceTaskSchema,
  TaskAnswerSchema,
  TaskContentDataSchema,
  TaskContentSchema,
  TaskKindSchema,
  TaskResultSchema,
  TaskSchema,
  TrueFalseAnswerSchema,
  TrueFalseTaskSchema,
} from './schema'

export type TaskKind = z.infer<typeof TaskKindSchema>
export type Difficulty = z.infer<typeof DifficultySchema>
export type CustomDifficulty = z.infer<typeof CustomDifficultySchema>
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

export type SingleChoiceAnswer = z.infer<typeof SingleChoiceAnswerSchema>
export type MultipleChoiceAnswer = z.infer<typeof MultipleChoiceAnswerSchema>
export type TrueFalseAnswer = z.infer<typeof TrueFalseAnswerSchema>
export type MatchingAnswer = z.infer<typeof MatchingAnswerSchema>
export type OrderingAnswer = z.infer<typeof OrderingAnswerSchema>
export type FillInBlankAnswer = z.infer<typeof FillInBlankAnswerSchema>
export type OpenAnswerAnswer = z.infer<typeof OpenAnswerAnswerSchema>

export type TaskAnswer = z.infer<typeof TaskAnswerSchema>
export type TaskResult = z.infer<typeof TaskResultSchema>

export type AnyTask = z.infer<typeof TaskSchema>
export type TaskContent = z.infer<typeof TaskContentSchema>
export type TaskContentData = z.infer<typeof TaskContentDataSchema>
export type SaveTaskContentInput = z.infer<typeof SaveTaskContentInputSchema>
