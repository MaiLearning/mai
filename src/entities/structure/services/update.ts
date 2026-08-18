import { sendMoveNode as invokeMove } from '../api/update'
import {
  validateNodeId,
  validateDirectoryId as validateParent,
  validatePosition,
} from '../core/rules'

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
