import { sendMoveNode as invokeMove, sendRenameNode as invokeRename } from '../api/update'
import {
  validateNodeId,
  validateNodeName,
  validateDirectoryId as validateParent,
  validatePosition,
} from '../core/rules'
import { RenameNodeInputSchema } from '../core/schema'

export async function moveNode(
  nodeId: string,
  newParentId: string | null,
  position: number,
): Promise<void> {
  validateNodeId(nodeId)
  if (newParentId !== null) {
    validateParent(newParentId)
  }
  validatePosition(position)
  await invokeMove(nodeId, newParentId, position)
}

export async function renameNode(nodeId: string, name: string): Promise<void> {
  const id = validateNodeId(nodeId)
  const validName = validateNodeName(name)
  const request = RenameNodeInputSchema.parse({ nodeId: id, name: validName })
  await invokeRename(request.nodeId, request.name)
}
