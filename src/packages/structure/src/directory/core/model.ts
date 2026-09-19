import type { z } from 'zod'
import type { CreateDirectoryInputSchema, DirectorySchema } from './schema'

export type Directory = z.infer<typeof DirectorySchema>
export type CreateDirectoryInput = z.infer<typeof CreateDirectoryInputSchema>
