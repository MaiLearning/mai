import {
  sendRegisterPlugin as invokeRegister,
  sendRegisterInternalPlugin as invokeRegisterInternal,
} from '../api/create'
import type { Plugin, RegisterInternalPluginInput, RegisterPluginInput } from '../core/model'
import { validatePluginId, validatePluginName, validatePluginVersion } from '../core/rules'
import {
  PluginSchema,
  RegisterInternalPluginInputSchema,
  RegisterPluginInputSchema,
} from '../core/schema'

export async function registerPlugin(input: RegisterPluginInput): Promise<Plugin> {
  const path = input.path.trim()
  const request = RegisterPluginInputSchema.parse({ path })
  const data = await invokeRegister(request)
  return PluginSchema.parse(data)
}

export async function registerInternalPlugin(input: RegisterInternalPluginInput): Promise<Plugin> {
  const id = validatePluginId(input.id)
  const name = validatePluginName(input.name)
  const version = validatePluginVersion(input.version)
  const description = input.description ?? null
  const author = input.author ?? null
  const request = RegisterInternalPluginInputSchema.parse({
    id,
    name,
    version,
    description,
    author,
  })
  const data = await invokeRegisterInternal(request)
  return PluginSchema.parse(data)
}
