import { z } from 'zod'
import {
  listBacklinks as invokeListBacklinks,
  listCourseLinks as invokeListCourseLinks,
  listLinks as invokeListLinks,
} from '../api/fetch'
import type { Link, LinkSourceType, LinkTarget } from '../core/model'
import { LinkSchema } from '../core/schema'

const LinkArraySchema = z.array(LinkSchema)

export async function fetchLinks(sourceType: LinkSourceType, sourceId: string): Promise<Link[]> {
  const data = await invokeListLinks(sourceType, sourceId)

  return LinkArraySchema.parse(data)
}

export async function fetchBacklinks(target: LinkTarget): Promise<Link[]> {
  const data = await invokeListBacklinks(target)

  return LinkArraySchema.parse(data)
}

export async function fetchCourseLinks(courseId: string): Promise<Link[]> {
  const data = await invokeListCourseLinks(courseId)

  return LinkArraySchema.parse(data)
}
