import { z } from 'zod'
import { fetchDirectories as invokeFetch } from '../api/fetch'
import type { Directory } from '../core/model'
import { DirectorySchema } from '../core/schema'

export async function fetchDirectories(courseId: string): Promise<Directory[]> {
  const data = await invokeFetch(courseId)

  return z.array(DirectorySchema).parse(data)
}
