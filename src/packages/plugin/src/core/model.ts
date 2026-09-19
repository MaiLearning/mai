import type { z } from 'zod'
import type {
  PluginKindSchema,
  PluginManifestSchema,
  PluginSchema,
  RegisterInternalPluginInputSchema,
  RegisterPluginInputSchema,
  SetPluginEnabledInputSchema,
} from './schema'

export type PluginKind = z.infer<typeof PluginKindSchema>
export type Plugin = z.infer<typeof PluginSchema>
export type PluginManifest = z.infer<typeof PluginManifestSchema>
export type RegisterPluginInput = z.infer<typeof RegisterPluginInputSchema>
export type RegisterInternalPluginInput = z.infer<typeof RegisterInternalPluginInputSchema>
export type SetPluginEnabledInput = z.infer<typeof SetPluginEnabledInputSchema>
