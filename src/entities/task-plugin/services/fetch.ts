import { fetchTaskContent as invokeFetch } from '../api/fetch'
import type { TaskContentData } from '../core/model'
import { TaskContentDataSchema } from '../core/schema'

export async function fetchTaskContent(resourceId: string): Promise<TaskContentData> {
  const data = await invokeFetch(resourceId)

  return TaskContentDataSchema.parse(data)
}
