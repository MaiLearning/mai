import { z } from 'zod'

/** Ограничения URI-цели ссылки (зеркалят backend-правила). */
export const LINK_URI_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:.+/
export const MAX_LINK_URI_LENGTH = 2048

export const LinkSourceTypeEnumSchema = z.enum(['resource', 'course'])

const LinkTargetUriSchema = z.object({
  kind: z.literal('uri'),
  uri: z.string().max(MAX_LINK_URI_LENGTH).regex(LINK_URI_PATTERN),
})

export const LinkTargetSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('resource'),
    courseId: z.string(),
    resourceId: z.string(),
  }),
  z.object({
    kind: z.literal('course'),
    courseId: z.string(),
  }),
  LinkTargetUriSchema,
])

export const LinkTargetStatusSchema = z.enum(['ok', 'broken'])

export const LinkSchema = z.object({
  id: z.string(),
  sourceType: LinkSourceTypeEnumSchema,
  sourceId: z.string(),
  target: LinkTargetSchema,
  ownerPluginId: z.string().min(1),
  title: z.string().max(200).nullable(),
  description: z.string().max(2000).nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
  targetStatus: LinkTargetStatusSchema,
})

export const CreateLinkInputSchema = z.object({
  sourceType: LinkSourceTypeEnumSchema,
  sourceId: z.string(),
  target: LinkTargetSchema,
  ownerPluginId: z.string().min(1),
  title: z.string().max(200).nullish(),
  description: z.string().max(2000).nullish(),
})

export const UpdateLinkInputSchema = z.object({
  id: z.string(),
  ownerPluginId: z.string().min(1),
  title: z.string().max(200).nullish(),
  description: z.string().max(2000).nullish(),
  target: LinkTargetSchema.optional(),
})
