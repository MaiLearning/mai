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

/**
 * Сложность задачи — id: либо пресетный (`easy`/`medium`/`hard`, пресеты
 * фиксированы на стороне плагина), либо id своей сложности из
 * `TaskContentSchema.difficulties`.
 */
export const DifficultySchema = z.string()

/** Своя сложность, задаваемая автором: название + цвет (hex). */
export const CustomDifficultySchema = z.object({
  id: z.string(),
  label: z.string(),
  color: z.string(),
})

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

/**
 * Ответ прохождения — форма зависит от типа задачи; отсутствие записи в
 * `answers` означает, что задача ещё не решалась.
 */
export const SingleChoiceAnswerSchema = z.object({
  kind: z.literal('SingleChoice'),
  choiceId: z.string().nullable(),
})

export const MultipleChoiceAnswerSchema = z.object({
  kind: z.literal('MultipleChoice'),
  choiceIds: z.array(z.string()),
})

export const TrueFalseAnswerSchema = z.object({
  kind: z.literal('TrueFalse'),
  value: z.boolean().nullable(),
})

/** id пары (термин) → id пары, чьё определение приставлено. */
export const MatchingAnswerSchema = z.object({
  kind: z.literal('Matching'),
  mapping: z.record(z.string(), z.string()),
})

export const OrderingAnswerSchema = z.object({
  kind: z.literal('Ordering'),
  itemIds: z.array(z.string()),
})

/** id сегмента с пропуском → введённый текст. */
export const FillInBlankAnswerSchema = z.object({
  kind: z.literal('FillInBlank'),
  values: z.record(z.string(), z.string()),
})

export const OpenAnswerAnswerSchema = z.object({
  kind: z.literal('OpenAnswer'),
  text: z.string(),
})

export const TaskAnswerSchema = z.discriminatedUnion('kind', [
  SingleChoiceAnswerSchema,
  MultipleChoiceAnswerSchema,
  TrueFalseAnswerSchema,
  MatchingAnswerSchema,
  OrderingAnswerSchema,
  FillInBlankAnswerSchema,
  OpenAnswerAnswerSchema,
])

export const TaskResultSchema = z.enum(['correct', 'incorrect'])

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
  /** Свои сложности набора; пресетные (`easy`/`medium`/`hard`) сюда не входят. */
  difficulties: z.array(CustomDifficultySchema).default([]),
  /** Ответы прохождения: id задачи → ответ. */
  answers: z.record(z.string(), TaskAnswerSchema).default({}),
  /** Результаты проверки: id задачи → исход. */
  results: z.record(z.string(), TaskResultSchema).default({}),
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
