import { z } from 'zod'

const TaskOptionSchema = z.object({ id: z.string(), text: z.string() })

const ChoiceTaskSchema = z.object({
  id: z.string(),
  type: z.literal('choice'),
  question: z.string(),
  mode: z.enum(['single', 'multiple']),
  options: z.array(TaskOptionSchema),
  correctOptionIds: z.array(z.string()),
  explanation: z.string().optional(),
})
const TextTaskSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  question: z.string(),
  expectedAnswer: z.string().optional(),
  explanation: z.string().optional(),
})
const OrderingTaskSchema = z.object({
  id: z.string(),
  type: z.literal('ordering'),
  question: z.string(),
  items: z.array(TaskOptionSchema),
  correctOrderIds: z.array(z.string()),
  explanation: z.string().optional(),
})

export const TaskSchema = z.discriminatedUnion('type', [
  ChoiceTaskSchema,
  TextTaskSchema,
  OrderingTaskSchema,
])

export const TaskContentSchema = z.object({
  version: z.literal(1),
  title: z.string(),
  tasks: z.array(TaskSchema),
})

export const TaskContentDataSchema = z.object({
  resourceId: z.string(),
  content: TaskContentSchema,
  createdAt: z.number(),
  updatedAt: z.number(),
})
