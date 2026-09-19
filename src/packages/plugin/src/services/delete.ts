import { sendRemovePlugin as invokeRemove } from '../api/delete'
import { validatePluginId } from '../core/rules'

export async function removePlugin(id: string): Promise<void> {
  const validId = validatePluginId(id)
  await invokeRemove(validId)
}
