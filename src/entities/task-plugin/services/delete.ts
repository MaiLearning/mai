import {
  sendClearTaskContent as invokeClear,
  sendDeleteTaskContent as invokeDelete,
} from '../api/delete'
import type { TaskContentData } from '../core/model'
import { TaskContentDataSchema } from '../core/schema'

export async function clearTaskContent(resourceId: string): Promise<TaskContentData> {
  const data = await invokeClear(resourceId)

  return TaskContentDataSchema.parse(data)
}

export async function deleteTaskContent(resourceId: string): Promise<TaskContentData> {
  const data = await invokeDelete(resourceId)

  return TaskContentDataSchema.parse(data)
}
