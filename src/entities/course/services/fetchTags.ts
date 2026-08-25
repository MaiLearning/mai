import { z } from 'zod'
import { fetchTags as invokeFetchTags } from '../api/fetchTags'
import type { TagStat } from '../core/model'
import { TagStatSchema } from '../core/schema'

export async function fetchAllTags(): Promise<TagStat[]> {
  const data = await invokeFetchTags()

  return z.array(TagStatSchema).parse(data)
}
