import { sendDeleteLink as invokeDelete } from '../api/delete'
import { validateLinkId, validateLinkOwnerPluginId } from '../core/rules'

export async function deleteLink(id: string, ownerPluginId: string): Promise<void> {
  const linkId = validateLinkId(id)

  await invokeDelete(linkId, validateLinkOwnerPluginId(ownerPluginId))
}
