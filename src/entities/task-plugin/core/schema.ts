import { z } from 'zod'

export const TaskKindSchema = z.enum([
  'SingleChoice',
  'MultipleChoice',
  'TrueFalse',
  'Matching',
  'Ordering',
  'FillInBlank',
  'OpenAnswer',
])

export const DifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const ChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  correct: z.boolean(),
})

export const MatchPairSchema = z.object({
  id: z.string(),
  left: z.string(),
  right: z.string(),
})

export const OrderingItemSchema = z.object({
  id: z.string(),
  text: z.string(),
})

export const BlankSegmentSchema = z.object({
  id: z.string(),
  /** Текст до пропуска. Пропуск отсутствует, если blank === null. */
  text: z.string(),
  blank: z.string().nullable(),
})

const BaseTaskShape = {
  id: z.string(),
  prompt: z.string(),
  difficulty: DifficultySchema,
}

export const SingleChoiceTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('SingleChoice'),
  choices: z.array(ChoiceSchema),
})

export const MultipleChoiceTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('MultipleChoice'),
  choices: z.array(ChoiceSchema),
})

export const TrueFalseTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('TrueFalse'),
  answer: z.boolean(),
})

export const MatchingTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('Matching'),
  pairs: z.array(MatchPairSchema),
})

export const OrderingTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('Ordering'),
  items: z.array(OrderingItemSchema),
})

export const FillInBlankTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('FillInBlank'),
  segments: z.array(BlankSegmentSchema),
})

export const OpenAnswerTaskSchema = z.object({
  ...BaseTaskShape,
  kind: z.literal('OpenAnswer'),
  sampleAnswer: z.string(),
  placeholder: z.string(),
})

export const TaskSchema = z.discriminatedUnion('kind', [
  SingleChoiceTaskSchema,
  MultipleChoiceTaskSchema,
  TrueFalseTaskSchema,
  MatchingTaskSchema,
  OrderingTaskSchema,
  FillInBlankTaskSchema,
  OpenAnswerTaskSchema,
])

export const TaskContentSchema = z.object({
  tasks: z.array(TaskSchema).default([]),
})

export const TaskContentDataSchema = z.object({
  resourceId: z.string(),
  content: TaskContentSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const SaveTaskContentInputSchema = z.object({
  resourceId: z.string(),
  content: TaskContentSchema,
})
