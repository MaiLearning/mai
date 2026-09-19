import { z } from 'zod'

export const PluginKindSchema = z.enum(['internal', 'external'])

export const PluginSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string().nullable(),
  description: z.string().nullable(),
  version: z.string(),
  enabled: z.boolean(),
  kind: PluginKindSchema,
  installedAt: z.number(),
  updatedAt: z.number(),
})

export const PluginManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  main: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
  resources: z.array(z.string()).nullable(),
})

export const RegisterPluginInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
  code: z.string(),
  sdkVersion: z.string(),
})

export const RegisterInternalPluginInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  description: z.string().nullable(),
  author: z.string().nullable(),
})

export const SetPluginEnabledInputSchema = z.object({
  id: z.string(),
  enabled: z.boolean(),
})
