import { z } from 'zod'

export const TheoryContentSchema = z.object({
  resourceId: z.string(),
  content: z.record(z.string(), z.unknown()),
  // 0 — контент ещё ни разу не сохранялся: backend отдаёт пустой корень
  // виртуально, строка в БД появляется только на первом сохранении.
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const SaveTheoryContentInputSchema = z.object({
  resourceId: z.string(),
  content: z.record(z.string(), z.unknown()),
})
