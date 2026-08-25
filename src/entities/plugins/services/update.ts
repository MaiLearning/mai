import { sendSetPluginEnabled as invokeSetEnabled } from '../api/update'
import type { Plugin } from '../core/model'
import { validatePluginId } from '../core/rules'
import { PluginSchema, SetPluginEnabledInputSchema } from '../core/schema'

export async function setPluginEnabled(id: string, enabled: boolean): Promise<Plugin> {
  const validId = validatePluginId(id)
  const request = SetPluginEnabledInputSchema.parse({ id: validId, enabled })
  const data = await invokeSetEnabled(request.id, request.enabled)

  return PluginSchema.parse(data)
}
