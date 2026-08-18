import type { z } from 'zod'
import type { TaskContentDataSchema, TaskContentSchema, TaskSchema } from './schema'

export type Task = z.infer<typeof TaskSchema>
export type TaskContent = z.infer<typeof TaskContentSchema>
export type TaskContentData = z.infer<typeof TaskContentDataSchema>
