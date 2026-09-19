import type { z } from 'zod'
import type { SaveTheoryContentInputSchema, TheoryContentSchema } from './schema'

export type TheoryContent = z.infer<typeof TheoryContentSchema>
export type SaveTheoryContentInput = z.infer<typeof SaveTheoryContentInputSchema>
