import { sendDeleteDirectory as invokeDelete } from '../api/delete'
import { validateDirectoryId } from '../core/rules'

export async function deleteDirectory(nodeId: string): Promise<void> {
  validateDirectoryId(nodeId)
  await invokeDelete(nodeId)
}
