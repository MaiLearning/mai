import { sendRenameDirectory as invokeRename } from '../api/update'
import { validateDirectoryId, validateDirectoryName } from '../core/rules'

export async function renameDirectory(nodeId: string, name: string): Promise<void> {
  validateDirectoryId(nodeId)
  const validName = validateDirectoryName(name)
  await invokeRename(nodeId, validName)
}
