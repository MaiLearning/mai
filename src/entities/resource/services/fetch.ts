import { z } from 'zod'
import { fetchResourceTypes as invokeFetch } from '../api/fetch'
import type { ResourceType } from '../core/model'
import { ResourceTypeSchema } from '../core/schema'

export async function fetchResourceTypes(): Promise<ResourceType[]> {
  const data = await invokeFetch()

  return z.array(ResourceTypeSchema).parse(data)
}
