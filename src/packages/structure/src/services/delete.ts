import { sendDeleteNode as invokeDelete } from '../api/delete'
import { validateNodeId } from '../core/rules'

export async function deleteNode(nodeId: string): Promise<void> {
  validateNodeId(nodeId)
  await invokeDelete(nodeId)
}
